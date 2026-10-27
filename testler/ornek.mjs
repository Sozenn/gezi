import { spawn } from "node:child_process";import { mkdtempSync, writeFileSync } from "node:fs";import { tmpdir } from "node:os";import { join } from "node:path";
const S=process.argv[2],wait=ms=>new Promise(r=>setTimeout(r,ms));
async function br(port){const p=spawn("C:/Program Files/Google/Chrome/Application/chrome.exe",["--headless=new","--disable-gpu",`--remote-debugging-port=${port}`,`--user-data-dir=${mkdtempSync(join(tmpdir(),"or-"))}`,"about:blank"],{stdio:"ignore"});
 for(let i=0;i<50;i++){try{if((await fetch(`http://127.0.0.1:${port}/json/version`)).ok)break}catch{}await wait(200)}
 const t=(await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t=>t.type==="page");const ws=new WebSocket(t.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener("open",r));
 let id=0;const pend=new Map(),errs=[];ws.addEventListener("message",e=>{const m=JSON.parse(e.data);if(m.method==="Runtime.exceptionThrown")errs.push(m.params.exceptionDetails.exception?.description);if(m.id&&pend.has(m.id)){pend.get(m.id)(m);pend.delete(m.id)}});
 const send=(method,params={})=>new Promise(r=>{const i=++id;pend.set(i,r);ws.send(JSON.stringify({id:i,method,params}))});
 await send("Page.enable");await send("Runtime.enable");await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});
 const ev=async x=>{const r=await send("Runtime.evaluate",{expression:x,awaitPromise:true,returnByValue:true});return r.result?.exceptionDetails?"EXC "+r.result.exceptionDetails.exception?.description:r.result?.result?.value};
 const shot=async(n,h)=>{await send("Emulation.setDeviceMetricsOverride",{width:390,height:h,deviceScaleFactor:1,mobile:true});await wait(400);const r=await send("Page.captureScreenshot",{format:"png"});writeFileSync(`${S}/${n}.png`,Buffer.from(r.result.data,"base64"))};
 return{ev,shot,errs,go:async u=>{await send("Page.navigate",{url:u});await wait(1800)},close:()=>{ws.close();p.kill()}}}
const U="http://127.0.0.1:8765/gezi/index.html",N=String.fromCharCode(10);
const a=await br(9461);await a.go(U);
console.log("yeni kişi:",await a.ev(`Object.values(GEZI.items).map(g=>g.ad+" "+g.bas+"–"+g.son).join()+" | kart: "+document.querySelector(".gkart")?.innerText.split("${N}").join(" / ")`));
await a.shot("o1-ev",844);
await a.ev(`{geziAc("ornek");true}`);await a.ev(`new Promise(r=>setTimeout(r,500))`);
console.log("içi:",await a.ev(`"durak "+Object.keys(D("plan").items).length+" | gün "+document.querySelectorAll(".day").length+" | bant "+!!document.querySelector(".ornekbant")+" | masraf "+Object.values(D("masraf").items).reduce((t,x)=>t+x.tl,0)+" | günlük "+Object.keys(D("gunluk").items).length+" | bölgeler "+[...document.querySelectorAll(".yerbtn")].map(b=>b.textContent).join(",")`));
await a.ev(`window.scrollTo(0,0)`);await a.shot("o2-gezi",2000);
await a.ev(`{document.querySelector(".obtn button:last-child").click();true}`);await a.ev(`new Promise(r=>setTimeout(r,300))`);await a.ev(`{document.querySelector(".dlg .evet").click();true}`);await a.ev(`new Promise(r=>setTimeout(r,500))`);
console.log("silince:",await a.ev(`"gezi "+Object.keys(GEZI.items).length+" | göz at butonu "+document.body.innerText.includes("Örnek bir geziye göz at")`));
await a.go(U);console.log("yenileyince:",await a.ev(`"gezi "+Object.keys(GEZI.items).length`));
await a.ev(`{[...document.querySelectorAll("button")].find(b=>b.textContent.includes("göz at")).click();true}`);await a.ev(`new Promise(r=>setTimeout(r,500))`);
console.log("göz at:",await a.ev(`"gezi "+Object.keys(GEZI.items).length+" | açık: "+document.querySelector("#ust h1").textContent`));
console.log("A hataları:",a.errs.join(" || ")||"yok");a.close();
const b=await br(9462);await b.go("http://127.0.0.1:8765/gezinti-repo/index.html");await b.go(U);
console.log("senin telefonun:",await b.ev(`Object.values(GEZI.items).map(g=>g.ad).join(", ")`));b.close();process.exit(0);
