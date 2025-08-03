const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class ConversationService {
  async createConversation(conversationData) {
    try {
      const conversationId = uuidv4();
      const sql = `
        INSERT INTO conversations (id, customer_id, platform, status, total_messages, last_message_at)
        VALUES (?, ?, ?, ?, ?, NOW())
      `;
      
      await db.query(sql, [
        conversationId,
        conversationData.customer_id,
        conversationData.platform,
        conversationData.status || 'active',
        conversationData.total_messages || 0
      ]);

      return { id: conversationId, ...conversationData };
    } catch (error) {
      console.error('Error creando conversación:', error);
      throw error;
    }
  }

  async getConversation(conversationId) {
    try {
      const sql = `
        SELECT c.*, cu.name as customer_name, cu.phone_number, cu.stage as customer_stage
        FROM conversations c
        LEFT JOIN customers cu ON c.customer_id = cu.id
        WHERE c.id = ?
      `;
      
      const conversations = await db.query(sql, [conversationId]);
      return conversations[0] || null;
    } catch (error) {
      console.error('Error obteniendo conversación:', error);
      throw error;
    }
  }

  async getConversationByCustomer(customerId, platform) {
    try {
      const sql = `
        SELECT * FROM conversations 
        WHERE customer_id = ? AND platform = ? AND status = 'active'
        ORDER BY updated_at DESC
        LIMIT 1
      `;
      
      const conversations = await db.query(sql, [customerId, platform]);
      return conversations[0] || null;
    } catch (error) {
      console.error('Error obteniendo conversación por cliente:', error);
      throw error;
    }
  }

  async updateConversation(conversationId, updateData) {
    try {
      const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updateData);
      
      const sql = `
        UPDATE conversations 
        SET ${fields}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      await db.query(sql, [...values, conversationId]);
      return true;
    } catch (error) {
      console.error('Error actualizando conversación:', error);
      throw error;
    }
  }

  async addMessage(messageData) {
    try {
      const sql = `
        INSERT INTO messages (conversation_id, customer_id, direction, content, message_type, intent, confidence)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      const result = await db.query(sql, [
        messageData.conversation_id,
        messageData.customer_id,
        messageData.direction,
        messageData.content,
        messageData.message_type || 'text',
        messageData.intent,
        messageData.confidence
      ]);

      // Actualizar contador de mensajes en la conversación
      await this.updateConversation(messageData.conversation_id, {
        total_messages: messageData.conversation_id ? 
          await this.getConversationMessageCount(messageData.conversation_id) : 1,
        last_message_at: new Date()
      });

      return { id: result.insertId, ...messageData };
    } catch (error) {
      console.error('Error agregando mensaje:', error);
      throw error;
    }
  }

  async getConversationMessageCount(conversationId) {
    try {
      const sql = `
        SELECT COUNT(*) as count FROM messages 
        WHERE conversation_id = ?
      `;
      
      const result = await db.query(sql, [conversationId]);
      return result[0].count;
    } catch (error) {
      console.error('Error obteniendo conteo de mensajes:', error);
      return 0;
    }
  }

  async getMessages(conversationId, limit = 50, offset = 0) {
    try {
      const sql = `
        SELECT * FROM messages 
        WHERE conversation_id = ?
        ORDER BY created_at ASC
        LIMIT ? OFFSET ?
      `;
      
      return await db.query(sql, [conversationId, limit, offset]);
    } catch (error) {
      console.error('Error obteniendo mensajes:', error);
      throw error;
    }
  }

  async getAllConversations(limit = 100, offset = 0) {
    try {
      const sql = `
        SELECT c.*, cu.name as customer_name, cu.phone_number, cu.stage as customer_stage,
               (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id) as message_count
        FROM conversations c
        LEFT JOIN customers cu ON c.customer_id = cu.id
        ORDER BY c.updated_at DESC
        LIMIT ? OFFSET ?
      `;
      
      return await db.query(sql, [limit, offset]);
    } catch (error) {
      console.error('Error obteniendo todas las conversaciones:', error);
      throw error;
    }
  }

  async getConversationsByPlatform(platform, limit = 100, offset = 0) {
    try {
      const sql = `
        SELECT c.*, cu.name as customer_name, cu.phone_number, cu.stage as customer_stage,
               (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id) as message_count
        FROM conversations c
        LEFT JOIN customers cu ON c.customer_id = cu.id
        WHERE c.platform = ?
        ORDER BY c.updated_at DESC
        LIMIT ? OFFSET ?
      `;
      
      return await db.query(sql, [platform, limit, offset]);
    } catch (error) {
      console.error('Error obteniendo conversaciones por plataforma:', error);
      throw error;
    }
  }

  async getConversationStats() {
    try {
      const sql = `
        SELECT 
          platform,
          COUNT(*) as total_conversations,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_conversations,
          COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 END) as conversations_today,
          COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as conversations_this_week
        FROM conversations 
        GROUP BY platform
      `;
      
      return await db.query(sql);
    } catch (error) {
      console.error('Error obteniendo estadísticas de conversaciones:', error);
      throw error;
    }
  }

  async closeConversation(conversationId) {
    try {
      const sql = `
        UPDATE conversations 
        SET status = 'closed', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      await db.query(sql, [conversationId]);
      return true;
    } catch (error) {
      console.error('Error cerrando conversación:', error);
      throw error;
    }
  }
}

module.exports = new ConversationService(); 