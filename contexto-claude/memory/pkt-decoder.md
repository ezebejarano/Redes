---
name: pkt-decoder
description: Cómo leer archivos .pkt de Packet Tracer 8.x desde la PC del usuario (decodificador en node)
metadata:
  type: reference
---

Los .pkt de PT 7.2+ se pueden decodificar a XML con `node contexto-claude/herramientas/pkt2xml.js in.pkt out.xml` (Twofish-EAX implementado a mano, clave 16×0x89, nonce 16×0x10, + XOR + zlib). `dump.js out.xml devices.txt` saca running-config de routers/switches e IPs de hosts; `links.js` (lee integrador.xml del cwd) lista los cables. En la PC hay node y java, NO python. Sirve para diagnosticar sin pedirle capturas al usuario. Re-cifrar (escribir un .pkt) no está implementado.
