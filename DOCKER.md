# 🐳 ChatBot Multiplataforma - Docker

Guía completa para ejecutar el ChatBot Multiplataforma usando Docker.

## 📋 Prerrequisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y ejecutándose
- Git (para clonar el repositorio)

## 🚀 Inicio Rápido

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd ChatBot
```

### 2. Ejecutar en modo DEMO (Recomendado para pruebas)
```bash
# Windows
scripts\docker-build.bat demo

# Linux/Mac
chmod +x scripts/docker-build.sh
./scripts/docker-build.sh demo
```

### 3. Acceder al panel de administración
Abre tu navegador y ve a: **http://localhost:3000/admin**

## 🎯 Modos de Ejecución

### 🎮 Modo DEMO
- **Propósito**: Pruebas y demostración
- **Puerto**: 3000
- **Características**: 
  - Conversaciones simuladas
  - Respuestas automáticas
  - No requiere APIs reales
- **Comando**: `./scripts/docker-build.sh demo`

### 🚀 Modo PRODUCCIÓN
- **Propósito**: Uso real con APIs
- **Puerto**: 3000
- **Características**:
  - Conexión real con WhatsApp, Instagram, Facebook
  - Requiere archivo `.env` configurado
- **Comando**: `./scripts/docker-build.sh prod`

### 🔧 Modo DESARROLLO
- **Propósito**: Desarrollo con hot-reload
- **Puerto**: 3001
- **Características**:
  - Hot-reload con nodemon
  - Volúmenes montados para cambios en tiempo real
- **Comando**: `./scripts/docker-build.sh dev`

## 📁 Archivos Docker

### Dockerfile
```dockerfile
# Imagen base: Node.js 18 Alpine
FROM node:18-alpine

# Configuración de seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S chatbot -u 1001

# Instalación de dependencias y código
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN chown -R chatbot:nodejs /app
USER chatbot

# Configuración
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
```

### docker-compose.yml
- **Servicio principal**: `chatbot`
- **Servicio de desarrollo**: `chatbot-dev` (perfil `dev`)
- **Red**: `chatbot-network`
- **Healthcheck**: Verificación automática de salud

### docker-compose.demo.yml
- **Servicio**: `chatbot-demo`
- **Comando**: `npm run demo`
- **Red**: `chatbot-demo-network`

## 🔧 Comandos Docker Manuales

### Construir imagen
```bash
# Modo demo
docker-compose -f docker-compose.demo.yml build

# Modo producción
docker-compose build

# Modo desarrollo
docker-compose build
```

### Ejecutar contenedores
```bash
# Modo demo
docker-compose -f docker-compose.demo.yml up -d

# Modo producción
docker-compose up -d

# Modo desarrollo
docker-compose --profile dev up -d
```

### Ver logs
```bash
# Modo demo
docker-compose -f docker-compose.demo.yml logs -f

# Modo producción
docker-compose logs -f

# Modo desarrollo
docker-compose logs -f chatbot-dev
```

### Detener contenedores
```bash
# Modo demo
docker-compose -f docker-compose.demo.yml down

# Modo producción/desarrollo
docker-compose down
```

## 🔍 Verificar Estado

### Listar contenedores
```bash
docker ps
```

### Ver logs en tiempo real
```bash
docker logs -f chatbot-multiplataforma
```

### Acceder al contenedor
```bash
docker exec -it chatbot-multiplataforma sh
```

## ⚙️ Configuración de Variables de Entorno

### Para modo PRODUCCIÓN
1. Copiar archivo de ejemplo:
```bash
cp env.example .env
```

2. Editar `.env` con tus credenciales reales:
```env
# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=tu_token_real
WHATSAPP_PHONE_NUMBER_ID=tu_phone_id_real
WHATSAPP_VERIFY_TOKEN=tu_verify_token_real

# Instagram Messaging API
INSTAGRAM_ACCESS_TOKEN=tu_token_real
INSTAGRAM_PAGE_ID=tu_page_id_real
INSTAGRAM_VERIFY_TOKEN=tu_verify_token_real

# Facebook Messenger API
FACEBOOK_ACCESS_TOKEN=tu_token_real
FACEBOOK_PAGE_ID=tu_page_id_real
FACEBOOK_VERIFY_TOKEN=tu_verify_token_real
```

## 🐛 Solución de Problemas

### Error: "Docker no está ejecutándose"
```bash
# Verificar estado de Docker
docker info

# Iniciar Docker Desktop si es necesario
```

### Error: "Puerto ya en uso"
```bash
# Verificar qué usa el puerto 3000
netstat -ano | findstr :3000

# Detener contenedores existentes
docker-compose down
```

### Error: "No se puede construir la imagen"
```bash
# Limpiar cache de Docker
docker system prune -a

# Reconstruir sin cache
docker-compose build --no-cache
```

### Error: "Permisos denegados" (Linux/Mac)
```bash
# Dar permisos de ejecución al script
chmod +x scripts/docker-build.sh
```

## 📊 Monitoreo y Logs

### Ver logs del contenedor
```bash
# Logs en tiempo real
docker logs -f chatbot-multiplataforma

# Últimas 100 líneas
docker logs --tail 100 chatbot-multiplataforma

# Logs con timestamps
docker logs -t chatbot-multiplataforma
```

### Estadísticas del contenedor
```bash
# Uso de recursos
docker stats chatbot-multiplataforma

# Información detallada
docker inspect chatbot-multiplataforma
```

## 🔄 Actualizaciones

### Actualizar código
```bash
# Detener contenedores
docker-compose down

# Reconstruir imagen
docker-compose build

# Reiniciar contenedores
docker-compose up -d
```

### Actualizar dependencias
```bash
# Editar package.json
# Reconstruir imagen
docker-compose build --no-cache
docker-compose up -d
```

## 🚀 Despliegue en Producción

### Variables de entorno para producción
```bash
# Crear archivo .env.production
cp env.example .env.production

# Editar con valores de producción
nano .env.production
```

### Docker Compose para producción
```yaml
version: '3.8'
services:
  chatbot:
    build: .
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    restart: always
    ports:
      - "3000:3000"
```

## 📝 Notas Importantes

- **Seguridad**: El contenedor se ejecuta como usuario no-root
- **Persistencia**: Los datos se almacenan en memoria (temporal)
- **Logs**: Se muestran en stdout/stderr del contenedor
- **Healthcheck**: Verificación automática cada 30 segundos
- **Restart**: Política `unless-stopped` para reinicio automático

## 🆘 Soporte

Si encuentras problemas:

1. Verifica que Docker Desktop esté ejecutándose
2. Revisa los logs del contenedor
3. Asegúrate de que el puerto 3000 esté libre
4. Verifica la configuración del archivo `.env`

---

**¡Disfruta usando tu ChatBot containerizado! 🐳** 