# WhatsApp Bot - Arena Suites

Bot conversacional de WhatsApp para atención automatizada de huéspedes.

**Fecha de implementación:** 2026-01-08
**Estado:** ✅ Productivo
**VPS:** 72.60.245.2

---

## Arquitectura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   WhatsApp      │────▶│      WAHA       │────▶│    Hotel Bot    │
│   (Usuario)     │◀────│   (Bridge)      │◀────│   (FastAPI)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │                        │
                              │                        ▼
                              │                 ┌─────────────────┐
                              │                 │     Gemini      │
                              │                 │   (2.0 Flash)   │
                              └─────────────────┴─────────────────┘
```

### Componentes

| Componente | Tecnología | Puerto | Función |
|------------|------------|--------|---------|
| WAHA | Docker (devlikeapro/waha) | 3001 | Bridge WhatsApp Web → REST API |
| Hotel Bot | Python FastAPI | 3002 | Webhook + lógica conversacional |
| Gemini | Google AI | - | Generación de respuestas |

---

## Stack Técnico

- **WAHA (WhatsApp HTTP API):** v2024.x con engine NOWEB
- **Python:** 3.11-slim
- **FastAPI:** 0.109.0
- **Gemini:** gemini-2.0-flash-exp
- **Docker Compose:** v2

---

## Ubicación en VPS

```
/opt/orbital/demos/whatsapp-hotel/
├── docker-compose.yaml      # Orquestación de servicios
├── .env                     # Variables de entorno
├── bot/
│   ├── main.py              # Código del bot
│   ├── Dockerfile
│   └── requirements.txt
├── config/
│   └── hotels.yaml          # Configuración del hotel (prompt, info)
└── data/
    └── sessions/            # Sesiones de WhatsApp (persistente)
```

---

## Configuración

### Variables de Entorno (.env)

```bash
GEMINI_API_KEY=AIzaSy...       # API Key de Google AI Studio
WAHA_API_KEY=933d0e49...       # Generada automáticamente por WAHA
```

### hotels.yaml

```yaml
system_prompt: |
  Eres el asistente virtual de Arena Suites...
  [Reglas del bot]

hotel_info: |
  ARENA SUITES - Hotel 3 estrellas en Bogotá
  [Información del hotel: ubicación, precios, servicios, etc.]
```

---

## Features

### Implementadas ✅

| Feature | Descripción |
|---------|-------------|
| Conversacional | Respuestas naturales con Gemini |
| Memoria | Últimos 5 mensajes por usuario |
| Info del hotel | Ubicación, precios, servicios, políticas |
| Saludo automático | Bienvenida en primer contacto |
| Google Maps | Link automático al preguntar ubicación |
| Multi-usuario | Maneja conversaciones simultáneas |

### No implementadas (fuera de scope demo)

- Reservas automáticas
- Integración con PMS
- Captura de leads en BD
- Pagos

---

## Comandos de Operación

### Iniciar servicios

```bash
ssh root@72.60.245.2 "cd /opt/orbital/demos/whatsapp-hotel && docker compose up -d"
```

### Ver logs del bot

```bash
ssh root@72.60.245.2 "docker logs hotel-bot --tail 50"
```

### Ver conversaciones (formato legible)

```bash
ssh root@72.60.245.2 "docker logs hotel-bot 2>&1 | grep -E '📥|📤'"
```

### Reiniciar bot (después de cambiar config)

```bash
ssh root@72.60.245.2 "docker restart hotel-bot"
```

### Rebuild completo

```bash
ssh root@72.60.245.2 "cd /opt/orbital/demos/whatsapp-hotel && docker compose up -d --build hotel-bot"
```

### Ver estado de sesión WhatsApp

```bash
ssh root@72.60.245.2 "curl -s 'http://localhost:3001/api/sessions' -H 'X-Api-Key: 933d0e49359a4cccb0cb38a889e3cb3e'"
```

### Obtener nuevo QR (si se desconecta)

```bash
# 1. Reiniciar sesión
ssh root@72.60.245.2 "curl -s -X POST 'http://localhost:3001/api/sessions/default/restart' -H 'X-Api-Key: 933d0e49359a4cccb0cb38a889e3cb3e'"

# 2. Esperar y obtener QR
ssh root@72.60.245.2 "sleep 8 && curl -s 'http://localhost:3001/api/default/auth/qr' -H 'X-Api-Key: 933d0e49359a4cccb0cb38a889e3cb3e' -o /tmp/qr/qr.png"

# 3. Acceder al QR desde navegador
# http://72.60.245.2:8080/
```

---

## Credenciales WAHA

```
Dashboard: http://72.60.245.2:3001/
Usuario: admin
Password: 6da9df6c740b4f6eb92fd6419b30a0ff
API Key: 933d0e49359a4cccb0cb38a889e3cb3e
```

**Nota:** Las credenciales se regeneran en cada reinicio del container WAHA si no están fijadas en .env.

---

## Flujo de Mensajes

```
1. Usuario envía mensaje a WhatsApp Business
2. WAHA recibe via WhatsApp Web protocol (NOWEB)
3. WAHA envía webhook POST a hotel-bot:8000/webhook
4. Bot extrae chat_id y mensaje
5. Bot recupera historial (últimos 5 mensajes del usuario)
6. Bot construye prompt con: system_prompt + hotel_info + historial + mensaje
7. Gemini genera respuesta
8. Bot guarda mensaje y respuesta en memoria
9. Bot envía respuesta via WAHA API
10. Usuario recibe respuesta en WhatsApp
```

---

## Troubleshooting

### Bot no responde

1. Verificar que WAHA esté conectado:
   ```bash
   curl -s 'http://localhost:3001/api/sessions' -H 'X-Api-Key: ...'
   # Debe mostrar status: "WORKING"
   ```

2. Verificar logs del bot:
   ```bash
   docker logs hotel-bot --tail 20
   ```

3. Verificar que el webhook esté llegando:
   ```bash
   docker logs hotel-bot 2>&1 | grep "📥 RECIBIDO"
   ```

### WhatsApp desconectado

Si el status es `SCAN_QR_CODE` o `FAILED`, hay que re-escanear el QR:

1. Generar nuevo QR (ver comandos arriba)
2. Abrir http://72.60.245.2:8080/ en navegador
3. Escanear con WhatsApp del celular

### Error 401 en WAHA

La API key cambió. Obtener nueva de logs:

```bash
docker logs waha-hotel 2>&1 | grep "WAHA_API_KEY"
```

Actualizar en `.env` y en el código si es necesario.

---

## Replicación para Flat 119

Para replicar en otro hotel:

1. **Copiar estructura:**
   ```bash
   cp -r /opt/orbital/demos/whatsapp-hotel /opt/orbital/demos/whatsapp-flat119
   ```

2. **Modificar docker-compose.yaml:**
   - Cambiar puertos (ej: 3003, 3004)
   - Cambiar nombres de containers

3. **Modificar config/hotels.yaml:**
   - Actualizar system_prompt si es necesario
   - Actualizar hotel_info con datos de Flat 119

4. **Nuevo .env:**
   - Misma GEMINI_API_KEY (compartida)
   - Nueva WAHA_API_KEY (se genera al iniciar)

5. **Vincular nuevo WhatsApp:**
   - Iniciar servicios
   - Escanear QR con WhatsApp de Flat 119

---

## Costos

| Servicio | Costo |
|----------|-------|
| VPS | Ya incluido en infraestructura Orbital |
| WAHA | Gratis (versión community) |
| Gemini | ~$0.0001 por mensaje (negligible) |

---

## Contacto

**Desarrollo:** Orbital Lab
**Proyecto:** Arena Suites (Axis)
**Responsable técnico:** Julián Zuluaga
