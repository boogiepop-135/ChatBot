#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🤖 CONFIGURACIÓN AUTOMÁTICA DE WHATSAPP PARA TU CHATBOT');
console.log('=====================================================\n');

// Función para hacer preguntas
function pregunta(texto) {
  return new Promise((resolve) => {
    rl.question(texto, (respuesta) => {
      resolve(respuesta.trim());
    });
  });
}

// Función para crear archivo .env
function crearArchivoEnv(config) {
  const envContent = `# Configuración del servidor
PORT=3000
NODE_ENV=development

# Meta Business Suite - WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=${config.accessToken}
WHATSAPP_PHONE_NUMBER_ID=${config.phoneNumberId}
WHATSAPP_VERIFY_TOKEN=${config.verifyToken}

# Meta Business Suite - Instagram Messaging API
INSTAGRAM_ACCESS_TOKEN=tu_instagram_access_token_aqui
INSTAGRAM_PAGE_ID=tu_instagram_page_id_aqui
INSTAGRAM_VERIFY_TOKEN=tu_instagram_verify_token_aqui

# Meta Business Suite - Facebook Messenger API
FACEBOOK_ACCESS_TOKEN=tu_facebook_access_token_aqui
FACEBOOK_PAGE_ID=tu_facebook_page_id_aqui
FACEBOOK_VERIFY_TOKEN=tu_facebook_verify_token_aqui

# Configuración de seguridad
WEBHOOK_SECRET=MULLBLUE_WEBHOOK_SECRET_123

# Base de datos MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_aqui
DB_NAME=mullblue_chatbot
DB_PORT=3306

# OpenAI API
OPENAI_API_KEY=tu_openai_api_key_aqui

# AWS (opcional para Lex V2)
AWS_ACCESS_KEY_ID=tu_aws_access_key_aqui
AWS_SECRET_ACCESS_KEY=tu_aws_secret_key_aqui
AWS_REGION=us-east-1
`;

  fs.writeFileSync('.env', envContent);
}

async function configurarWhatsApp() {
  try {
    console.log('📋 PASO 1: Obtener credenciales de Meta Business Suite');
    console.log('-----------------------------------------------------');
    console.log('1. Ve a: https://business.facebook.com/');
    console.log('2. Crea una cuenta de negocio');
    console.log('3. Configura WhatsApp Business API');
    console.log('4. Obtén los siguientes datos:\n');

    const accessToken = await pregunta('🔑 WhatsApp Access Token: ');
    const phoneNumberId = await pregunta('📱 WhatsApp Phone Number ID: ');
    const verifyToken = await pregunta('🔐 Verify Token (o presiona Enter para usar MULLBLUE_VERIFY_TOKEN_123): ') || 'MULLBLUE_VERIFY_TOKEN_123';

    console.log('\n📝 PASO 2: Creando archivo de configuración...');
    
    const config = {
      accessToken,
      phoneNumberId,
      verifyToken
    };

    crearArchivoEnv(config);
    console.log('✅ Archivo .env creado exitosamente');

    console.log('\n🌐 PASO 3: Configuración del Webhook');
    console.log('-----------------------------------');
    console.log('En Meta Business Suite, configura el webhook con:');
    console.log('');
    console.log('📡 URL del Webhook:');
    console.log('   Para desarrollo local: https://tu-tunnel.ngrok.io/webhook/whatsapp');
    console.log('   Para producción: https://tu-dominio.com/webhook/whatsapp');
    console.log('');
    console.log('🔐 Verify Token: ' + verifyToken);
    console.log('');
    console.log('📋 Campos a suscribir:');
    console.log('   ✅ messages');
    console.log('   ✅ message_deliveries');
    console.log('   ✅ message_reads');

    console.log('\n🚀 PASO 4: Ejecutar el servidor');
    console.log('-----------------------------');
    console.log('1. Instalar dependencias: npm install');
    console.log('2. Ejecutar servidor: npm run dev');
    console.log('3. El servidor estará en: http://localhost:3000');
    console.log('4. Panel de administración: http://localhost:3000/admin');

    console.log('\n🔧 PASO 5: Exponer servidor local (para desarrollo)');
    console.log('------------------------------------------------');
    console.log('Opción 1 - ngrok:');
    console.log('  npm install -g ngrok');
    console.log('  ngrok http 3000');
    console.log('');
    console.log('Opción 2 - localtunnel:');
    console.log('  npx localtunnel --port 3000');

    console.log('\n✅ CONFIGURACIÓN COMPLETADA');
    console.log('==========================');
    console.log('Tu chatbot está listo para recibir mensajes de WhatsApp!');

  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message);
  } finally {
    rl.close();
  }
}

// Ejecutar configuración
configurarWhatsApp(); 