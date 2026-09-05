import { readFileSync, writeFileSync } from "node:fs";
const [cookieFile, out, w, h, url] = process.argv.slice(2);
const t = await (await fetch("http://127.0.0.1:9336/json/list")).json();
const ws = new WebSocket(t.find(x=>x.type==="page").webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener("open",r,{once:true}));
let id=0; const p=new Map();
ws.addEventListener("message",e=>{const m=JSON.parse(e.data);
  if(m.id&&p.has(m.id)){p.get(m.id)(m);p.delete(m.id);}});
const send=(method,params={})=>{const i=++id;
  ws.send(JSON.stringify({id:i,method,params}));return new Promise(r=>p.set(i,r));};
const ev=async e=>(await send("Runtime.evaluate",{expression:e,awaitPromise:true,returnByValue:true})).result?.result?.value;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
await send("Page.enable");await send("Runtime.enable");await send("Network.enable");
await send("Network.clearBrowserCookies");
for(const c of JSON.parse(readFileSync(cookieFile,"utf8")))
  await send("Network.setCookie",{name:c.name,value:c.value,domain:"localhost",path:"/"});
await send("Emulation.setDeviceMetricsOverride",{width:+w,height:+h,deviceScaleFactor:1,mobile:+w<700});
await send("Page.navigate",{url});
await wait(2600);
console.log(JSON.stringify(await ev(`(()=>{
  const nb=document.querySelector(".navbar"); if(!nb) return {noNavbar:true};
  const r=nb.getBoundingClientRect();
  const links=[...nb.querySelectorAll(".navbar__link")];
  const box=links.length?{l:Math.round(links[0].getBoundingClientRect().left),
    rr:Math.round(links[links.length-1].getBoundingClientRect().right)}:null;
  const sb=document.querySelector(".shell__sidebar");
  return {
    sidebarVisible: sb ? getComputedStyle(sb).display !== "none" : false,
    sidebarLinks: [...document.querySelectorAll(".sidebar .nav-item .nav-item__label")].map(e=>e.textContent),
    navbarLinks: links.map(a=>a.textContent.trim()),
    navbarLinkCount: links.length,
    navbarBg: getComputedStyle(nb).backgroundColor,
    navbarOpaque: !getComputedStyle(nb).backgroundColor.startsWith("rgba"),
    centreOffset: box ? Math.round(((box.l+box.rr)/2) - (r.left + r.width/2)) : null,
    activeLink: links.filter(a=>a.getAttribute("aria-current")==="page").map(a=>a.textContent.trim()),
  };})()`),null,2));
const s=await send("Page.captureScreenshot",{format:"png"});
writeFileSync(out,Buffer.from(s.result.data,"base64"));
ws.close();
