const axios = require('axios');

class SalesFunnelController {
  constructor() {
    this.stages = {
      COLD: 'cold',      // Primer contacto
      WARM: 'warm',      // Interés mostrado
      HOT: 'hot',        // Listo para compra
      PURCHASE: 'purchase', // Compra realizada
      DELIVERED: 'delivered' // Entregado
    };
    
    this.products = {
      'compostero-s': {
        id: 'compostero-s',
        name: 'Compostero S',
        description: 'Ideal para 1-2 personas',
        price: 899.00,
        household_size_min: 1,
        household_size_max: 2
      },
      'compostero-m': {
        id: 'compostero-m',
        name: 'Compostero M',
        description: 'Ideal para 3-4 personas',
        price: 1299.00,
        household_size_min: 3,
        household_size_max: 4
      },
      'compostero-l': {
        id: 'compostero-l',
        name: 'Compostero L',
        description: 'Ideal para 5+ personas',
        price: 1599.00,
        household_size_min: 5,
        household_size_max: 10
      }
    };
  }

  // Analizar mensaje y determinar intent
  async analyzeIntent(message) {
    const text = message.toLowerCase();
    
    // Intents básicos
    if (text.includes('precio') || text.includes('costo') || text.includes('cuánto') || text.includes('cuanto')) {
      return { intent: 'precio', confidence: 0.9, stage: this.stages.WARM };
    }
    
    if (text.includes('envío') || text.includes('envio') || text.includes('entrega') || text.includes('llegar')) {
      return { intent: 'envio', confidence: 0.8, stage: this.stages.WARM };
    }
    
    if (text.includes('funciona') || text.includes('cómo') || text.includes('como') || text.includes('proceso')) {
      return { intent: 'funcionamiento', confidence: 0.8, stage: this.stages.COLD };
    }
    
    if (text.includes('personas') || text.includes('gente') || text.includes('familia') || text.includes('hogar')) {
      return { intent: 'tamaño-hogar', confidence: 0.9, stage: this.stages.HOT };
    }
    
    if (text.includes('comprar') || text.includes('orden') || text.includes('pedido')) {
      return { intent: 'compra', confidence: 0.95, stage: this.stages.HOT };
    }
    
    if (text.includes('problema') || text.includes('ayuda') || text.includes('soporte') || text.includes('olor')) {
      return { intent: 'problemas-compostaje', confidence: 0.8, stage: this.stages.DELIVERED };
    }
    
    // Saludos
    if (text.includes('hola') || text.includes('buenos') || text.includes('buenas')) {
      return { intent: 'saludo', confidence: 0.7, stage: this.stages.COLD };
    }
    
    return { intent: 'general', confidence: 0.5, stage: this.stages.COLD };
  }

  // Generar respuesta basada en intent y etapa
  async generateResponse(intent, stage, customerData = {}) {
    switch (intent) {
      case 'saludo':
        return this.generateGreetingResponse(stage);
      
      case 'precio':
        return this.generatePriceResponse(customerData);
      
      case 'envio':
        return this.generateShippingResponse();
      
      case 'funcionamiento':
        return this.generateHowItWorksResponse();
      
      case 'tamaño-hogar':
        return this.generateHouseholdSizeResponse();
      
      case 'compra':
        return this.generatePurchaseResponse(customerData);
      
      case 'problemas-compostaje':
        return this.generateSupportResponse();
      
      default:
        return this.generateGeneralResponse();
    }
  }

  // Respuestas específicas para cada intent
  generateGreetingResponse(stage) {
    const responses = {
      [this.stages.COLD]: `¡Hola! 👋 Soy tu asistente virtual de MÜLLBLUE 🌱

¿Te interesa aprender sobre compostaje doméstico? 

Te ayudo a:
• Conocer nuestros composteros
• Calcular cuál te conviene
• Resolver dudas sobre el proceso

¿Por dónde te gustaría empezar? 😊`,
      
      [this.stages.WARM]: `¡Hola de nuevo! 👋 

Veo que ya tienes interés en nuestros composteros. 

¿Te gustaría que te ayude a:
• Ver precios y opciones
• Calcular cuál es ideal para tu hogar
• Hacer tu pedido

¿Qué te interesa más? 🛒`,
      
      [this.stages.HOT]: `¡Hola! 👋 

¡Perfecto! Estás listo para empezar tu viaje de compostaje. 

¿Quieres que te ayude a:
• Confirmar tu elección
• Procesar tu compra
• Resolver cualquier duda final

¡Estamos aquí para ayudarte! 🚀`
    };
    
    return responses[stage] || responses[this.stages.COLD];
  }

  generatePriceResponse(customerData) {
    if (customerData.household_size) {
      const recommendedProduct = this.recommendProduct(customerData.household_size);
      return `💰 **Precios de nuestros composteros:**

${Object.values(this.products).map(product => 
  `• **${product.name}**: $${product.price} MXN
   ${product.description}`
).join('\n\n')}

${recommendedProduct ? `\n🎯 **Para ${customerData.household_size} personas, te recomendamos el ${recommendedProduct.name}**` : ''}

¿Te gustaría que te ayude a elegir el ideal para tu hogar? 🤔`;
    }
    
    return `💰 **Precios de nuestros composteros:**

• **Compostero S**: $899 MXN
  Ideal para 1-2 personas

• **Compostero M**: $1,299 MXN
  Ideal para 3-4 personas

• **Compostero L**: $1,599 MXN
  Ideal para 5+ personas

¿Cuántas personas viven en tu hogar? Así puedo recomendarte el ideal para ti 👨‍👩‍👧‍👦`;
  }

  generateShippingResponse() {
    return `🚚 **Información de envío:**

• **Envío gratuito** a toda la República Mexicana
• **Tiempo de entrega**: 3-5 días hábiles
• **Empaque**: 100% reciclable y biodegradable
• **Seguimiento**: Te enviamos número de rastreo

¿Te gustaría proceder con tu compra? 🛒`;
  }

  generateHowItWorksResponse() {
    return `🌱 **¿Cómo funciona nuestro compostero?**

**1. Separación**: Separas tus residuos orgánicos
**2. Depositas**: Los colocas en el compostero
**3. Biocatalizador**: Agregas nuestro preparado especial
**4. Esperas**: En 4 semanas tienes compost listo
**5. Usas**: Fertilizas tus plantas naturalmente

**Ventajas:**
✅ Sin malos olores
✅ Sin moscas ni larvas
✅ Proceso acelerado
✅ Acompañamiento personalizado

¿Te gustaría ver un video explicativo? 📹`;
  }

  generateHouseholdSizeResponse() {
    return `👨‍👩‍👧‍👦 **Calculadora de compostero**

Para recomendarte el ideal, necesito saber:

¿Cuántas personas viven en tu hogar?

• 1-2 personas → Compostero S ($899)
• 3-4 personas → Compostero M ($1,299)
• 5+ personas → Compostero L ($1,599)

Responde con el número de personas y te recomiendo el perfecto para ti! 🎯`;
  }

  generatePurchaseResponse(customerData) {
    if (customerData.preferred_model) {
      const product = this.products[customerData.preferred_model];
      return `🛒 **¡Perfecto! Procedamos con tu compra**

**Producto seleccionado**: ${product.name}
**Precio**: $${product.price} MXN
**Envío**: GRATIS

Para completar tu pedido necesito:
1. Tu nombre completo
2. Tu número de teléfono
3. Tu dirección de envío

¿Estás listo para proceder? 💳`;
    }
    
    return `🛒 **¡Genial! Estás listo para comprar**

Para ayudarte mejor, ¿cuál compostero te interesa?

• **Compostero S** ($899) - 1-2 personas
• **Compostero M** ($1,299) - 3-4 personas  
• **Compostero L** ($1,599) - 5+ personas

Responde con la letra (S, M o L) y procedemos! 🚀`;
  }

  generateSupportResponse() {
    return `🆘 **Soporte postventa**

¡Estamos aquí para ayudarte! 

**Problemas comunes y soluciones:**

🐛 **Larvas o moscas**: Agrega más material seco
👃 **Mal olor**: Reduce humedad, agrega hojas secas
💧 **Exceso de humedad**: Agrega papel o cartón seco
❄️ **Proceso lento**: Verifica temperatura y humedad

¿Cuál es tu problema específico? Te ayudo a resolverlo paso a paso! 🔧`;
  }

  generateGeneralResponse() {
    return `🤔 **No estoy seguro de lo que necesitas**

¿Te puedo ayudar con:

• 💰 **Precios** de nuestros composteros
• 🚚 **Envíos** y entregas
• 🌱 **Cómo funciona** el compostaje
• 👨‍👩‍👧‍👦 **Recomendación** según tu hogar
• 🛒 **Proceso de compra**

Responde con lo que te interesa y te ayudo! 😊`;
  }

  // Recomendar producto basado en tamaño del hogar
  recommendProduct(householdSize) {
    if (householdSize <= 2) return this.products['compostero-s'];
    if (householdSize <= 4) return this.products['compostero-m'];
    return this.products['compostero-l'];
  }

  // Extraer información del cliente del mensaje
  extractCustomerInfo(message) {
    const info = {};
    
    // Extraer número de personas
    const householdMatch = message.match(/(\d+)\s*(personas?|gente|familia)/i);
    if (householdMatch) {
      info.household_size = parseInt(householdMatch[1]);
    }
    
    // Extraer nombre
    const nameMatch = message.match(/me llamo\s+(\w+)/i) || message.match(/soy\s+(\w+)/i);
    if (nameMatch) {
      info.name = nameMatch[1];
    }
    
    // Extraer email
    const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      info.email = emailMatch[0];
    }
    
    return info;
  }

  // Actualizar etapa del cliente
  updateCustomerStage(currentStage, intent) {
    const stageProgression = {
      [this.stages.COLD]: {
        'precio': this.stages.WARM,
        'funcionamiento': this.stages.WARM,
        'tamaño-hogar': this.stages.HOT
      },
      [this.stages.WARM]: {
        'precio': this.stages.HOT,
        'tamaño-hogar': this.stages.HOT,
        'compra': this.stages.HOT
      },
      [this.stages.HOT]: {
        'compra': this.stages.PURCHASE
      },
      [this.stages.PURCHASE]: {
        'problemas-compostaje': this.stages.DELIVERED
      }
    };
    
    return stageProgression[currentStage]?.[intent] || currentStage;
  }
}

module.exports = new SalesFunnelController(); 