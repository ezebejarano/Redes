const fs=require('fs');const x=fs.readFileSync(process.argv[2],'utf8');
const devs=x.split('<DEVICE>').slice(1);
const out=[];
for(const d of devs){
  const eng=d.slice(0,d.indexOf('</ENGINE>'));
  const type=(eng.match(/<TYPE[^>]*>([^<]*)<\/TYPE>/)||[])[1];
  const model=(eng.match(/<TYPE[^>]*model="([^"]*)"/)||[])[1];
  const name=(eng.match(/<NAME[^>]*>([^<]*)<\/NAME>/)||[])[1];
  let s=`##### ${name} [${type}/${model}]\n`;
  const rc=eng.match(/<RUNNINGCONFIG>([\s\S]*?)<\/RUNNINGCONFIG>/);
  if(rc){s+=[...rc[1].matchAll(/<LINE>([^<]*)<\/LINE>/g)].map(m=>m[1]).filter(l=>l.trim()&&l.trim()!=='!').join('\n')+'\n';}
  else{
    for(const p of eng.matchAll(/<PORT>([\s\S]*?)<\/PORT>/g)){const P=p[1];const ip=(P.match(/<IP>([^<]*)</)||[])[1];if(ip)s+=`  port ip=${ip} mask=${(P.match(/<SUBNET>([^<]*)</)||[])[1]} up=${(P.match(/<POWER>([^<]*)</)||[])[1]}\n`;}
    const gw=(eng.match(/<GATEWAY>([^<]*)</)||[])[1];const dns=(eng.match(/<DNS_CLIENT>[\s\S]*?<SERVER_IP>([^<]*)</)||[])[1];
    s+=`  gw=${gw} dns=${dns} dhcp=${(eng.match(/<PORT_DHCP_ENABLE>([^<]*)</)||[])[1]}\n`;
  }
  out.push(s);
}
fs.writeFileSync(process.argv[3],out.join('\n'));console.log(devs.length,'devices');
