import { spawn } from "node:child_process";import { mkdtempSync, writeFileSync } from "node:fs";import { tmpdir } from "node:os";import { join } from "node:path";
const S=process.argv[2],wait=ms=>new Promise(r=>setTimeout(r,ms)),port=9471,N="String.fromCharCode(10)";
const p=spawn("C:/Program Files/Google/Chrome/Application/chrome.exe",["--headless=new","--disable-gpu",`--remote-debugging-port=${port}`,`--user-data-dir=${mkdtempSync(join(tmpdir(),"hz-"))}`,"about:blank"],{stdio:"ignore"});
for(let i=0;i<50;i++){try{if((await fetch(`http://127.0.0.1:${port}/json/version`)).ok)break}catch{}await wait(200)}
const t=(await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t=>t.type==="page");const ws=new WebSocket(t.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener("open",r));
let id=0;const pend=new Map(),errs=[];ws.addEventListener("message",e=>{const m=JSON.parse(e.data);if(m.method==="Runtime.exceptionThrown")errs.push(m.params.exceptionDetails.exception?.description);if(m.id&&pend.has(m.id)){pend.get(m.id)(m);pend.delete(m.id)}});
const send=(method,params={})=>new Promise(r=>{const i=++id;pend.set(i,r);ws.send(JSON.stringify({id:i,method,params}))});
const ev=async x=>{const r=await send("Runtime.evaluate",{expression:x,returnByValue:true});return r.result?.exceptionDetails?"EXC "+r.result.exceptionDetails.exception?.description:r.result?.result?.value};
const until=async(x,ms=15000)=>{const t0=Date.now();while(Date.now()-t0<ms){if(await ev(x)===true)return true;await wait(250)}return false};
const shot=async(n,h)=>{await send("Emulation.setDeviceMetricsOverride",{width:390,height:h,deviceScaleFactor:1,mobile:true});await wait(400);const r=await send("Page.captureScreenshot",{format:"png"});writeFileSync(`${S}/${n}.png`,Buffer.from(r.result.data,"base64"))};
await send("Page.enable");await send("Runtime.enable");await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});
await send("Page.navigate",{url:"http://127.0.0.1:8765/gezi/index.html"});await wait(1500);
// Tam ekran arama (yeni gezi formu)
await ev(`{eveDon();geziFormu();true}`);await wait(300);
await ev(`{document.querySelector(".mkutu .yalan").click();true}`);await wait(200);
console.log("arama açıldı:",await ev(`!!document.querySelector(".arama")+" odak:"+(document.activeElement===document.querySelector(".arama input"))`));
await ev(`{const i=document.querySelector(".arama input");i.value="Urf";i.dispatchEvent(new Event("input"));true}`);
await until(`document.querySelectorAll(".asonuc").length>0`);
console.log("Urf:",await ev(`[...document.querySelectorAll(".asonuc")].map(b=>b.innerText.split(${N}).join(" ~ ")).join(" | ")`));
await shot("h1-arama",844);
await ev(`{document.querySelector(".asonuc").click();true}`);await wait(200);
console.log("forma döndü:",await ev(`!document.querySelector(".arama")+" | "+document.querySelector(".mkutu .yalan").innerText.split(${N}).join(" / ")`));
await ev(`{document.querySelector(".mkutu .mform2 input").value="Urfa gezisi";document.querySelector(".mkutu .mform2").requestSubmit();true}`);await wait(600);
console.log("gezi:",await ev(`document.querySelector("#ust h1").textContent+" | bölge "+document.querySelector(".yerbtn")?.textContent`));
// Hızlı ekleme
const ilk=`document.querySelector(".day .hizli input")`;
await ev(`{const i=${ilk};i.focus();i.value="Balıklıgöl";i.dispatchEvent(new Event("input"));true}`);
await until(`document.querySelectorAll(".day .hizli .hsonuc:not(.elle)").length>0`);
console.log("öneriler:",await ev(`[...document.querySelectorAll(".day .hizli .hsonuc")].map(b=>b.innerText.split(${N}).join(" ~ ")).join(" | ")`));
await shot("h2-hizli",844);
await ev(`{document.querySelector(".day .hizli .hsonuc:not(.elle)").dispatchEvent(new MouseEvent("click",{bubbles:true}));true}`);await wait(500);
console.log("eklendi:",await ev(`JSON.stringify(Object.values(D("plan").items).map(s=>({t:s.t,n:s.n,la:s.la})))+" | bildirim: "+(document.querySelector(".toast")?.textContent||"-")`));
await ev(`{const i=${ilk};i.focus();i.value="Kafe Deneme";i.dispatchEvent(new Event("input"));i.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true}));true}`);await wait(500);
console.log("Enter ile:",await ev(`Object.values(D("plan").items).map(s=>s.t+" "+s.n).join(", ")`));
await ev(`{const x=[...document.querySelectorAll(".day li.stop")].find(l=>l.textContent.includes("Kafe")).querySelector(".tinp");x.value="16:45";x.dispatchEvent(new Event("change"));true}`);await wait(400);
console.log("saat değişti:",await ev(`Object.values(D("plan").items).map(s=>s.t+" "+s.n).join(", ")`));
await ev(`window.scrollTo(0,0)`);await shot("h3-gun",1400);
console.log("hatalar:",errs.join(" || ")||"yok");ws.close();p.kill();process.exit(0);
