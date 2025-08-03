// Configuración de variables de entorno con valores por defecto
module.exports = {
  // Configuración del servidor
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // WhatsApp Business API
  WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN || '',
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  WHATSAPP_VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN || 'MULLBLUE_VERIFY_TOKEN_123',

  // Instagram Messaging API
  INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN || '',
  INSTAGRAM_PAGE_ID: process.env.INSTAGRAM_PAGE_ID || '',
  INSTAGRAM_VERIFY_TOKEN: process.env.INSTAGRAM_VERIFY_TOKEN || 'MULLBLUE_VERIFY_TOKEN_123',

  // Facebook Messenger API
  FACEBOOK_ACCESS_TOKEN: process.env.FACEBOOK_ACCESS_TOKEN || '',
  FACEBOOK_PAGE_ID: process.env.FACEBOOK_PAGE_ID || '',
  FACEBOOK_VERIFY_TOKEN: process.env.FACEBOOK_VERIFY_TOKEN || 'MULLBLUE_VERIFY_TOKEN_123',

  // Configuración de seguridad
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET || 'MULLBLUE_WEBHOOK_SECRET_123',

  // Base de datos MySQL
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'mullblue_chatbot',
  DB_PORT: process.env.DB_PORT || 3306,

  // OpenAI API
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',

  // AWS (opcional)
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  AWS_REGION: process.env.AWS_REGION || 'us-east-1'
}; 