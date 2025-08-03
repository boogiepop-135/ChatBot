#!/bin/bash

# Script para construir y ejecutar el chatbot en Docker
# Uso: ./scripts/docker-build.sh [demo|prod|dev]

set -e

echo "🐳 ChatBot Multiplataforma - Docker Build Script"
echo "================================================"

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 [demo|prod|dev]"
    echo ""
    echo "Opciones:"
    echo "  demo  - Ejecutar en modo demo (recomendado para pruebas)"
    echo "  prod  - Ejecutar en modo producción"
    echo "  dev   - Ejecutar en modo desarrollo"
    echo ""
    echo "Ejemplos:"
    echo "  $0 demo    # Ejecutar modo demo"
    echo "  $0 prod    # Ejecutar modo producción"
    echo "  $0 dev     # Ejecutar modo desarrollo"
}

# Verificar si Docker está ejecutándose
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está ejecutándose"
    echo "Por favor, inicia Docker Desktop y vuelve a intentar"
    exit 1
fi

# Obtener modo de ejecución
MODE=${1:-demo}

case $MODE in
    "demo")
        echo "🎯 Ejecutando en MODO DEMO..."
        echo ""
        echo "📋 Pasos:"
        echo "1. Construyendo imagen Docker..."
        docker-compose -f docker-compose.demo.yml build
        
        echo "2. Iniciando contenedor en modo demo..."
        docker-compose -f docker-compose.demo.yml up -d
        
        echo ""
        echo "✅ ¡ChatBot iniciado exitosamente!"
        echo "🌐 Panel de administración: http://localhost:3000/admin"
        echo "📱 Conversaciones de demo disponibles"
        echo ""
        echo "📊 Para ver logs: docker-compose -f docker-compose.demo.yml logs -f"
        echo "🛑 Para detener: docker-compose -f docker-compose.demo.yml down"
        ;;
        
    "prod")
        echo "🚀 Ejecutando en MODO PRODUCCIÓN..."
        echo ""
        echo "⚠️  Asegúrate de tener configurado el archivo .env con tus APIs reales"
        echo ""
        
        if [ ! -f .env ]; then
            echo "❌ No se encontró archivo .env"
            echo "📝 Crea el archivo .env basado en env.example"
            echo "cp env.example .env"
            exit 1
        fi
        
        echo "📋 Pasos:"
        echo "1. Construyendo imagen Docker..."
        docker-compose build
        
        echo "2. Iniciando contenedor en modo producción..."
        docker-compose up -d
        
        echo ""
        echo "✅ ¡ChatBot iniciado exitosamente!"
        echo "🌐 Panel de administración: http://localhost:3000/admin"
        echo ""
        echo "📊 Para ver logs: docker-compose logs -f"
        echo "🛑 Para detener: docker-compose down"
        ;;
        
    "dev")
        echo "🔧 Ejecutando en MODO DESARROLLO..."
        echo ""
        echo "📋 Pasos:"
        echo "1. Construyendo imagen Docker..."
        docker-compose build
        
        echo "2. Iniciando contenedor en modo desarrollo..."
        docker-compose --profile dev up -d
        
        echo ""
        echo "✅ ¡ChatBot iniciado exitosamente!"
        echo "🌐 Panel de administración: http://localhost:3001/admin"
        echo "🔄 Modo desarrollo con hot-reload activado"
        echo ""
        echo "📊 Para ver logs: docker-compose logs -f chatbot-dev"
        echo "🛑 Para detener: docker-compose down"
        ;;
        
    *)
        echo "❌ Modo no válido: $MODE"
        show_help
        exit 1
        ;;
esac

echo ""
echo "🎉 ¡Listo! Tu ChatBot está ejecutándose en Docker" 