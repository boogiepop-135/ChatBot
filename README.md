# 🤖 ChatBot Multiplataforma

Un chatbot inteligente que funciona con **WhatsApp**, **Instagram** y **Facebook Messenger** desde una interfaz web moderna y fácil de usar.

## ✨ Características

- 📱 **Multiplataforma**: Integración nativa con WhatsApp, Instagram y Facebook
- 🌐 **Interfaz Web**: Panel de administración moderno y responsive
- ⚡ **Tiempo Real**: Actualizaciones instantáneas con Socket.IO
- 🤖 **Respuestas Automáticas**: Lógica inteligente para respuestas automáticas
- 📊 **Estadísticas**: Dashboard con métricas en tiempo real
- 🔒 **Seguro**: Webhooks verificados y autenticación segura

## 🚀 Instalación

### 🐳 Opción 1: Con Docker (Recomendado)

#### Prerrequisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y ejecutándose

#### Inicio Rápido
```bash
# 1. Clonar el repositorio
git clone <tu-repositorio>
cd ChatBot

# 2. Ejecutar en modo DEMO (recomendado para pruebas)
# Windows
scripts\docker-build.bat demo

# Linux/Mac
chmod +x scripts/docker-build.sh
./scripts/docker-build.sh demo

# 3. Acceder al panel
# Abre: http://localhost:3000/admin
```

#### Modos Disponibles
- **Demo**: `./scripts/docker-build.sh demo` - Conversaciones simuladas
- **Producción**: `./scripts/docker-build.sh prod` - APIs reales (requiere .env)
- **Desarrollo**: `./scripts/docker-build.sh dev` - Hot-reload

📖 **Ver documentación completa de Docker**: [DOCKER.md](DOCKER.md)

### 💻 Opción 2: Instalación Local

#### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd ChatBot
```

#### 2. Instalar dependencias
```bash
npm install
```

#### 3. Configurar variables de entorno
```bash
cp env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# Configuración del servidor
PORT=3000
NODE_ENV=development

# Meta Business Suite - WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=tu_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=tu_whatsapp_phone_number_id
WHATSAPP_VERIFY_TOKEN=tu_whatsapp_verify_token

# Meta Business Suite - Instagram Messaging API
INSTAGRAM_ACCESS_TOKEN=tu_instagram_access_token
INSTAGRAM_PAGE_ID=tu_instagram_page_id
INSTAGRAM_VERIFY_TOKEN=tu_instagram_verify_token

# Meta Business Suite - Facebook Messenger API
FACEBOOK_ACCESS_TOKEN=tu_facebook_access_token
FACEBOOK_PAGE_ID=tu_facebook_page_id
FACEBOOK_VERIFY_TOKEN=tu_facebook_verify_token

# Configuración de seguridad
WEBHOOK_SECRET=tu_webhook_secret
```

#### 4. Ejecutar el servidor
```bash
# Desarrollo
npm run dev

# Producción
npm start

# Demo (sin APIs reales)
npm run demo
```

## 🔧 Configuración de APIs

### WhatsApp Business API

1. Ve a [Meta for Developers](https://developers.facebook.com/)
2. Crea una nueva aplicación
3. Configura WhatsApp Business API
4. Obtén tu `Phone Number ID` y `Access Token`
5. Configura el webhook: `https://tu-dominio.com/webhook/whatsapp`

### Instagram Messaging API

1. En la misma aplicación de Meta
2. Configura Instagram Basic Display
3. Conecta tu cuenta de Instagram Business
4. Obtén tu `Page ID` y `Access Token`
5. Configura el webhook: `https://tu-dominio.com/webhook/instagram`

### Facebook Messenger API

1. En la aplicación de Meta
2. Configura Facebook Login
3. Obtén tu `Page ID` y `Access Token`
4. Configura el webhook: `https://tu-dominio.com/webhook/facebook`

## 📱 Uso

### Panel de Administración

Accede al panel web en: `http://localhost:3000/admin`

- **Vista General**: Todas las conversaciones de todas las plataformas
- **Filtros por Plataforma**: WhatsApp, Instagram, Facebook
- **Chat en Tiempo Real**: Envía y recibe mensajes instantáneamente
- **Estadísticas**: Métricas de conversaciones y mensajes

### Funcionalidades del Chatbot

El chatbot responde automáticamente a:

- **Saludos**: "Hola", "Buenos días", "Buenas"
- **Precios**: "Precio", "Costo", "Cuánto"
- **Horarios**: "Horario", "Horarios", "Cuándo"
- **Contacto**: "Contacto", "Teléfono", "Email"

### Respuestas Personalizadas

Puedes personalizar las respuestas editando los métodos `generateResponse()` en cada controlador:

- `controllers/whatsappController.js`
- `controllers/instagramController.js`
- `controllers/facebookController.js`

## 🏗️ Estructura del Proyecto

```
ChatBot/
├── controllers/
│   ├── whatsappController.js    # Controlador de WhatsApp
│   ├── instagramController.js   # Controlador de Instagram
│   ├── facebookController.js    # Controlador de Facebook
│   └── chatbotController.js     # Controlador principal
├── public/
│   └── admin.html              # Interfaz web
├── server.js                   # Servidor principal
├── package.json               # Dependencias
├── env.example               # Variables de entorno
└── README.md                 # Documentación
```

## 🔌 APIs Disponibles

### Webhooks
- `GET/POST /webhook/whatsapp` - Webhook de WhatsApp
- `GET/POST /webhook/instagram` - Webhook de Instagram
- `GET/POST /webhook/facebook` - Webhook de Facebook

### API REST
- `GET /api/conversations` - Obtener todas las conversaciones
- `GET /api/conversations/:platform/:userId` - Obtener conversación específica
- `POST /api/send-message` - Enviar mensaje manual

## 🚀 Despliegue

### Heroku
```bash
heroku create tu-chatbot
heroku config:set NODE_ENV=production
git push heroku main
```

### Vercel
```bash
vercel --prod
```

### DigitalOcean
```bash
# Configura tu droplet y usa PM2
pm2 start server.js --name chatbot
pm2 startup
pm2 save
```

## 🔒 Seguridad

- **Webhooks Verificados**: Cada plataforma verifica la autenticidad
- **Tokens Seguros**: Almacenamiento seguro de tokens de acceso
- **HTTPS Requerido**: Para producción, usa siempre HTTPS
- **Rate Limiting**: Implementa límites de velocidad para las APIs

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación de [Meta for Developers](https://developers.facebook.com/)
2. Verifica que tus tokens de acceso sean válidos
3. Asegúrate de que los webhooks estén configurados correctamente
4. Revisa los logs del servidor para errores

## 🎯 Próximas Características

- [ ] Base de datos para persistencia
- [ ] IA avanzada con OpenAI/GPT
- [ ] Plantillas de mensajes
- [ ] Análisis de sentimientos
- [ ] Integración con CRM
- [ ] Notificaciones push
- [ ] Multiidioma
- [ ] Dashboard avanzado

---

**¡Disfruta usando tu ChatBot Multiplataforma! 🚀**