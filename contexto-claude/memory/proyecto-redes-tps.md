---
name: proyecto-redes-tps
description: Objetivo y organización del trabajo en la materia Redes de Computadoras
metadata: 
  node_type: memory
  type: project
  originSessionId: 58ea8738-ad21-4e8e-bdf5-c2e702ee86ac
---

Objetivo: completar todos los TPs pendientes de Redes de Computadoras (UNQ) en menos de una semana (arrancado el 2026-06-28). La carpeta tiene una subcarpeta por unidad; cada unidad tiene teoría + "TP teorico" + "TP laboratorio" (Cisco Packet Tracer 8.x).

Orden acordado: **por unidad, en orden** (1→5).

Estado al 2026-06-29: TP1 (Intro), TP2-DNS teórico y Proyecto inicial ya estaban HECHOS (archivos "Bejarano") — saltearlos. HECHOS con ayuda: Unidad 2 COMPLETA — teóricos WWW y Correo (.docx), Lab DNS inicial, Lab DNS delegación, Lab WWW, Lab Correo (todos terminados y verificados; el mail SMTP/POP3 funcionó). Unidad 3: Lab Transporte HECHO (análisis UDP/DNS y TCP/HTTP en Simulation; Word con 13 respuestas + capturas). Pendiente Unidad 3: TP teórico Transporte.
Unidad 4: Lab DHCP HECHO (entregado en PDF/Word). Lab Red HECHO (subneteo VLSM de 208.101.21.0/24: CABA /25, La Plata /26, Intranet /27; enlaces /30 privados 10.0.0.0/24; ISP 190.100.100.0/30; 6 routers 1841 con seriales WIC-2T, ruteo estático con default routes + ruta resumen 10.0.0.0/24 en R-CABA; armado y verificado en PT). Pendiente Unidad 4: TP teórico Red.
Unidad 5 (Enlace): Lab VLAN HECHO y verificado en PT (2 switches 2960, 6 PCs, 3 VLANs: 2 Administracion/3 Gestion/4 Ventas; red plana /8 → VLANs → trunk 802.1Q en Fa0/24 → ruteo /16 con Router-PT: primero 1 interfaz física por VLAN, después router-on-a-stick con subinterfaces Fa0/0.2/.3/.4 encapsulation dot1Q). Los 8 puntos resueltos. Doc de entrega "Laboratorio VLAN Bejarano.docx" con recuadros para pegar capturas + "Laboratorio VLAN - Paso a paso.docx". Pendiente: que el usuario pegue las capturas y guarde el .pkt.
Unidad 6 (NAT): Lab NAT HECHO y verificado en PT. Base .pkt: LAN 192.168.0.0/24 (PC0 .10, PC1 .12, MiWeb .15, GW Router0 Gi0/0=192.168.0.1); enlace Router0↔Router1 = 10.0.0.0/30 (R0 Gi0/1=10.0.0.2, R1 Gi0/1=10.0.0.1); Google server 64.223.190.94/24 detrás de Router1 (Gi0/0=64.223.190.1). Config en Router0: ip route 0.0.0.0/0 → 10.0.0.1; Gi0/0 ip nat inside, Gi0/1 ip nat outside; estático "ip nat inside source static 192.168.0.15 200.5.224.50"; overload "ip nat pool PUBLICO 200.5.224.100 200.5.224.101 netmask 255.255.255.0" + "access-list 1 permit 192.168.0.0 0.0.0.255" + "ip nat inside source list 1 pool PUBLICO overload". CLAVE: Router1 (ISP) necesitó ruta de retorno "ip route 200.5.224.0 255.255.255.0 10.0.0.2" (no venía en el base). Verificado: MiWeb accesible desde Google por http://200.5.224.50; PCs navegan por 200.5.224.100 (PAT); PDU en Router1 muestra SRC IP ya traducida a 200.5.224.100. TODOS LOS LABS COMPLETOS.
TP teórico Enlace/MAC (U5) HECHO: "TP Enlace de datos - MAC Bejarano.docx" (13 problemas resueltos). P1 con dato real de la máquina del usuario: Wi-Fi Realtek RTL8852BE, MAC 14-B5-CD-38-8B-19, OUI 14:B5:CD = Liteon Technology (no tiene placa Ethernet cableada, es notebook). Estilo de entrega teórico: conciso y humano, "Problema N — título" + respuesta directa con negritas (igual que los buenos TP WWW.docx y TP Correo electronico.docx de U2, que están CORRECTOS y sirven de plantilla). Método docx: Word COM desde HTML (ver [[entrega-tps-formato]]).
TP teórico Transporte (U3) HECHO: "TP Transporte Bejarano.docx" (20 problemas). Incluye análisis de capturas TCP (P13: 2 conexiones, retransmisión paq12→paq15; P14: paq20 tiene :80 en vez de :801 = typo consigna; P12: netstat con conexión duplicada 200.5.114.77.3888 + IP privada 172.18.x).
TP teórico Red (U4) HECHO: "TP Red Bejarano.docx" (18 problemas: binario/clase, subneteo, VLSM viñedo/universidad, tablas de ruteo por prefijo más largo, ICMP TTL-excedido, routing loop en traceroute). Decisiones TOMADAS EN FIRME (no se preguntó al profe, no había tiempo): P8 = /23 (7 bits subred + 9 host, único que cumple 70 subredes y 256 hosts en un /16); P14 = público 157.92.26.0/24 para 5 labs+admin con Internet y privado RFC1918+NAT para los otros 5 labs (10 labs /27 + admin /26 = 384 no entran en /24). Ambas cerradas dentro del docx, sin hedging.

PROYECTO COMPLETO al 2026-07-05: TODOS los labs (DNS, WWW, Correo, Transporte, DHCP, Red, VLAN, NAT) y TODOS los teóricos (U2 WWW/Correo, U3 Transporte, U4 Red, U5 Enlace/MAC) entregados. Formato teórico definitivo: plano, sin negritas ni resaltados, encabezados "Problema N" en estilo Título 2 (los TP WWW/Correo modificados por el usuario son la plantilla).

Aprendizajes Lab Red: (1) comandos ip route/interface van en config mode (enable→configure terminal), no en Router>/Router#; (2) router↔PC/server directo necesita cable CRUZADO (cross-over), no directo; (3) para agregar módulo serial hay que apagar el router (write memory antes para no perder config); (4) R-CABA necesita ruta resumen 10.0.0.0/24→La Plata para el retorno a las oficinas; (5) las oficinas (IP privada) no salen a Internet sin NAT (esperado).

Aprendizajes DHCP (errores que costaron): (1) el server DHCP no oferta si su interfaz tiene mal la máscara; (2) el pedido DHCP falla si estás en modo Simulation sin avanzar los paquetes (usar Realtime); (3) máscara del pool debe coincidir con la red (Verdepool = /16 = 255.255.0.0).

Nota Lab Correo: el enlace Hub–Switch necesitó cable cruzado (cross-over); con directo el link queda caído y la laptop no tenía conectividad.

Cadena de labs Unidad 2: REDCONDNS.pkt (DNS) → REDCONWEB.pkt (WWW) → REDCONEMAIL.pkt (Correo). El orden correcto es DNS → WWW → Correo (cada uno parte del anterior).

Cada lab se documenta en un .docx "<nombre> - Paso a paso" generado por mí en la carpeta del lab.

Limitación: los .pkt son binarios y no se pueden leer; se guía el paso a paso desde la consigna PDF. Ver [[entrega-tps-formato]].
