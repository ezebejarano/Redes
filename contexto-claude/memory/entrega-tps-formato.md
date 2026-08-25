---
name: entrega-tps-formato
description: Cómo se entregan los TPs y cómo generar los Word de los teóricos
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 58ea8738-ad21-4e8e-bdf5-c2e702ee86ac
---

Los TP de **laboratorio** se entregan como el archivo **.pkt** de Packet Tracer; los TP **teóricos** se arman en **Word (.docx)** y se entregan.

**Why:** así lo pide la cátedra; el usuario quiere los teóricos listos para entregar, no solo el texto en el chat.

**How to apply:** dar el contenido teórico listo para Word. Para generar el .docx en su PC: no hay python ni pandoc, pero **Word COM sí funciona** (`New-Object -ComObject Word.Application`). Método: escribir un HTML con estilos y `Documents.Open(html)` → `SaveAs(ruta, 16)` (16 = wdFormatDocumentDefault). Para incrustar imágenes usar `<img src="file:///...">` y luego `InlineShapes[].LinkFormat.BreakLink()` con `SavePictureWithDocument=true`. Guardar el .docx en la carpeta del TP correspondiente. Mañana se revisan/corrigen juntos. Ver [[proyecto-redes-tps]].

**CUIDADO (error cometido el 2026-06-29):** regenerar un .docx desde HTML SOBRESCRIBE el archivo y borra las capturas que el usuario haya pegado a mano. Antes de regenerar un .docx donde el usuario agregó imágenes, PRIMERO extraer sus imágenes (leer el .docx como zip, copiar word/media/*) y reincorporarlas al regenerar.
