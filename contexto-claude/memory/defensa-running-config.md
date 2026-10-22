---
name: defensa-running-config
description: Preparación de la defensa oral: análisis bloque por bloque del show running-config del Router CABA; vistos 1-7, faltan 8-9 y Switch2
metadata:
  type: project
---

En la defensa del integrador el profe pidió ver la config del router CABA y preguntó sobre una salida del CLI con valores "DHCP, estático, trunk". El usuario confirmó (2026-10-22) que era **show running-config** (probablemente las 6 líneas de NAT estático y los pools DHCP).

Se está analizando el running-config REAL de Router0 (extraído del .pkt con pkt2xml.js, ver [[pkt-decoder]]) en 9 bloques: 1 encabezado, 2 DHCP, 3 cef/spanning-tree, 4 enlaces Jujuy/Catamarca, 5 router-on-a-stick, 6 Gi0/1/x + seriales + Vlan1, 7 NAT/PAT, 8 rutas, 9 ACL + line con/aux/vty.

**Estado 2026-10-22:** explicados 1 a 7. FALTAN: 8 (rutas), 9 (ACL/lines), después running-config de Switch2 (trunk/access) y simulacro de preguntas tipo profe.

Archivos generados en "TP integrador/": "Machete show running-config - Router CABA.docx" (2 hojas: CLI | significado) y "Resumen bloques running-config - Router CABA.docx" (resumen de lo explicado).

Dudas que tuvo el usuario (explicar con este enfoque): qué es un pool (talonario); por qué no se excluye el broadcast (no es asignable, el router lo descarta por la máscara); hasta qué IP reparte (salto = 256 − último octeto de la máscara, broadcast = red + salto − 1, máx = bc − 1); numeración Gi0/1/0 = slot/subslot/puerto y por qué falló (cable en módulo de switch Gi0/1/0, subinterfaces en Gi0/0/1); NAT vs PAT y privado/público (le costó, lo entendió con el "palabra por palabra" y las 3 piezas del PAT). Router-ISP es DCE (clock rate 64000), CABA DTE.

**Why:** desaprobó la primera defensa ([[integrador-falla-exposicion]]); el profe evalúa interpretar la config por CLI.
**How to apply:** seguir desde el bloque 8 con el mismo estilo (bloque citado, línea por línea, tabla de preguntas probables, frase para el oral). Usar solo datos de [[integrador-datos-reales]].
