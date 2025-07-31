const axios = require('axios');

class FacebookController {
  constructor() {
    this.accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    this.pageId = process.env.FACEBOOK_PAGE_ID;
    this.verifyToken = process.env.FACEBOOK_VERIFY_TOKEN;
    this.apiUrl = 'https://graph.facebook.com/v18.0';
  }

  // Verificar webhook para Facebook
  verifyWebhook(req, res) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === this.verifyToken) {
      console.log('✅ Webhook de Facebook verificado');
      res.status(200).send(challenge);
    } else {
      console.log('❌ Verificación de webhook de Facebook fallida');
      res.sendStatus(403);
    }
  }

  // Manejar mensajes entrantes de Facebook
  async handleWebhook(req, res) {
    try {
      const body = req.body;

      if (body.object === 'page') {
        const entry = body.entry[0];
        const messaging = entry.messaging[0];
        
        if (messaging) {
          await this.processMessage(messaging);
        }
      }

      res.status(200).send('OK');
    } catch (error) {
      console.error('Error en webhook de Facebook:', error);
      res.status(500).send('Error interno del servidor');
    }
  }

  // Procesar mensaje entrante
  async processMessage(messaging) {
    const senderId = messaging.sender.id;
    const message = messaging.message;
    let content = '';
    let messageType = 'text';

    if (message.text) {
      content = message.text;
      messageType = 'text';
    } else if (message.attachments && message.attachments.length > 0) {
      const attachment = message.attachments[0];
      messageType = attachment.type;
      content = `[${attachment.type.charAt(0).toUpperCase() + attachment.type.slice(1)}]`;
    }

    // Guardar mensaje
    this.saveMessage('facebook', senderId, 'incoming', content, messageType);

    // Generar respuesta automática
    const response = await this.generateResponse(content);
    await this.sendMessage(senderId, response);

    // Notificar a la interfaz web en tiempo real
    if (global.io) {
      global.io.to(`conversation-facebook-${senderId}`).emit('new-message', {
        platform: 'facebook',
        userId: senderId,
        message: content,
        type: 'incoming',
        timestamp: new Date()
      });
    }
  }

  // Enviar mensaje a Facebook
  async sendMessage(to, message) {
    try {
      const url = `${this.apiUrl}/${this.pageId}/messages`;
      const data = {
        recipient: { id: to },
        message: { text: message }
      };

      const response = await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Guardar mensaje enviado
      this.saveMessage('facebook', to, 'outgoing', message, 'text');

      console.log('✅ Mensaje enviado a Facebook:', to);
      return response.data;
    } catch (error) {
      console.error('❌ Error enviando mensaje a Facebook:', error.response?.data || error.message);
      throw error;
    }
  }

  // Generar respuesta automática
  async generateResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hola') || message.includes('buenos días') || message.includes('buenas')) {
      return '¡Hola! 👋 Soy tu asistente virtual de Facebook. ¿En qué puedo ayudarte hoy?';
    }
    
    if (message.includes('información') || message.includes('info') || message.includes('datos')) {
      return '📋 Te ayudo con toda la información que necesites. ¿Qué te gustaría saber?';
    }
    
    if (message.includes('soporte') || message.includes('ayuda') || message.includes('problema')) {
      return '🛠️ Estoy aquí para ayudarte. ¿Cuál es el problema que tienes?';
    }
    
    if (message.includes('redes') || message.includes('social') || message.includes('instagram')) {
      return '📱 Síguenos en nuestras redes sociales: Instagram @tuempresa, Twitter @tuempresa';
    }
    
    return '¡Gracias por contactarnos! 👍 Un agente te responderá pronto. ¡Que tengas un excelente día! 😊';
  }

  // Guardar mensaje
  saveMessage(platform, userId, direction, content, type) {
    const message = {
      platform,
      userId,
      direction,
      content,
      type,
      timestamp: new Date()
    };
    
    console.log('💾 Mensaje guardado:', message);
  }
}

module.exports = new FacebookController(); 