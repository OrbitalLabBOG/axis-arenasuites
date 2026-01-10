# Backup Sitio Wix - Arena Suites

Fecha: 2026-01-10

## Contenido del Backup

- `index-wix-20260110.html` - HTML completo de la página principal (496KB)
- `wix-backup-home.png` - Screenshot de Wayback Machine

## Wayback Machine

El sitio está archivado en Internet Archive:
- **URL:** http://web.archive.org/web/20240430103626/https://www.arenasuites.com.co/
- **Páginas archivadas:** 15 capturas entre 2019-2025

### Páginas disponibles en Wayback:
- Home: https://web.archive.org/web/20240430103626/https://www.arenasuites.com.co/
- Apartaestudios: https://web.archive.org/web/20230323005138/https://www.arenasuites.com.co/habitaciones
- Servicios: https://web.archive.org/web/*/https://www.arenasuites.com.co/servicios
- Rooftop: https://web.archive.org/web/*/https://www.arenasuites.com.co/roof-top
- Quiénes Somos: https://web.archive.org/web/*/https://www.arenasuites.com.co/quienes-somos
- Ubicación: https://web.archive.org/web/*/https://www.arenasuites.com.co/ubicacion

## DNS Original (para revertir a Wix)

Si necesitan volver a Wix:

| Registro | Tipo | Valor Original |
|----------|------|----------------|
| arenasuites.com.co | A | 23.236.62.147 |
| www.arenasuites.com.co | CNAME | www153.wixdns.net |

### Pasos para revertir:
1. Entrar a Colombia Hosting (ventas@interpanelsa.com)
2. cPanel > Zone Editor > arenasuites.com.co
3. Eliminar los 4 registros A con IPs 185.199.x.x
4. Editar el A principal: cambiar a 23.236.62.147
5. Editar CNAME www: cambiar a www153.wixdns.net
6. Esperar propagación DNS (15min - 48h)

## Nota

El contenido real del sitio Wix (textos, imágenes, estructura) ya fue migrado al nuevo sitio en este repositorio. Este backup es solo por precaución.
