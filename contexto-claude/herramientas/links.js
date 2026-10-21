const x=require('fs').readFileSync('integrador.xml','utf8');
const id={};
for(const d of x.split('<DEVICE>').slice(1)){const n=(d.match(/<NAME[^>]*>([^<]*)</)||[])[1];const r=(d.match(/<SAVE_REF_ID>([^<]*)</)||[])[1];id[r]=n;}
const L=x.slice(x.lastIndexOf('<LINKS>'));
for(const l of L.split('<LINK>').slice(1)){
 const f=l.match(/<FROM>([^<]*)<\/FROM>\s*<PORT>([^<]*)<\/PORT>\s*<TO>([^<]*)<\/TO>\s*<PORT>([^<]*)<\/PORT>/);
 const t=(l.match(/<TYPE>(e[A-Za-z]*)<\/TYPE>\s*<\/CABLE>/)||[])[1];
 const fn=(l.match(/<FUNCTIONAL>([^<]*)</)||[])[1];
 if(f)console.log(`${id[f[1]]}:${f[2]} <-> ${id[f[3]]}:${f[4]} [${t}] func=${fn}`);
}
