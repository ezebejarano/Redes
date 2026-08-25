# Contexto y estado — Integración DNS/Internet en el TP Integrador (HidroNova S.A.)

> **Propósito:** handoff para continuar el trabajo en otra máquina sin perder contexto.
> **Última actualización:** 2026-08-25
> **Archivo del emulador:** `TP integrador/tp integrador.pkt` (Cisco Packet Tracer)

---

## 1. Objetivo del trabajo

El TP integrador de HidroNova se arrancó **desde cero** (no sobre el "proyecto inicial"). Faltaba integrar el **segmento de Internet / sistema DNS** que en el laboratorio de DNS ("tp inicial", empresa de ejemplo *Litum SA*) ya estaba resuelto.

**Decisión del usuario:** que el segmento Internet/DNS del integrador quede como **copia fiel del inicial**, con las **IPs y configuraciones reales** del inicial (no las simplificadas `200.100.100.x` que traía el integrador), respetando que la consigna exige `www.google.com = 64.223.190.94`.

---

## 2. Estado: ✅ COMPLETO Y FUNCIONANDO

`www.google.com` resuelve a `64.223.190.94` y **abre desde las 3 sedes** (CABA, Jujuy, Catamarca), usando la jerarquía DNS real copiada del inicial.

Fases (todas hechas):
1. ✅ Copiar el sistema DNS del inicial al integrador (copy-paste en Packet Tracer) y verificar que trajo la config.
2. ✅ Conectar la jerarquía a CABA (puente serial entre routers + rutas).
3. ✅ Google dentro de la jerarquía (`root → com → 64.223.190.94`).
4. ✅ Repuntar el DNS de HidroNova (primario y secundario) a los servidores reales.
5. ✅ Limpieza (borrar DNS simplificados viejos + todo lo de "Litum SA").
6. ✅ Verificación desde CABA, Jujuy y Catamarca.

---

## 3. Detalles técnicos (para reconstruir o defender)

### Topología del segmento Internet (estado final)
```
        Sede CABA ── serial 205.32.130.0/30 ── Router-ISP (2911)
                                                    │  Gi0/1: 64.223.190.93  → Server0 (Google web, 64.223.190.94)
                                                    │  Serial0/0/1: 10.200.0.1  (DCE, clock 64000)
                                                    │
                                          serial 10.200.0.0/30
                                                    │
                                       Router Internet (2620XM)
        ┌──────────────┬──────────────┬────────────┴────────┐
   DNS ROOT        c.dns.ar        edu.ar            ns.com / Google DNS
  193.0.14.129   200.108.148.50  170.210.5.56           8.8.8.8
  (Eth1/0 .1)    (Eth1/3 .1)     (Eth1/2 .1)          (Fa0/0 8.8.8.1)
```
Todas las redes de los DNS son **/24**.

### Puente entre routers (lo nuevo)
- **Router-ISP (2911)** `Serial0/0/1` = `10.200.0.1/30` con `clock rate 64000` (lado DCE).
- **Router Internet (2620XM)** `Serial0/1` = `10.200.0.2/30`.
- Rutas en **Router-ISP**: `ip route 193.0.14.0/24`, `200.108.148.0/24`, `170.210.5.0/24`, `8.8.8.0/24` → `10.200.0.2`.
- Ruta en **Router Internet**: `ip route 0.0.0.0 0.0.0.0 10.200.0.1` (se borró la vieja de Litum `172.29.0.0/24 → 10.100.0.2`).

### Registros DNS clave (jerarquía)
- **DNS ROOT (193.0.14.129):** `. NS k.root-server.net`, `ar NS c.dns.ar`, `c.dns.ar A 200.108.148.50`, `com NS ns.com`, `ns.com A 8.8.8.8` (glue), `k.root-server.net A 193.0.14.129`.
- **c.dns.ar (200.108.148.50):** maneja `.ar` y `com.ar`; delega `edu.ar → a.riu.edu.ar (170.210.5.56)`.
- **ns.com / Google DNS (8.8.8.8):** `www.google.com A 64.223.190.94`, `google.com A 64.223.190.94`.
- **DNS de HidroNova (primario 172.29.0.2 y secundario 172.29.0.3):** autoritativos de `hidronova.com.ar`; para resolución externa usan `com NS ns.com` + `ns.com A 8.8.8.8` y `ar NS ns.ar` + `ns.ar A 200.108.148.50` (antes apuntaban a `200.100.100.3/.4`).

### Google web
- **Server0** = web server en `64.223.190.94` (HTTP On), colgado del **Router-ISP Gi0/1** (gateway `64.223.190.93`). Se recreó porque se había borrado; trae la página por defecto de Packet Tracer (suficiente para "simular Internet").

---

## 4. Documentos actualizados en esta ronda

- **`TP integrador/Informe...GRUPAL.docx`**:
  - Texto: sección 5 (Internet/DNS), tablas 4.3 (interfaces) y 10 (IPs estáticas), diagrama y epígrafes → IPs reales. **0 restos de `200.100.100.x`.**
  - Figuras reemplazadas: **Fig 4** (topología), **Fig 5** (records raíz), **Fig 6** (records .ar), **Fig 7** (nslookup google), **Fig 9** (google navegador).
  - Backups: `Informe...BACKUP-20260825.docx` (antes del texto) y `Informe...BACKUP-textookfiguras.docx` (antes de figuras).
- Otros docs (INDIVIDUAL, Resumen, etc.): **no** citaban las IPs viejas, no requirieron cambios.
- **`TP integrador/Capturas/`** reorganizada:
  - `DNS-integracion-2026-08/` → las 54 capturas nuevas de esta ronda; las 7 mejores renombradas `FINAL-01..07`.
  - `_reemplazadas-DNS-viejo/` → 12 capturas obsoletas del DNS viejo (movidas, no borradas).

---

## 5. PENDIENTE (para terminar)

1. **Figura 3 del informe (NAT translations)** todavía muestra `200.100.100.3`. Sacar de nuevo `show ip nat translations` en el **Router0 de CABA** (ahora dará `8.8.8.8:53`) y reemplazar la imagen.
2. **Re-exportar el PDF** de `TP integrador/Para entregar/` desde el `.docx` actualizado (Archivo → Guardar como PDF). *(No se pudo hacer automáticamente: no hay Word/conversor en la máquina.)*
3. Figuras 8 y 10 del informe (opcionales) — muestran resultados que siguen siendo correctos.
4. **Opcional:** delegar `hidronova.com.ar` en `c.dns.ar` para que la jerarquía sea 100% fiel (para clientes externos).

---

## 6. Cómo continuar en la otra máquina

1. Abrir `TP integrador/tp integrador.pkt` en Cisco Packet Tracer.
2. Leer este archivo y `contexto-claude/memory/` (memoria de Claude Code con el detalle).
3. Verificar que todo sigue andando: desde una PC de CABA → `nslookup www.google.com` (debe dar `64.223.190.94`) y abrir la web.
4. Atacar los pendientes de la sección 5.

**Capturas de referencia rápida:** `TP integrador/Capturas/DNS-integracion-2026-08/FINAL-01..07-*.png`.
