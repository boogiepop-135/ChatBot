const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
  constructor() {
    this.connection = null;
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'mullblue_chatbot',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };
  }

  async connect() {
    try {
      this.connection = await mysql.createConnection(this.config);
      console.log('✅ Base de datos conectada exitosamente');
      
      // Crear tablas si no existen
      await this.createTables();
      
      return this.connection;
    } catch (error) {
      console.error('❌ Error conectando a la base de datos:', error);
      throw error;
    }
  }

  async createTables() {
    try {
      // Tabla de clientes
      await this.connection.execute(`
        CREATE TABLE IF NOT EXISTS customers (
          id VARCHAR(50) PRIMARY KEY,
          platform VARCHAR(20) NOT NULL,
          phone_number VARCHAR(20),
          email VARCHAR(100),
          name VARCHAR(100),
          household_size INT,
          preferred_model VARCHAR(50),
          stage VARCHAR(20) DEFAULT 'cold',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      // Tabla de conversaciones
      await this.connection.execute(`
        CREATE TABLE IF NOT EXISTS conversations (
          id VARCHAR(100) PRIMARY KEY,
          customer_id VARCHAR(50),
          platform VARCHAR(20) NOT NULL,
          status VARCHAR(20) DEFAULT 'active',
          total_messages INT DEFAULT 0,
          last_message_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (customer_id) REFERENCES customers(id)
        )
      `);

      // Tabla de mensajes
      await this.connection.execute(`
        CREATE TABLE IF NOT EXISTS messages (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          conversation_id VARCHAR(100),
          customer_id VARCHAR(50),
          direction VARCHAR(10) NOT NULL,
          content TEXT NOT NULL,
          message_type VARCHAR(20) DEFAULT 'text',
          intent VARCHAR(50),
          confidence DECIMAL(3,2),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (conversation_id) REFERENCES conversations(id),
          FOREIGN KEY (customer_id) REFERENCES customers(id)
        )
      `);

      // Tabla de productos
      await this.connection.execute(`
        CREATE TABLE IF NOT EXISTS products (
          id VARCHAR(50) PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          price DECIMAL(10,2),
          household_size_min INT,
          household_size_max INT,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabla de órdenes
      await this.connection.execute(`
        CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(50) PRIMARY KEY,
          customer_id VARCHAR(50),
          product_id VARCHAR(50),
          status VARCHAR(20) DEFAULT 'pending',
          total_amount DECIMAL(10,2),
          shipping_address TEXT,
          tracking_number VARCHAR(100),
          estimated_delivery DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (customer_id) REFERENCES customers(id),
          FOREIGN KEY (product_id) REFERENCES products(id)
        )
      `);

      // Insertar datos iniciales
      await this.insertInitialData();
      
      console.log('✅ Tablas creadas exitosamente');
    } catch (error) {
      console.error('❌ Error creando tablas:', error);
      throw error;
    }
  }

  async insertInitialData() {
    try {
      // Insertar productos
      await this.connection.execute(`
        INSERT IGNORE INTO products (id, name, description, price, household_size_min, household_size_max) VALUES
        ('compostero-s', 'Compostero S', 'Ideal para 1-2 personas', 899.00, 1, 2),
        ('compostero-m', 'Compostero M', 'Ideal para 3-4 personas', 1299.00, 3, 4),
        ('compostero-l', 'Compostero L', 'Ideal para 5+ personas', 1599.00, 5, 10)
      `);

      console.log('✅ Datos iniciales insertados');
    } catch (error) {
      console.error('❌ Error insertando datos iniciales:', error);
    }
  }

  async query(sql, params = []) {
    try {
      const [rows] = await this.connection.execute(sql, params);
      return rows;
    } catch (error) {
      console.error('❌ Error ejecutando query:', error);
      throw error;
    }
  }

  async close() {
    if (this.connection) {
      await this.connection.end();
      console.log('✅ Conexión a base de datos cerrada');
    }
  }
}

module.exports = new Database(); 