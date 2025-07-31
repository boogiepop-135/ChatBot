const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Almacenamiento temporal de conversaciones para demo
const conversations = new Map();

// Simular conversaciones de demo
const demoConversations = [
  {
    id: 'whatsapp-123456789',
    platform: 'whatsapp',
    userId: '123456789',
    messages: [
      {
        id: 1,
        platform: 'whatsapp',
        userId: '123456789',
        direction: 'incoming',
        content: 'Hola, ¿tienen productos disponibles?',
        type: 'text',
        timestamp: new Date(Date.now() - 300000)
      },
      {
        id: 2,
        platform: 'whatsapp',
        userId: '123456789',
        direction: 'outgoing',
        content: '¡Hola! 👋 Sí, tenemos muchos productos disponibles. ¿Qué te interesa?',
        type: 'text',
        timestamp: new Date(Date.now() - 240000)
      }
    ],
    lastMessage: {
      content: '¡Hola! 👋 Sí, tenemos muchos productos disponibles. ¿Qué te interesa?',
      timestamp: new Date(Date.now() - 240000)
    },
    createdAt: new Date(Date.now() - 300000),
    updatedAt: new Date(Date.now() - 240000)
  },
  {
    id: 'instagram-987654321',
    platform: 'instagram',
    userId: '987654321',
    messages: [
      {
        id: 3,
        platform: 'instagram',
        userId: '987654321',
        direction: 'incoming',
        content: '¿Cuál es el precio del producto?',
        type: 'text',
        timestamp: new Date(Date.now() - 180000)
      },
      {
        id: 4,
        platform: 'instagram',
        userId: '987654321',
        direction: 'outgoing',
        content: 'Te ayudo con información sobre precios. ¿Qué producto te interesa?',
        type: 'text',
        timestamp: new Date(Date.now() - 120000)
      }
    ],
    lastMessage: {
      content: 'Te ayudo con información sobre precios. ¿Qué producto te interesa?',
      timestamp: new Date(Date.now() - 120000)
    },
    createdAt: new Date(Date.now() - 180000),
    updatedAt: new Date(Date.now() - 120000)
  },
  {
    id: 'facebook-555666777',
    platform: 'facebook',
    userId: '555666777',
    messages: [
      {
        id: 5,
        platform: 'facebook',
        userId: '555666777',
        direction: 'incoming',
        content: '¿Cuáles son sus horarios de atención?',
        type: 'text',
        timestamp: new Date(Date.now() - 60000)
      },
      {
        id: 6,
        platform: 'facebook',
        userId: '555666777',
        direction: 'outgoing',
        content: 'Nuestros horarios de atención son de lunes a viernes de 9:00 AM a 6:00 PM.',
        type: 'text',
        timestamp: new Date(Date.now() - 30000)
      }
    ],
    lastMessage: {
      content: 'Nuestros horarios de atención son de lunes a viernes de 9:00 AM a 6:00 PM.',
      timestamp: new Date(Date.now() - 30000)
    },
    createdAt: new Date(Date.now() - 60000),
    updatedAt: new Date(Date.now() - 30000)
  }
];

// Cargar conversaciones de demo
demoConversations.forEach(conv => {
  conversations.set(conv.id, conv);
});

// Rutas para la interfaz web
app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/public/admin.html');
});

// API para obtener conversaciones
app.get('/api/conversations', (req, res) => {
  try {
    const conversationsList = Array.from(conversations.values());
    res.json({
      success: true,
      data: conversationsList
    });
  } catch (error) {
    console.error('Error obteniendo conversaciones:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// API para obtener una conversación específica
app.get('/api/conversations/:platform/:userId', (req, res) => {
  try {
    const { platform, userId } = req.params;
    const conversationKey = `${platform}-${userId}`;
    const conversation = conversations.get(conversationKey);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversación no encontrada'
      });
    }

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Error obteniendo conversación:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// API para enviar mensaje (simulado)
app.post('/api/send-message', (req, res) => {
  try {
    const { platform, userId, message } = req.body;

    if (!platform || !userId || !message) {
      return res.status(400).json({
        success: false,
        error: 'Faltan parámetros requeridos'
      });
    }

    const conversationKey = `${platform}-${userId}`;
    const newMessage = {
      id: Date.now(),
      platform,
      userId,
      direction: 'outgoing',
      content: message,
      type: 'text',
      timestamp: new Date()
    };

    // Agregar mensaje a la conversación
    if (!conversations.has(conversationKey)) {
      conversations.set(conversationKey, {
        id: conversationKey,
        platform,
        userId,
        messages: [],
        lastMessage: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    const conversation = conversations.get(conversationKey);
    conversation.messages.push(newMessage);
    conversation.lastMessage = newMessage;
    conversation.updatedAt = new Date();

    // Simular respuesta automática después de 2 segundos
    setTimeout(() => {
      const autoResponse = {
        id: Date.now() + 1,
        platform,
        userId,
        direction: 'incoming',
        content: generateAutoResponse(message),
        type: 'text',
        timestamp: new Date()
      };

      conversation.messages.push(autoResponse);
      conversation.lastMessage = autoResponse;
      conversation.updatedAt = new Date();

      // Notificar en tiempo real
      io.to(`conversation-${platform}-${userId}`).emit('new-message', {
        platform,
        userId,
        message: autoResponse.content,
        type: 'incoming',
        timestamp: autoResponse.timestamp
      });
    }, 2000);

    // Notificar en tiempo real
    io.to(`conversation-${platform}-${userId}`).emit('new-message', {
      platform,
      userId,
      message,
      type: 'outgoing',
      timestamp: new Date()
    });

    res.json({
      success: true,
      data: { message: 'Mensaje enviado correctamente' }
    });
  } catch (error) {
    console.error('Error enviando mensaje:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Función para generar respuestas automáticas
function generateAutoResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  if (message.includes('hola') || message.includes('buenos días') || message.includes('buenas')) {
    return '¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?';
  }
  
  if (message.includes('precio') || message.includes('costo') || message.includes('cuánto')) {
    return 'Te ayudo con información sobre precios. ¿Qué producto o servicio te interesa?';
  }
  
  if (message.includes('horario') || message.includes('horarios') || message.includes('cuándo')) {
    return 'Nuestros horarios de atención son de lunes a viernes de 9:00 AM a 6:00 PM.';
  }
  
  if (message.includes('contacto') || message.includes('teléfono') || message.includes('email')) {
    return 'Puedes contactarnos al 📞 +1-234-567-8900 o 📧 info@tuempresa.com';
  }
  
  if (message.includes('producto') || message.includes('servicio')) {
    return '¡Perfecto! Tenemos una amplia variedad de productos. ¿Qué tipo de producto buscas?';
  }
  
  if (message.includes('envío') || message.includes('envio') || message.includes('entrega')) {
    return '🚚 Realizamos envíos a todo el país. Los tiempos de entrega varían entre 2-5 días hábiles.';
  }
  
  return 'Gracias por tu mensaje. Un agente humano te responderá pronto. 😊';
}

// Socket.IO para actualizaciones en tiempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  
  socket.on('join-conversation', (data) => {
    socket.join(`conversation-${data.platform}-${data.userId}`);
    console.log(`Cliente ${socket.id} se unió a la conversación ${data.platform}-${data.userId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log('🎉 ========================================');
  console.log('🤖 ChatBot Multiplataforma - MODO DEMO');
  console.log('🎉 ========================================');
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`🖥️  Panel de administración: http://localhost:${PORT}/admin`);
  console.log('');
  console.log('📱 Conversaciones de demo cargadas:');
  console.log('   - WhatsApp: 123456789');
  console.log('   - Instagram: 987654321');
  console.log('   - Facebook: 555666777');
  console.log('');
  console.log('💡 Puedes probar enviando mensajes desde el panel web');
  console.log('🎯 Las respuestas automáticas se generarán después de 2 segundos');
  console.log('🎉 ========================================');
});

module.exports = { app, io }; 