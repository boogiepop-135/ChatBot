const whatsappController = require('./whatsappController');
const instagramController = require('./instagramController');
const facebookController = require('./facebookController');

class ChatbotController {
  constructor() {
    // Almacenamiento temporal de conversaciones (en producción usar base de datos)
    this.conversations = new Map();
  }

  // Obtener todas las conversaciones
  getConversations(req, res) {
    try {
      // Verificar que conversations existe y es una instancia válida
      if (!this.conversations || !(this.conversations instanceof Map)) {
        this.conversations = new Map();
      }
      
      const conversations = Array.from(this.conversations.values());
      res.json({
        success: true,
        data: conversations
      });
    } catch (error) {
      console.error('Error obteniendo conversaciones:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Obtener una conversación específica
  getConversation(req, res) {
    try {
      const { platform, userId } = req.params;
      const conversationKey = `${platform}-${userId}`;
      const conversation = this.conversations.get(conversationKey);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          error: 'Conversación no encontrada'
        });
      }

      res.json({
        success: true,
        data: conversation
      });
    } catch (error) {
      console.error('Error obteniendo conversación:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Enviar mensaje manual desde la interfaz web
  async sendMessage(req, res) {
    try {
      const { platform, userId, message } = req.body;

      if (!platform || !userId || !message) {
        return res.status(400).json({
          success: false,
          error: 'Faltan parámetros requeridos'
        });
      }

      let response;
      switch (platform) {
        case 'whatsapp':
          response = await whatsappController.sendMessage(userId, message);
          break;
        case 'instagram':
          response = await instagramController.sendMessage(userId, message);
          break;
        case 'facebook':
          response = await facebookController.sendMessage(userId, message);
          break;
        default:
          return res.status(400).json({
            success: false,
            error: 'Plataforma no soportada'
          });
      }

      // Guardar mensaje en la conversación
      this.saveMessageToConversation(platform, userId, 'outgoing', message, 'text');

      // Notificar en tiempo real
      if (global.io) {
        global.io.to(`conversation-${platform}-${userId}`).emit('new-message', {
          platform,
          userId,
          message,
          type: 'outgoing',
          timestamp: new Date()
        });
      }

      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Guardar mensaje en la conversación
  saveMessageToConversation(platform, userId, direction, content, type) {
    const conversationKey = `${platform}-${userId}`;
    const message = {
      id: Date.now(),
      platform,
      userId,
      direction,
      content,
      type,
      timestamp: new Date()
    };

    if (!this.conversations.has(conversationKey)) {
      this.conversations.set(conversationKey, {
        id: conversationKey,
        platform,
        userId,
        messages: [],
        lastMessage: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    const conversation = this.conversations.get(conversationKey);
    conversation.messages.push(message);
    conversation.lastMessage = message;
    conversation.updatedAt = new Date();

    console.log(`💾 Mensaje guardado en conversación ${conversationKey}:`, message);
  }

  // Método para que otros controladores guarden mensajes
  saveMessage(platform, userId, direction, content, type) {
    this.saveMessageToConversation(platform, userId, direction, content, type);
  }

  // Obtener estadísticas del chatbot
  getStats(req, res) {
    try {
      const conversations = Array.from(this.conversations.values());
      const stats = {
        totalConversations: conversations.length,
        conversationsByPlatform: {
          whatsapp: conversations.filter(c => c.platform === 'whatsapp').length,
          instagram: conversations.filter(c => c.platform === 'instagram').length,
          facebook: conversations.filter(c => c.platform === 'facebook').length
        },
        totalMessages: conversations.reduce((total, conv) => total + conv.messages.length, 0),
        activeToday: conversations.filter(c => {
          const today = new Date();
          const lastMessage = new Date(c.updatedAt);
          return lastMessage.toDateString() === today.toDateString();
        }).length
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
}

module.exports = new ChatbotController(); 