-- Esquema de Base de Datos para MÜLLBLUE ChatBot
-- MySQL/PostgreSQL compatible

-- Tabla de clientes
CREATE TABLE customers (
    id VARCHAR(50) PRIMARY KEY,
    platform VARCHAR(20) NOT NULL, -- whatsapp, instagram, facebook
    phone_number VARCHAR(20),
    email VARCHAR(100),
    name VARCHAR(100),
    household_size INT, -- número de personas en el hogar
    preferred_model VARCHAR(50), -- modelo de compostero preferido
    stage VARCHAR(20) DEFAULT 'cold', -- cold, warm, hot, purchase, delivered
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de conversaciones
CREATE TABLE conversations (
    id VARCHAR(100) PRIMARY KEY,
    customer_id VARCHAR(50),
    platform VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, closed, archived
    total_messages INT DEFAULT 0,
    last_message_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Tabla de mensajes
CREATE TABLE messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conversation_id VARCHAR(100),
    customer_id VARCHAR(50),
    direction VARCHAR(10) NOT NULL, -- incoming, outgoing
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text', -- text, image, video, audio
    intent VARCHAR(50), -- precio, envio, funcionamiento, etc.
    confidence DECIMAL(3,2), -- confianza de la IA
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Tabla de productos (composteros)
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    household_size_min INT,
    household_size_max INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de órdenes
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50),
    product_id VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, shipped, delivered
    total_amount DECIMAL(10,2),
    shipping_address TEXT,
    tracking_number VARCHAR(100),
    estimated_delivery DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Tabla de seguimiento postventa
CREATE TABLE post_sale_tracking (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(50),
    order_id VARCHAR(50),
    compost_start_date DATE,
    last_check_in DATE,
    satisfaction_level INT, -- 1-5
    has_issues BOOLEAN DEFAULT FALSE,
    issues_description TEXT,
    support_needed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Tabla de intents y respuestas
CREATE TABLE intents (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50), -- ventas, soporte, postventa
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de respuestas automáticas
CREATE TABLE auto_responses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    intent_id VARCHAR(50),
    platform VARCHAR(20), -- whatsapp, instagram, facebook, all
    response_text TEXT NOT NULL,
    response_type VARCHAR(20) DEFAULT 'text', -- text, image, quick_replies
    priority INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (intent_id) REFERENCES intents(id)
);

-- Tabla de analytics
CREATE TABLE analytics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date DATE,
    platform VARCHAR(20),
    total_conversations INT DEFAULT 0,
    total_messages INT DEFAULT 0,
    conversions INT DEFAULT 0, -- conversiones a compra
    avg_response_time INT, -- en segundos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX idx_customers_platform ON customers(platform);
CREATE INDEX idx_customers_stage ON customers(stage);
CREATE INDEX idx_conversations_customer ON conversations(customer_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_customer ON messages(customer_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Datos iniciales
INSERT INTO products (id, name, description, price, household_size_min, household_size_max) VALUES
('compostero-s', 'Compostero S', 'Ideal para 1-2 personas', 899.00, 1, 2),
('compostero-m', 'Compostero M', 'Ideal para 3-4 personas', 1299.00, 3, 4),
('compostero-l', 'Compostero L', 'Ideal para 5+ personas', 1599.00, 5, 10);

INSERT INTO intents (id, name, description, category) VALUES
('precio', 'Consulta de precios', 'Información sobre precios de productos', 'ventas'),
('envio', 'Consulta de envío', 'Información sobre envíos y entregas', 'ventas'),
('funcionamiento', 'Cómo funciona', 'Explicación del proceso de compostaje', 'ventas'),
('tamaño-hogar', 'Tamaño del hogar', 'Consulta sobre número de personas', 'ventas'),
('problemas-compostaje', 'Problemas con compostaje', 'Soporte para problemas postventa', 'postventa'),
('seguimiento', 'Seguimiento de orden', 'Estado de pedidos y entregas', 'postventa'); 