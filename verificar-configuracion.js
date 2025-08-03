#!/usr/bin/env node

const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

console.log('🔍 VERIFICACIÓN DE CONFIGURACIÓN DE WHATSAPP');
console.log('===========================================\n');

// Verificar archivo .env
function verificarArchivoEnv() {
  console.log('📝 Verificando archivo .env...');
  
  if (!fs.existsSync('.env')) {
    console.log('❌ Archivo .env no encontrado');
    console.log('💡 Ejecuta: cp env.example .env');
    return false;
  }
  
  console.log('✅ Archivo .env encontrado');
  return true;
}

// Verificar variables de entorno
function verificarVariables() {
  console.log('\n🔑 Verificando variables de entorno...');
  
  const variables = [
    'WHATSAPP_ACCESS_TOKEN',
    'WHATSAPP_PHONE_NUMBER_ID',
    'WHATSAPP_VERIFY_TOKEN'
  ];
  
  let todasConfiguradas = true;
  
  variables.forEach(variable => {
    const valor = process.env[variable];
    if (!valor || valor === '') {
      console.log(`❌ ${variable}: No configurada`);
      todasConfiguradas = false;
    } else if (valor.includes('tu_') || valor.includes('aqui')) {
      console.log(`⚠️  ${variable}: Valor de ejemplo detectado`);
      todasConfiguradas = false;
    } else {
      console.log(`✅ ${variable}: Configurada`);
    }
  });
  
  return todasConfiguradas;
}

// Verificar conexión con WhatsApp API
async function verificarAPI() {
  console.log('\n🌐 Verificando conexión con WhatsApp API...');
  
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  
  if (!accessToken || !phoneNumberId) {
    console.log('❌ No se puede verificar API - credenciales faltantes');
    return false;
  }
  
  try {
    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    console.log('✅ Conexión con WhatsApp API exitosa');
    console.log(`📱 Número: ${response.data.verified_name || 'No verificado'}`);
    console.log(`🆔 ID: ${response.data.id}`);
    return true;
  } catch (error) {
    console.log('❌ Error conectando con WhatsApp API:');
    if (error.response?.data?.error) {
      console.log(`   ${error.response.data.error.message}`);
    } else {
      console.log(`   ${error.message}`);
    }
    return false;
  }
}

// Verificar servidor local
async function verificarServidor() {
  console.log('\n🚀 Verificando servidor local...');
  
  try {
    const response = await axios.get('http://localhost:3000', { timeout: 5000 });
    console.log('✅ Servidor ejecutándose en puerto 3000');
    return true;
  } catch (error) {
    console.log('❌ Servidor no ejecutándose en puerto 3000');
    console.log('💡 Ejecuta: npm run dev');
    return false;
  }
}

// Verificar webhook
async function verificarWebhook() {
  console.log('\n🔗 Verificando webhook...');
  
  try {
    const response = await axios.get('http://localhost:3000/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=' + process.env.WHATSAPP_VERIFY_TOKEN + '&hub.challenge=test', { timeout: 5000 });
    console.log('✅ Webhook de WhatsApp accesible');
    return true;
  } catch (error) {
    console.log('❌ Webhook de WhatsApp no accesible');
    console.log('💡 Asegúrate de que el servidor esté ejecutándose');
    return false;
  }
}

// Función principal
async function verificarTodo() {
  console.log('Iniciando verificación completa...\n');
  
  const resultados = {
    archivoEnv: verificarArchivoEnv(),
    variables: verificarVariables(),
    api: await verificarAPI(),
    servidor: await verificarServidor(),
    webhook: await verificarWebhook()
  };
  
  console.log('\n📊 RESUMEN DE VERIFICACIÓN');
  console.log('==========================');
  
  Object.entries(resultados).forEach(([test, resultado]) => {
    const icono = resultado ? '✅' : '❌';
    const nombre = {
      archivoEnv: 'Archivo .env',
      variables: 'Variables de entorno',
      api: 'Conexión API',
      servidor: 'Servidor local',
      webhook: 'Webhook'
    }[test];
    
    console.log(`${icono} ${nombre}`);
  });
  
  const exitosos = Object.values(resultados).filter(Boolean).length;
  const total = Object.keys(resultados).length;
  
  console.log(`\n🎯 Resultado: ${exitosos}/${total} verificaciones exitosas`);
  
  if (exitosos === total) {
    console.log('\n🎉 ¡Configuración completa! Tu chatbot está listo para WhatsApp');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Configura el webhook en Meta Business Suite');
    console.log('2. Usa ngrok para exponer tu servidor: ngrok http 3000');
    console.log('3. URL del webhook: https://tu-tunnel.ngrok.io/webhook/whatsapp');
    console.log('4. Verify Token: ' + process.env.WHATSAPP_VERIFY_TOKEN);
  } else {
    console.log('\n🔧 Configuración incompleta. Revisa los errores arriba.');
  }
}

// Ejecutar verificación
verificarTodo().catch(console.error); 