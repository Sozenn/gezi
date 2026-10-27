import { spawn } from "node:child_process";import { mkdtempSync } from "node:fs";import { tmpdir } from "node:os";import { join } from "node:path";
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function br(port){const p=spawn("C:/Program Files/Google/Chrome/Application/chrome.exe",["--headless=new","--disable-gpu",`--remote-debugging-port=${port}`,`--user-data-dir=${mkdtempSync(join(tmpdir(),"c2-"))}`,"about:blank"],{stdio:"ignore"});
 for(let i=0;i<50;i++){try{if((await fetch(`http://127.0.0.1:${port}/json/version`)).ok)break}catch{}await wait(200)}
 const t=(await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t=>t.type==="page");const ws=new WebSocket(t.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener("open",r));
 let id=0;const pend=new Map(),errs=[];ws.addEventListener("message",e=>{const m=JSON.parse(e.data);if(m.method==="Runtime.exceptionThrown")errs.push(m.params.exceptionDetails.exception?.description);if(m.id&&pend.has(m.id)){pend.get(m.id)(m);pend.delete(m.id)}});
 const send=(method,params={})=>new Promise(r=>{const i=++id;pend.set(i,r);ws.send(JSON.stringify({id:i,method,params}))});
 await send("Page.enable");await send("Runtime.enable");
 return{errs,ev:async x=>(await send("Runtime.evaluate",{expression:x,returnByValue:true})).result?.result?.value,go:async u=>{errs.length=0;await send("Page.navigate",{url:u});await wait(4500)},close:()=>{ws.close();p.kill()}}}
const z="?t="+Date.now();
const x=await br(9421);await x.go("https://sozenn.github.io/gezi/"+z);
console.log("BAŞKASI /gezi/ →",await x.ev(`document.querySelector("h1")?.textContent+" | gezi: "+Object.keys(GEZI.items).length+" | Adana geçiyor mu: "+document.documentElement.outerHTML.includes("Adana")`),"| hata:",x.errs.join()||"yok");x.close();
const y=await br(9422);await y.go("https://sozenn.github.io/Gezinti/"+z);
console.log("SEN /Gezinti/ →",await y.ev(`document.querySelector("h1")?.textContent+" | durak: "+document.querySelectorAll("li.stop").length+" | aktarım kopyası: "+!!localStorage.getItem("v1-aktarim")`),"| hata:",y.errs.join()||"yok");
await y.go("https://sozenn.github.io/gezi/"+z);
console.log("SEN /gezi/ →",await y.ev(`document.querySelector("h1")?.textContent+" | durak: "+Object.keys(D("plan").items).length`),"| hata:",y.errs.join()||"yok");
await y.go("https://sozenn.github.io/Gezinti/yeni/#grup=TEST");
console.log("eski /yeni/ linki →",await y.ev("location.href"));y.close();process.exit(0);
