const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Importar controladores
const whatsappController = require('./controllers/whatsappController');
const instagramController = require('./controllers/instagramController');
const facebookController = require('./controllers/facebookController');
const chatbotController = require('./controllers/chatbotController');

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

// Rutas para webhooks de WhatsApp
app.get('/webhook/whatsapp', whatsappController.verifyWebhook);
app.post('/webhook/whatsapp', whatsappController.handleWebhook);

// Rutas para webhooks de Instagram
app.get('/webhook/instagram', instagramController.verifyWebhook);
app.post('/webhook/instagram', instagramController.handleWebhook);

// Rutas para webhooks de Facebook
app.get('/webhook/facebook', facebookController.verifyWebhook);
app.post('/webhook/facebook', facebookController.handleWebhook);

// Rutas para la interfaz web
app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/public/admin.html');
});

app.get('/api/conversations', chatbotController.getConversations);
app.get('/api/conversations/:platform/:userId', chatbotController.getConversation);
app.post('/api/send-message', chatbotController.sendMessage);

// Socket.IO para actualizaciones en tiempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  
  socket.on('join-conversation', (data) => {
    socket.join(`conversation-${data.platform}-${data.userId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Hacer io disponible globalmente
global.io = io;

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📱 WhatsApp webhook: http://localhost:${PORT}/webhook/whatsapp`);
  console.log(`📸 Instagram webhook: http://localhost:${PORT}/webhook/instagram`);
  console.log(`📘 Facebook webhook: http://localhost:${PORT}/webhook/facebook`);
  console.log(`🖥️  Panel de administración: http://localhost:${PORT}/admin`);
});

module.exports = { app, io }; 