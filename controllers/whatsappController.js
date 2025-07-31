const axios = require('axios');
const crypto = require('crypto');

class WhatsAppController {
  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    this.apiUrl = 'https://graph.facebook.com/v18.0';
  }

  // Verificar webhook para WhatsApp
  verifyWebhook(req, res) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === this.verifyToken) {
      console.log('✅ Webhook de WhatsApp verificado');
      res.status(200).send(challenge);
    } else {
      console.log('❌ Verificación de webhook de WhatsApp fallida');
      res.sendStatus(403);
    }
  }

  // Manejar mensajes entrantes de WhatsApp
  async handleWebhook(req, res) {
    try {
      const body = req.body;

      if (body.object === 'whatsapp_business_account') {
        const entry = body.entry[0];
        const changes = entry.changes[0];
        const value = changes.value;

        if (value.messages && value.messages.length > 0) {
          const message = value.messages[0];
          await this.processMessage(message);
        }
      }

      res.status(200).send('OK');
    } catch (error) {
      console.error('Error en webhook de WhatsApp:', error);
      res.status(500).send('Error interno del servidor');
    }
  }

  // Procesar mensaje entrante
  async processMessage(message) {
    const from = message.from;
    const messageType = message.type;
    let content = '';

    switch (messageType) {
      case 'text':
        content = message.text.body;
        break;
      case 'image':
        content = '[Imagen]';
        break;
      case 'video':
        content = '[Video]';
        break;
      case 'audio':
        content = '[Audio]';
        break;
      case 'document':
        content = '[Documento]';
        break;
      default:
        content = '[Mensaje no soportado]';
    }

    // Guardar mensaje en la base de datos (implementar después)
    this.saveMessage('whatsapp', from, 'incoming', content, messageType);

    // Generar respuesta automática
    const response = await this.generateResponse(content);
    await this.sendMessage(from, response);

    // Notificar a la interfaz web en tiempo real
    if (global.io) {
      global.io.to(`conversation-whatsapp-${from}`).emit('new-message', {
        platform: 'whatsapp',
        userId: from,
        message: content,
        type: 'incoming',
        timestamp: new Date()
      });
    }
  }

  // Enviar mensaje a WhatsApp
  async sendMessage(to, message) {
    try {
      const url = `${this.apiUrl}/${this.phoneNumberId}/messages`;
      const data = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: message }
      };

      const response = await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Guardar mensaje enviado
      this.saveMessage('whatsapp', to, 'outgoing', message, 'text');

      console.log('✅ Mensaje enviado a WhatsApp:', to);
      return response.data;
    } catch (error) {
      console.error('❌ Error enviando mensaje a WhatsApp:', error.response?.data || error.message);
      throw error;
    }
  }

  // Generar respuesta automática (lógica básica)
  async generateResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hola') || message.includes('buenos días') || message.includes('buenas')) {
      return '¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?';
    }
    
    if (message.includes('precio') || message.includes('costo') || message.includes('cuánto')) {
      return 'Te ayudo con información sobre precios. ¿Qué producto o servicio te interesa?';
    }
    
    if (message.includes('horario') || message.includes('horarios') || message.includes('cuándo')) {
      return 'Nuestros horarios de atención son de lunes a viernes de 9:00 AM a 6:00 PM.';
    }
    
    if (message.includes('contacto') || message.includes('teléfono') || message.includes('email')) {
      return 'Puedes contactarnos al 📞 +1-234-567-8900 o 📧 info@tuempresa.com';
    }
    
    return 'Gracias por tu mensaje. Un agente humano te responderá pronto. 😊';
  }

  // Guardar mensaje (implementación básica - después se conectará a base de datos)
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
    // Aquí se implementará la conexión a base de datos
  }
}

module.exports = new WhatsAppController(); 