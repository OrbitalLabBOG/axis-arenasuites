# Arena Suites - Sitio Web

Sitio web oficial de **Arena Suites**, apartahotel premium en Teusaquillo, Bogotá.

## Stack

- **HTML5** semántico con Schema.org
- **CSS3** con variables personalizadas
- **JavaScript** vanilla (ES6+)
- **Vite** como bundler
- **Sharp** para optimización de imágenes

## Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

## Estructura

```
axis-arenasuites/
├── src/
│   ├── index.html          # Página principal
│   ├── css/styles.css      # Estilos
│   ├── js/main.js          # JavaScript
│   └── assets/images/      # Imágenes optimizadas
├── public/                 # Archivos estáticos
├── scripts/                # Scripts de build
├── dist/                   # Build output (gitignored)
└── package.json
```

## Deploy

El sitio está desplegado en **Cloudflare Pages** con deploy automático desde `main`.

**URL:** https://arenasuites.com.co

## Google Maps API Key

La API key de Google Maps necesita restricciones de dominio para seguridad:

1. Ir a [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Editar la API key: `AIzaSyCZhpUUHyU657cHWDGo5AKoXg0EmqOJPnE`
3. Application restrictions → HTTP referrers:
   - `https://arenasuites.com.co/*`
   - `https://www.arenasuites.com.co/*`
   - `http://localhost:*`
4. API restrictions → Solo estas APIs:
   - Maps JavaScript API
   - Places API

## Contacto

- **WhatsApp:** +57 312 479 2676
- **Email:** info@arenasuites.com.co
- **Dirección:** Carrera 30 No. 63-57, Bogotá

---

## WhatsApp Bot

Bot conversacional de atención automatizada con IA.

- **Stack:** WAHA + FastAPI + Gemini 2.0 Flash
- **Docs:** [docs/whatsapp-bot.md](docs/whatsapp-bot.md)
- **VPS:** 72.60.245.2
- **Puerto WAHA:** 3001
- **Puerto Bot:** 3002

```bash
# Ver logs de conversaciones
ssh root@72.60.245.2 "docker logs hotel-bot 2>&1 | grep -E '📥|📤'"
```

---

Desarrollado por [Orbital Lab](https://orbitallab.ai)
