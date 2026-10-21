// Decodifica un .pkt de Packet Tracer 7.2+ (Twofish-EAX) a XML. Uso: node pkt2xml.js in.pkt out.xml
const fs = require('fs');
const zlib = require('zlib');

// ---------- Twofish (solo cifrado, clave 128 bits) ----------
const Q0T = [[8,1,7,13,6,15,3,2,0,11,5,9,14,12,10,4],[14,12,11,8,1,2,3,5,15,4,10,6,7,0,9,13],
             [11,10,5,14,6,13,9,0,12,8,15,3,2,4,7,1],[13,7,15,4,1,2,6,14,9,11,3,0,8,5,12,10]];
const Q1T = [[2,8,11,13,15,7,6,14,3,1,9,4,0,10,12,5],[1,14,2,11,4,12,3,7,6,13,10,5,15,9,0,8],
             [4,12,7,5,1,6,9,10,0,14,13,8,2,11,3,15],[11,9,5,1,12,3,13,14,6,4,7,15,2,0,8,10]];
const ror4 = (x, n) => ((x >>> n) | (x << (4 - n))) & 15;
function mkq(t) {
  const q = new Uint8Array(256);
  for (let x = 0; x < 256; x++) {
    let a = x >> 4, b = x & 15;
    let a1 = a ^ b, b1 = (a ^ ror4(b, 1) ^ (8 * a)) & 15;
    let a2 = t[0][a1], b2 = t[1][b1];
    let a3 = a2 ^ b2, b3 = (a2 ^ ror4(b2, 1) ^ (8 * a2)) & 15;
    q[x] = (t[3][b3] << 4) | t[2][a3];
  }
  return q;
}
const q0 = mkq(Q0T), q1 = mkq(Q1T);
function gfmul(a, b, poly) {
  let r = 0;
  while (b) { if (b & 1) r ^= a; a <<= 1; if (a & 0x100) a ^= poly; b >>= 1; }
  return r;
}
const MDS = [[0x01,0xEF,0x5B,0x5B],[0x5B,0xEF,0xEF,0x01],[0xEF,0x5B,0x01,0xEF],[0xEF,0x01,0xEF,0x5B]];
const RS = [[0x01,0xA4,0x55,0x87,0x5A,0x58,0xDB,0x9E],[0xA4,0x56,0x82,0xF3,0x1E,0xC6,0x68,0xE5],
            [0x02,0xA1,0xFC,0xC1,0x47,0xAE,0x3D,0x19],[0xA4,0x55,0x87,0x5A,0x58,0xDB,0x9E,0x03]];
const rol = (x, n) => ((x << n) | (x >>> (32 - n))) >>> 0;
const bytesOf = w => [w & 255, (w >>> 8) & 255, (w >>> 16) & 255, (w >>> 24) & 255];
function h(X, L) { // k = 2, L = [l0, l1]
  const x = bytesOf(X), l0 = bytesOf(L[0]), l1 = bytesOf(L[1]);
  const y = [q1[q0[q0[x[0]] ^ l1[0]] ^ l0[0]], q0[q0[q1[x[1]] ^ l1[1]] ^ l0[1]],
             q1[q1[q0[x[2]] ^ l1[2]] ^ l0[2]], q0[q1[q1[x[3]] ^ l1[3]] ^ l0[3]]];
  let z = 0;
  for (let i = 0; i < 4; i++) {
    let s = 0;
    for (let j = 0; j < 4; j++) s ^= gfmul(MDS[i][j], y[j], 0x169);
    z |= s << (8 * i);
  }
  return z >>> 0;
}
function twofish(key) {
  const M = [0, 1, 2, 3].map(i => key.readUInt32LE(4 * i));
  const Me = [M[0], M[2]], Mo = [M[1], M[3]];
  const S = [0, 1].map(i => {
    let w = 0;
    for (let r = 0; r < 4; r++) {
      let s = 0;
      for (let c = 0; c < 8; c++) s ^= gfmul(RS[r][c], key[8 * i + c], 0x14D);
      w |= s << (8 * r);
    }
    return w >>> 0;
  });
  const K = [];
  for (let i = 0; i < 20; i++) {
    const A = h((2 * i * 0x01010101) >>> 0, Me);
    const B = rol(h(((2 * i + 1) * 0x01010101) >>> 0, Mo), 8);
    K.push((A + B) >>> 0, rol((A + 2 * B) >>> 0, 9));
  }
  const SL = [S[1], S[0]];
  const g = X => h(X, SL);
  return function encrypt(block) {
    let R = [0, 1, 2, 3].map(i => (block.readUInt32LE(4 * i) ^ K[i]) >>> 0);
    for (let r = 0; r < 16; r++) {
      const T0 = g(R[0]), T1 = g(rol(R[1], 8));
      const F0 = (T0 + T1 + K[2 * r + 8]) >>> 0, F1 = (T0 + 2 * T1 + K[2 * r + 9]) >>> 0;
      const n2 = rol((R[2] ^ F0) >>> 0, 31), n3 = (rol(R[3], 1) ^ F1) >>> 0;
      R = [n2, n3, R[0], R[1]];
    }
    R = [R[2], R[3], R[0], R[1]];
    const out = Buffer.alloc(16);
    for (let i = 0; i < 4; i++) out.writeUInt32LE((R[i] ^ K[i + 4]) >>> 0, 4 * i);
    return out;
  };
}

// Vector de prueba oficial: clave y texto en cero
const tv = twofish(Buffer.alloc(16))(Buffer.alloc(16)).toString('hex').toUpperCase();
if (tv !== '9F589F5CF6122C32B6BFEC2F2AE8C35A') { console.error('Twofish MAL: ' + tv); process.exit(1); }

// ---------- EAX (solo CTR con N' = OMAC0(N)) ----------
const xor = (a, b) => Buffer.from(a.map((v, i) => v ^ b[i]));
function dbl(b) {
  const o = Buffer.alloc(16);
  for (let i = 0; i < 16; i++) o[i] = ((b[i] << 1) | (i < 15 ? b[i + 1] >> 7 : 0)) & 255;
  if (b[0] & 0x80) o[15] ^= 0x87;
  return o;
}
function eaxCtrDecrypt(E, nonce, data) {
  const K1 = dbl(E(Buffer.alloc(16)));
  const ctr = E(xor(xor(E(Buffer.alloc(16)), nonce), K1)); // CMAC([0]^16 || N)
  const out = Buffer.alloc(data.length);
  for (let off = 0; off < data.length; off += 16) {
    const ks = E(ctr);
    for (let i = 0; i < 16 && off + i < data.length; i++) out[off + i] = data[off + i] ^ ks[i];
    for (let i = 15; i >= 0; i--) { ctr[i] = (ctr[i] + 1) & 255; if (ctr[i]) break; }
  }
  return out;
}

// ---------- Formato PT ----------
const input = fs.readFileSync(process.argv[2]);
const n = input.length;
const s1 = Buffer.alloc(n);
for (let i = 0; i < n; i++) s1[i] = input[n - 1 - i] ^ ((n - i * n) & 255);
const E = twofish(Buffer.alloc(16, 137));
const dec = eaxCtrDecrypt(E, Buffer.alloc(16, 16), s1.subarray(0, n - 16));
for (let i = 0; i < dec.length; i++) dec[i] ^= (dec.length - i) & 255;
const xml = zlib.inflateSync(dec.subarray(4));
fs.writeFileSync(process.argv[3], xml);
console.log('OK', xml.length, 'bytes');
