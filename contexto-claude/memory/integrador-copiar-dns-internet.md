---
name: integrador-copiar-dns-internet
description: HECHO — el segmento Internet/DNS del integrador quedó como copia del TP inicial con IPs reales, funcionando desde las 3 sedes
metadata:
  type: project
---

**COMPLETADO (2026-08-19).** El segmento de Internet/DNS del TP integrador de HidroNova quedó como copia del TP inicial (lab "SISTEMA de DNS"), con las IPs reales del inicial. `www.google.com` resuelve a 64.223.190.94 y abre desde CABA, Jujuy y Catamarca.

**Qué se hizo:**
- Se copió (copy-paste en Packet Tracer) el sistema DNS del inicial al integrador: DNS ROOT (193.0.14.129/k.root-server.net), c.dns.ar .ar/.com.ar (200.108.148.50), edu.ar (170.210.5.56), bloque Google.
- Puente serial entre Router-ISP (2911, Serial0/0/1=10.200.0.1, DCE clock 64000) y Router Internet (2620XM, Serial0/1=10.200.0.2), red 10.200.0.0/30.
- Rutas: en Router-ISP `ip route` de 193.0.14.0/24, 200.108.148.0/24, 170.210.5.0/24, 8.8.8.0/24 via 10.200.0.2; en Router Internet `ip route 0.0.0.0 0.0.0.0 10.200.0.1` (y se borró la ruta vieja de Litum 172.29.0.0/24 via 10.100.0.2).
- Google en jerarquía: ROOT delega `com NS ns.com` + glue `ns.com A 8.8.8.8`; el server 8.8.8.8 (DNS Local Resolver Google) tiene `www.google.com`/`google.com` A 64.223.190.94. El web server (Server0) recreado en 64.223.190.94 colgado del Router-ISP Gi0/1 (64.223.190.93).
- DNS de HidroNova (primario 172.29.0.2 y secundario 172.29.0.3): se repuntaron `ns.com A -> 8.8.8.8` y `ns.ar A -> 200.108.148.50` (antes 200.100.100.3/.4).
- Limpieza: se borraron los DNS simplificados viejos (DNS-root/com/ar y Switch1, red 200.100.100.x) y todo lo de "Litum SA" (Router Borde 1941, Switch0(3), DNS Local Resolver).

**DOCS actualizados (esta sesión):**
- Informe GRUPAL (.docx): texto de la sección 5 (Internet/DNS), tablas 4.3 y 10, diagrama y epígrafes → actualizados a las IPs reales. 0 restos de 200.100.100.x. Backup en "...BACKUP-20260825.docx". Los demás docs no citaban las IPs viejas.
- Carpeta Capturas: 54 nuevas agrupadas en subcarpeta "DNS-integracion-2026-08/" (6 mejores renombradas FINAL-01..06); 12 viejas obsoletas movidas a "_reemplazadas-DNS-viejo/" (reversible).

**Figuras del informe GRUPAL:** reemplazadas por XML+.NET las Figuras 4 (topología), 5 (records raíz), 6 (records .ar), 7 (nslookup google) y 9 (google navegador) con capturas FINAL-01,07,02,05,06 y tamaños recalculados por proporción (cx=6.5M EMU). Backup previo: "Informe...BACKUP-textookfiguras.docx".

**PENDIENTE:** Figura 3 (NAT translations) sigue mostrando 200.100.100.3 — falta capturar de nuevo "show ip nat translations" (ahora daría 8.8.8.8). Figs 8 y 10 (opcionales) sin cambiar. Re-exportar PDF de "Para entregar" desde el .docx. Opcional: delegar hidronova.com.ar en c.dns.ar.