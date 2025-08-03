# 📱 Configuración Completa de WhatsApp para tu ChatBot

## 🚀 Configuración Automática (Recomendado)

Ejecuta el script de configuración automática:

```bash
node configurar-whatsapp.js
```

## 📋 Configuración Manual Paso a Paso

### 1. 🔑 Obtener Credenciales de Meta Business Suite

#### Paso 1.1: Crear cuenta en Meta Business Suite
1. Ve a [Meta Business Suite](https://business.facebook.com/)
2. Crea una cuenta de negocio
3. Verifica tu cuenta con tu número de teléfono

#### Paso 1.2: Configurar WhatsApp Business API
1. En el panel de Meta Business Suite, ve a "WhatsApp" → "Getting Started"
2. Sigue el asistente de configuración
3. Selecciona tu número de teléfono (puedes usar el número de prueba)

#### Paso 1.3: Obtener credenciales
En la sección "Enviar y recibir mensajes" encontrarás:

- **WhatsApp Access Token**: Token de acceso de la API
- **WhatsApp Phone Number ID**: ID del número de teléfono (ej: 656715344202650)
- **WhatsApp Business Account ID**: ID de la cuenta de WhatsApp Business

### 2. 📝 Crear archivo .env

Copia el archivo `env.example` y renómbralo a `.env`:

```bash
cp env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# Configuración del servidor
PORT=3000
NODE_ENV=development

# Meta Business Suite - WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=tu_access_token_aqui
WHATSAPP_PHONE_NUMBER_ID=tu_phone_number_id_aqui
WHATSAPP_VERIFY_TOKEN=MULLBLUE_VERIFY_TOKEN_123

# Otras configuraciones...
```

### 3. 🌐 Configuración del Webhook

#### Paso 3.1: Exponer tu servidor local (para desarrollo)

**Opción A - ngrok (Recomendado):**
```bash
# Instalar ngrok
npm install -g ngrok

# Exponer puerto 3000
ngrok http 3000
```

**Opción B - localtunnel:**
```bash
# Exponer puerto 3000
npx localtunnel --port 3000
```

#### Paso 3.2: Configurar webhook en Meta Business Suite

En Meta Business Suite, ve a la configuración de webhooks y configura:

**📡 URL del Webhook:**
- Para desarrollo: `https://tu-tunnel.ngrok.io/webhook/whatsapp`
- Para producción: `https://tu-dominio.com/webhook/whatsapp`

**🔐 Verify Token:**
- `MULLBLUE_VERIFY_TOKEN_123` (o el que configures en .env)

**📋 Campos a suscribir:**
- ✅ `messages` - Mensajes entrantes
- ✅ `message_deliveries` - Confirmaciones de entrega
- ✅ `message_reads` - Confirmaciones de lectura

### 4. 🚀 Ejecutar el servidor

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# O en modo producción
npm start
```

### 5. ✅ Verificar la configuración

1. **Servidor ejecutándose**: `http://localhost:3000`
2. **Panel de administración**: `http://localhost:3000/admin`
3. **Webhook de WhatsApp**: `http://localhost:3000/webhook/whatsapp`

### 6. 🧪 Probar la conexión

1. Envía un mensaje a tu número de WhatsApp Business
2. Verifica que aparece en el panel de administración
3. Confirma que recibes respuestas automáticas

## 🔧 Solución de Problemas

### Error: "Webhook verification failed"
- Verifica que el Verify Token coincida exactamente
- Asegúrate de que la URL del webhook sea accesible públicamente

### Error: "Invalid access token"
- Verifica que el Access Token sea correcto
- Confirma que no haya espacios extra

### Error: "Phone number ID not found"
- Verifica que el Phone Number ID sea correcto
- Confirma que el número esté activo en Meta Business Suite

### El servidor no recibe mensajes
- Verifica que el webhook esté configurado correctamente
- Confirma que la URL sea accesible desde internet
- Revisa los logs del servidor para errores

## 📊 URLs Importantes

- **Meta Business Suite**: https://business.facebook.com/
- **WhatsApp Business API Docs**: https://developers.facebook.com/docs/whatsapp
- **Panel de administración**: http://localhost:3000/admin
- **Webhook de WhatsApp**: http://localhost:3000/webhook/whatsapp

## 🎯 Próximos Pasos

Una vez configurado WhatsApp, puedes:

1. **Personalizar respuestas automáticas** en `controllers/whatsappController.js`
2. **Configurar Instagram** siguiendo el mismo proceso
3. **Configurar Facebook Messenger** para completar la integración
4. **Implementar base de datos** para guardar conversaciones
5. **Agregar inteligencia artificial** con OpenAI

¡Tu chatbot está listo para recibir mensajes de WhatsApp! 🎉 