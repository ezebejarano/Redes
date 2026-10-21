---
name: integrador-falla-exposicion
description: La defensa del TP integrador falló (sin Internet); ARREGLADO el 2026-10-20 (routers guardados + PC6-14 en DHCP), verificado en el .pkt
metadata:
  type: project
---

En la exposición del TP integrador (HidroNova) "no funcionó Internet" y el usuario desaprobó (antes del 2026-10-20). Hay que dejarlo andando para la próxima instancia.

En la defensa probaron desde PC3 (VLAN 10, DHCP, Switch-Piso10 Fa0/2 — su config está bien).

**CAUSA MÁS PROBABLE (afecta a TODAS las PCs):** Router-ISP y Router Internet NUNCA se guardaron con write memory: el puente serial 10.200.0.0/30 y las rutas a 193.0.14/200.108.148/170.210.5/8.8.8 están solo en running-config; la startup de Router Internet tiene aún la ruta vieja de Litum. Un reload/power cycle (o "Power Cycle Devices") borra todo el acceso a Internet. Arreglo: copy running-config startup-config en ambos.

Diagnóstico leyendo el .pkt decodificado (routers, NAT, rutas, jerarquía DNS y Server0 estaban BIEN):
- PC6..PC14 (CABA, colgadas de Switch4/5/6) tenían DHCP APAGADO (Static) con IP 169.254.x.x, sin gateway ni DNS → sin Internet. Arreglo: ponerlas en DHCP.
- Printer1 tenía IP 172.29.1.1 (= gateway VLAN30) en un puerto VLAN 1; Printer3 con máscara /27 y gateway 172.29.1.130 (mal).
- DNS primario/secundario logística (Jujuy, 192.168.145.2/.3) seguían con ns.com→200.100.100.3 y ns.ar→200.100.100.4 (viejo).
- DNS primario/secundario CABA tienen como DNS cliente propio 200.100.100.2 (viejo).

**Why:** el usuario perdió la defensa por esto; la prioridad es que la demo funcione desde CUALQUIER PC.
**How to apply:** antes de la próxima defensa, verificar desde varias PCs de cada sede (ipconfig, nslookup, navegador). El .pkt se puede leer con contexto-claude/herramientas/pkt2xml.js (node), ver [[pkt-decoder]]. Relacionado: [[integrador-copiar-dns-internet]].

**ARREGLADO 2026-10-20 (verificado releyendo el .pkt):** write memory en Router-ISP y Router Internet (startup = running), PC6–PC14 en DHCP con gateway/DNS correctos. Probado desde PC3 y PC6: nslookup + ping + navegador OK. Ojo PT: en Config→Global Settings, si queda "Static" vacío pisa gateway/DNS del DHCP (DNS 255.255.255.255) — poner DHCP ahí también. 
Pendientes menores TAMBIÉN ARREGLADOS 2026-10-20 (verificado en el .pkt guardado 23:52): Printer1 172.29.1.2/25 (Switch4 Fa0/9 VLAN30), Printer2 (Switch5 Fa0/5 VLAN20), Printer3 /26 gw .193 (Switch6 Fa0/7 VLAN40); DNS logística ns.com→8.8.8.8, ns.ar→200.108.148.50; DNS CABA con DNS-cliente 172.29.0.2. Queda opcional: impresoras/APs sueltos en Jujuy/Catamarca. El usuario suele tipear 179 en vez de 172 — revisar capturas.
