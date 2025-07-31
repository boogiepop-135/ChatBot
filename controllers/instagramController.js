const axios = require('axios');

class InstagramController {
  constructor() {
    this.accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    this.pageId = process.env.INSTAGRAM_PAGE_ID;
    this.verifyToken = process.env.INSTAGRAM_VERIFY_TOKEN;
    this.apiUrl = 'https://graph.facebook.com/v18.0';
  }

  // Verificar webhook para Instagram
  verifyWebhook(req, res) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === this.verifyToken) {
      console.log('✅ Webhook de Instagram verificado');
      res.status(200).send(challenge);
    } else {
      console.log('❌ Verificación de webhook de Instagram fallida');
      res.sendStatus(403);
    }
  }

  // Manejar mensajes entrantes de Instagram
  async handleWebhook(req, res) {
    try {
      const body = req.body;

      if (body.object === 'instagram') {
        const entry = body.entry[0];
        const messaging = entry.messaging[0];
        
        if (messaging) {
          await this.processMessage(messaging);
        }
      }

      res.status(200).send('OK');
    } catch (error) {
      console.error('Error en webhook de Instagram:', error);
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
    this.saveMessage('instagram', senderId, 'incoming', content, messageType);

    // Generar respuesta automática
    const response = await this.generateResponse(content);
    await this.sendMessage(senderId, response);

    // Notificar a la interfaz web en tiempo real
    if (global.io) {
      global.io.to(`conversation-instagram-${senderId}`).emit('new-message', {
        platform: 'instagram',
        userId: senderId,
        message: content,
        type: 'incoming',
        timestamp: new Date()
      });
    }
  }

  // Enviar mensaje a Instagram
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
      this.saveMessage('instagram', to, 'outgoing', message, 'text');

      console.log('✅ Mensaje enviado a Instagram:', to);
      return response.data;
    } catch (error) {
      console.error('❌ Error enviando mensaje a Instagram:', error.response?.data || error.message);
      throw error;
    }
  }

  // Generar respuesta automática
  async generateResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hola') || message.includes('buenos días') || message.includes('buenas')) {
      return '¡Hola! 👋 Soy tu asistente virtual de Instagram. ¿En qué puedo ayudarte hoy?';
    }
    
    if (message.includes('producto') || message.includes('servicio') || message.includes('catalogo')) {
      return '¡Perfecto! 📸 Te ayudo con información sobre nuestros productos. ¿Qué te interesa?';
    }
    
    if (message.includes('envío') || message.includes('envio') || message.includes('entrega')) {
      return '🚚 Realizamos envíos a todo el país. Los tiempos de entrega varían entre 2-5 días hábiles.';
    }
    
    if (message.includes('pago') || message.includes('tarjeta') || message.includes('transferencia')) {
      return '💳 Aceptamos pagos con tarjeta, transferencia bancaria y efectivo. ¿Cuál prefieres?';
    }
    
    return '¡Gracias por contactarnos! 📱 Un agente te responderá pronto. ¡Síguenos para más contenido! 😊';
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

module.exports = new InstagramController(); 