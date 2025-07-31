# 📋 Guía de Instalación - ChatBot Multiplataforma

## 🔧 Requisitos Previos

### 1. Instalar Node.js

1. Ve a [nodejs.org](https://nodejs.org/)
2. Descarga la versión LTS (Long Term Support)
3. Ejecuta el instalador y sigue las instrucciones
4. Verifica la instalación abriendo PowerShell y ejecutando:
   ```bash
   node --version
   npm --version
   ```

### 2. Instalar Git (opcional pero recomendado)

1. Ve a [git-scm.com](https://git-scm.com/)
2. Descarga e instala Git para Windows
3. Verifica la instalación:
   ```bash
   git --version
   ```

## 🚀 Instalación del ChatBot

### Paso 1: Abrir PowerShell como Administrador

1. Presiona `Windows + X`
2. Selecciona "Windows PowerShell (Administrador)"

### Paso 2: Navegar al directorio del proyecto

```bash
cd "C:\Users\TecnologíaenSistemas\Nueva carpeta\ChatBot"
```

### Paso 3: Instalar dependencias

```bash
npm install
```

### Paso 4: Configurar variables de entorno

1. Copia el archivo de ejemplo:
   ```bash
   copy env.example .env
   ```

2. Edita el archivo `.env` con tus credenciales (ver sección de configuración de APIs)

### Paso 5: Ejecutar el servidor

```bash
# Para desarrollo (con recarga automática)
npm run dev

# Para producción
npm start
```

## 🔑 Configuración de APIs

### WhatsApp Business API

1. **Crear aplicación en Meta for Developers:**
   - Ve a [developers.facebook.com](https://developers.facebook.com/)
   - Haz clic en "Crear aplicación"
   - Selecciona "Business" como tipo
   - Completa la información básica

2. **Configurar WhatsApp Business API:**
   - En el dashboard de tu aplicación, busca "WhatsApp"
   - Haz clic en "Configurar"
   - Sigue el asistente de configuración

3. **Obtener credenciales:**
   - Phone Number ID: Se encuentra en la configuración de WhatsApp
   - Access Token: Genera un token de acceso permanente
   - Verify Token: Crea un token personalizado (puede ser cualquier string)

4. **Configurar webhook:**
   - URL: `https://tu-dominio.com/webhook/whatsapp`
   - Verify Token: El mismo que configuraste en el .env

### Instagram Messaging API

1. **En la misma aplicación de Meta:**
   - Ve a "Productos" → "Instagram Basic Display"
   - Configura la integración

2. **Conectar cuenta de Instagram:**
   - Conecta tu cuenta de Instagram Business
   - Obtén el Page ID

3. **Configurar webhook:**
   - URL: `https://tu-dominio.com/webhook/instagram`

### Facebook Messenger API

1. **En la aplicación de Meta:**
   - Ve a "Productos" → "Facebook Login"
   - Configura la integración

2. **Obtener credenciales:**
   - Page ID: ID de tu página de Facebook
   - Access Token: Token de acceso de la página

3. **Configurar webhook:**
   - URL: `https://tu-dominio.com/webhook/facebook`

## 🌐 Exponer tu servidor local

Para que las APIs de Meta puedan enviar mensajes a tu chatbot, necesitas exponer tu servidor local:

### Opción 1: ngrok (Recomendado para desarrollo)

1. **Instalar ngrok:**
   - Ve a [ngrok.com](https://ngrok.com/)
   - Descarga e instala ngrok
   - Regístrate para obtener un token gratuito

2. **Exponer el puerto:**
   ```bash
   ngrok http 3000
   ```

3. **Usar la URL de ngrok:**
   - Copia la URL HTTPS que te da ngrok
   - Úsala en la configuración de webhooks

### Opción 2: Despliegue en la nube

- **Heroku:** Gratuito para desarrollo
- **Vercel:** Muy fácil de usar
- **Railway:** Alternativa moderna
- **DigitalOcean:** Para proyectos más grandes

## 🧪 Probar el ChatBot

### 1. Verificar que el servidor esté funcionando

```bash
npm start
```

Deberías ver:
```
🚀 Servidor ejecutándose en puerto 3000
📱 WhatsApp webhook: http://localhost:3000/webhook/whatsapp
📸 Instagram webhook: http://localhost:3000/webhook/instagram
📘 Facebook webhook: http://localhost:3000/webhook/facebook
🖥️  Panel de administración: http://localhost:3000/admin
```

### 2. Acceder al panel de administración

Abre tu navegador y ve a: `http://localhost:3000/admin`

### 3. Probar webhooks

Puedes probar los webhooks manualmente:

```bash
# WhatsApp
curl -X GET "http://localhost:3000/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=tu_token&hub.challenge=test"

# Instagram
curl -X GET "http://localhost:3000/webhook/instagram?hub.mode=subscribe&hub.verify_token=tu_token&hub.challenge=test"

# Facebook
curl -X GET "http://localhost:3000/webhook/facebook?hub.mode=subscribe&hub.verify_token=tu_token&hub.challenge=test"
```

## 🔧 Solución de Problemas

### Error: "npm no se reconoce"

**Solución:** Node.js no está instalado o no está en el PATH
1. Reinstala Node.js
2. Reinicia PowerShell
3. Verifica con `node --version`

### Error: "Puerto 3000 en uso"

**Solución:** Cambia el puerto en el archivo `.env`
```env
PORT=3001
```

### Error: "Webhook verification failed"

**Solución:** Verifica que:
1. El verify token coincida en Meta y en tu .env
2. La URL del webhook sea accesible desde internet
3. El servidor esté ejecutándose

### Error: "Access token invalid"

**Solución:** 
1. Regenera el token de acceso en Meta for Developers
2. Actualiza el .env con el nuevo token
3. Reinicia el servidor

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs del servidor
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que los webhooks estén configurados correctamente
4. Consulta la documentación de [Meta for Developers](https://developers.facebook.com/)

---

**¡Tu ChatBot Multiplataforma está listo para usar! 🚀** 