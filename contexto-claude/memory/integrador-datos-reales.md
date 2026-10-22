---
name: integrador-datos-reales
description: Datos REALES del .pkt del integrador (verificados 2026-10-20) y errores de la "Resumen y guia de defensa" docx que los contradice
metadata:
  type: project
---

Datos reales (leídos del .pkt): Router0 CABA ISR4331, subinterfaces en **Gi0/0/1** (.10=172.29.0.1/24, .20=172.29.1.129/26 Admin, .30=172.29.1.1/25 Gerencia, .40=172.29.1.193/26 Logística). Serial0/2/0 CABA=205.32.130.**2**, ISP=.1. Jujuy LAN 192.168.145.**0/25** gw .1 (DNS-log1 .2, DNS-log2 .3, www.logistica .4, secure .5); Catamarca 192.168.145.**128/26** gw .129 (Server6-9 .130-.133). Enlaces: CABA–Jujuy 192.168.145.192/30 (CABA .193, Jujuy .194); CABA–Catamarca .196/30 (CABA .197, Cat .198). PAT: pool PAT_HIDRONOVA 200.45.110.129 overload (no "interface"); estáticos .130 www(172.29.0.5) .131 mail(.4) .132 dns(.2) .133 gestion(.6) .134 www.logistica(192.168.145.4) .135 dns-log1(192.168.145.2). Correo 172.29.0.4 usuarios: catamarca, logistica, admin, contabilidad, sistemas (pass 123). Clientes OK: PC0 contabilidad, PC3 sistemas, PC19 logistica (Jujuy), PC19(1) catamarca. Internet: ROOT 193.0.14.129 → ns.com 8.8.8.8 (NO hay TLD .com separado) → Google web 64.223.190.94 en Router-ISP Gi0/1.

La guía docx tiene MAL: subinterfaces (Gi0/0/0, .20=172.29.1.1, .30=.65, .40=.129), redes de Jujuy (.128/25) y Catamarca (.64/26), enlaces (.0/30, .4/30), glue 192.168.145.130, web logística .140, usuarios de mail (ana/luis/jose), NAT "interface Serial0/1/0 overload", ISP .1=CABA, jerarquía con TLD .com aparte.

**How to apply:** para la defensa usar SOLO estos datos; no confiar en la guía docx sin cotejar. Ver [[integrador-falla-exposicion]].

Decisión 2026-10-21: NO se arreglan los clientes de mail de PC1,4,5,7,8,10,11,14 (apuntan a 172.29.40.30 inexistente); en la demo usar solo PC0, PC3, PC19, PC19(1). Firewall intranet verificado en vivo: PC0 entra, PC3 timeout (OK).
