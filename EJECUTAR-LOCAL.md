# 🚀 Ejecutar ChatBot en Local - Guía Rápida

## ⚡ Opción 1: Instalación Automática (Recomendada)

### Paso 1: Instalar Node.js automáticamente
```bash
# Ejecuta el instalador automático
instalar-nodejs.bat
```

### Paso 2: Instalar dependencias
```bash
npm install
```

### Paso 3: Ejecutar en modo DEMO (sin configuración de APIs)
```bash
npm run demo
```

## ⚡ Opción 2: Instalación Manual

### Paso 1: Instalar Node.js manualmente
1. Ve a [nodejs.org](https://nodejs.org/)
2. Descarga la versión LTS
3. Instala y reinicia PowerShell

### Paso 2: Verificar instalación
```bash
node --version
npm --version
```

### Paso 3: Instalar dependencias
```bash
npm install
```

### Paso 4: Ejecutar en modo DEMO
```bash
npm run demo
```

## 🎯 ¿Qué hace el modo DEMO?

El modo demo te permite probar el chatbot **sin necesidad de configurar las APIs de Meta**:

✅ **Interfaz web completa** - Panel de administración funcional  
✅ **Conversaciones simuladas** - Datos de ejemplo precargados  
✅ **Chat en tiempo real** - Socket.IO funcionando  
✅ **Respuestas automáticas** - IA simulada que responde  
✅ **Múltiples plataformas** - WhatsApp, Instagram, Facebook  

## 📱 Conversaciones de Demo Incluidas

- **WhatsApp**: Usuario 123456789
- **Instagram**: Usuario 987654321  
- **Facebook**: Usuario 555666777

## 🎮 Cómo Probar

1. **Ejecuta el servidor:**
   ```bash
   npm run demo
   ```

2. **Abre tu navegador:**
   ```
   http://localhost:3000/admin
   ```

3. **Selecciona una conversación** de la lista

4. **Envía mensajes** desde el panel web

5. **Observa las respuestas automáticas** que aparecen después de 2 segundos

## 🔧 Comandos Disponibles

```bash
# Modo demo (recomendado para probar)
npm run demo

# Modo demo con recarga automática
npm run demo:dev

# Modo completo (requiere configuración de APIs)
npm start

# Modo completo con recarga automática
npm run dev
```

## 🎯 Funcionalidades del Demo

### Respuestas Automáticas
El chatbot responde automáticamente a:
- **Saludos**: "Hola", "Buenos días"
- **Precios**: "Precio", "Costo", "Cuánto"
- **Horarios**: "Horario", "Horarios"
- **Contacto**: "Contacto", "Teléfono"
- **Productos**: "Producto", "Servicio"
- **Envíos**: "Envío", "Entrega"

### Características del Panel
- **Vista general** de todas las conversaciones
- **Filtros por plataforma** (WhatsApp, Instagram, Facebook)
- **Chat en tiempo real** con Socket.IO
- **Estadísticas** en tiempo real
- **Interfaz moderna** y responsive

## 🚨 Solución de Problemas

### Error: "npm no se reconoce"
```bash
# Reinstala Node.js y reinicia PowerShell
instalar-nodejs.bat
```

### Error: "Puerto 3000 en uso"
```bash
# Cambia el puerto en el archivo .env
PORT=3001
```

### Error: "Módulo no encontrado"
```bash
# Reinstala las dependencias
npm install
```

## 🎉 ¡Listo!

Una vez que ejecutes `npm run demo`, verás:

```
🎉 ========================================
🤖 ChatBot Multiplataforma - MODO DEMO
🎉 ========================================
🚀 Servidor ejecutándose en puerto 3000
🖥️  Panel de administración: http://localhost:3000/admin

📱 Conversaciones de demo cargadas:
   - WhatsApp: 123456789
   - Instagram: 987654321
   - Facebook: 555666777

💡 Puedes probar enviando mensajes desde el panel web
🎯 Las respuestas automáticas se generarán después de 2 segundos
🎉 ========================================
```

**¡Disfruta probando tu ChatBot Multiplataforma! 🚀** 