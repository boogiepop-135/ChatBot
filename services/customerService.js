const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class CustomerService {
  async createCustomer(customerData) {
    try {
      const customerId = uuidv4();
      const sql = `
        INSERT INTO customers (id, platform, phone_number, email, name, household_size, preferred_model, stage)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      await db.query(sql, [
        customerId,
        customerData.platform,
        customerData.phone_number,
        customerData.email,
        customerData.name,
        customerData.household_size,
        customerData.preferred_model,
        customerData.stage || 'cold'
      ]);

      return { id: customerId, ...customerData };
    } catch (error) {
      console.error('Error creando cliente:', error);
      throw error;
    }
  }

  async getCustomerByPhone(phoneNumber, platform) {
    try {
      const sql = `
        SELECT * FROM customers 
        WHERE phone_number = ? AND platform = ?
      `;
      
      const customers = await db.query(sql, [phoneNumber, platform]);
      return customers[0] || null;
    } catch (error) {
      console.error('Error obteniendo cliente:', error);
      throw error;
    }
  }

  async updateCustomer(customerId, updateData) {
    try {
      const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updateData);
      
      const sql = `
        UPDATE customers 
        SET ${fields}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      await db.query(sql, [...values, customerId]);
      return true;
    } catch (error) {
      console.error('Error actualizando cliente:', error);
      throw error;
    }
  }

  async updateCustomerStage(customerId, newStage) {
    try {
      const sql = `
        UPDATE customers 
        SET stage = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      await db.query(sql, [newStage, customerId]);
      return true;
    } catch (error) {
      console.error('Error actualizando etapa del cliente:', error);
      throw error;
    }
  }

  async getCustomersByStage(stage) {
    try {
      const sql = `
        SELECT * FROM customers 
        WHERE stage = ?
        ORDER BY updated_at DESC
      `;
      
      return await db.query(sql, [stage]);
    } catch (error) {
      console.error('Error obteniendo clientes por etapa:', error);
      throw error;
    }
  }

  async getAllCustomers(limit = 100, offset = 0) {
    try {
      const sql = `
        SELECT * FROM customers 
        ORDER BY updated_at DESC
        LIMIT ? OFFSET ?
      `;
      
      return await db.query(sql, [limit, offset]);
    } catch (error) {
      console.error('Error obteniendo todos los clientes:', error);
      throw error;
    }
  }

  async getCustomerStats() {
    try {
      const sql = `
        SELECT 
          stage,
          COUNT(*) as count,
          COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as new_this_week,
          COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_this_month
        FROM customers 
        GROUP BY stage
      `;
      
      return await db.query(sql);
    } catch (error) {
      console.error('Error obteniendo estadísticas de clientes:', error);
      throw error;
    }
  }
}

module.exports = new CustomerService(); 