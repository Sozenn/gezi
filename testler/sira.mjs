import { spawn } from "node:child_process";import { mkdtempSync, writeFileSync } from "node:fs";import { tmpdir } from "node:os";import { join } from "node:path";
const S=process.argv[2],wait=ms=>new Promise(r=>setTimeout(r,ms)),port=9481;
const p=spawn("C:/Program Files/Google/Chrome/Application/chrome.exe",["--headless=new","--disable-gpu",`--remote-debugging-port=${port}`,`--user-data-dir=${mkdtempSync(join(tmpdir(),"sr-"))}`,"about:blank"],{stdio:"ignore"});
for(let i=0;i<50;i++){try{if((await fetch(`http://127.0.0.1:${port}/json/version`)).ok)break}catch{}await wait(200)}
const t=(await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t=>t.type==="page");const ws=new WebSocket(t.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener("open",r));
let id=0;const pend=new Map(),errs=[];ws.addEventListener("message",e=>{const m=JSON.parse(e.data);if(m.method==="Runtime.exceptionThrown")errs.push(m.params.exceptionDetails.exception?.description);if(m.id&&pend.has(m.id)){pend.get(m.id)(m);pend.delete(m.id)}});
const send=(method,params={})=>new Promise(r=>{const i=++id;pend.set(i,r);ws.send(JSON.stringify({id:i,method,params}))});
const ev=async x=>{const r=await send("Runtime.evaluate",{expression:x,returnByValue:true});return r.result?.exceptionDetails?"EXC "+r.result.exceptionDetails.exception?.description:r.result?.result?.value};
await send("Page.enable");await send("Runtime.enable");await send("Emulation.setDeviceMetricsOverride",{width:390,height:1800,deviceScaleFactor:1,mobile:false});
await send("Page.navigate",{url:"http://127.0.0.1:8765/gezi/index.html"});await wait(1500);
await ev(`{geziAc("ornek");true}`);await wait(400);
const gun=await ev(`Object.keys(GEZI.items.ornek.gunler)[0]`);
const sira=()=>ev(`gunSirasi("${gun}").map(i=>D("plan").items[i].t+" "+D("plan").items[i].n).join(" | ")`);
console.log("başta:",await sira());
await ev(`{document.querySelector('.day[data-d="${gun}"] .dduz').click();true}`);await wait(300);
const satir=n=>`[...document.querySelectorAll('.day[data-d="${gun}"] li.stop[data-id]')].find(l=>l.textContent.includes("${n}"))`;
await ev(`{${satir("Zinciriye")}.querySelectorAll(".sira")[1].click();true}`);await wait(300);
console.log("Zinciriye ▼:",await sira());
await ev(`{${satir("Zinciriye")}.querySelectorAll(".sira")[0].click();true}`);await wait(300);
console.log("Zinciriye ▲:",await sira());
await ev(`window.scrollTo(0,0)`);
const r=await ev(`(()=>{const a=${satir("Mardin Müzesi")}.querySelector(".tutamak").getBoundingClientRect(),b=${satir("Otele giriş")}.getBoundingClientRect();return [a.x+a.width/2,a.y+a.height/2,b.y+5]})()`);
const [x,y,hy]=r;await send("Input.dispatchMouseEvent",{type:"mousePressed",x,y,button:"left",clickCount:1});
for(let k=1;k<=10;k++){await send("Input.dispatchMouseEvent",{type:"mouseMoved",x,y:y+(hy-y)*k/10,button:"left",buttons:1});await wait(30)}
const sh=await send("Page.captureScreenshot",{format:"png",clip:{x:0,y:Math.max(0,hy-200),width:390,height:700,scale:1}});writeFileSync(`${S}/s1-surukle.png`,Buffer.from(sh.result.data,"base64"));
await send("Input.dispatchMouseEvent",{type:"mouseReleased",x,y:hy,button:"left",clickCount:1});await wait(400);
console.log("Müze sürüklendi:",await sira());
console.log("hatalar:",errs.join(" || ")||"yok");ws.close();p.kill();process.exit(0);
