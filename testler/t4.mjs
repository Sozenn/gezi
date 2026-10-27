import { spawn } from "node:child_process";import { mkdtempSync, writeFileSync } from "node:fs";import { tmpdir } from "node:os";import { join } from "node:path";
const S=process.argv[2],wait=ms=>new Promise(r=>setTimeout(r,ms));
async function br(port,pre=""){const p=spawn("C:/Program Files/Google/Chrome/Application/chrome.exe",["--headless=new","--disable-gpu",`--remote-debugging-port=${port}`,`--user-data-dir=${mkdtempSync(join(tmpdir(),"t2-"))}`,"about:blank"],{stdio:"ignore"});
 for(let i=0;i<50;i++){try{if((await fetch(`http://127.0.0.1:${port}/json/version`)).ok)break}catch{}await wait(200)}
 const t=(await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t=>t.type==="page");const ws=new WebSocket(t.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener("open",r));
 let id=0;const pend=new Map(),errs=[];ws.addEventListener("message",e=>{const m=JSON.parse(e.data);if(m.method==="Runtime.exceptionThrown")errs.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text);if(m.id&&pend.has(m.id)){pend.get(m.id)(m);pend.delete(m.id)}});
 const send=(method,params={})=>new Promise(r=>{const i=++id;pend.set(i,r);ws.send(JSON.stringify({id:i,method,params}))});
 await send("Page.enable");await send("Runtime.enable");await send("Emulation.setDeviceMetricsOverride",{width:390,height:900,deviceScaleFactor:1,mobile:true});
 await send("Page.addScriptToEvaluateOnNewDocument",{source:"window.open=u=>{window._opened=u;return null};addEventListener('DOMContentLoaded',()=>{new MutationObserver(()=>{const d=document.querySelector(\".dlg\");if(!d||d.dataset.t)return;d.dataset.t=1;const m=d.textContent;setTimeout(()=>{(/AI ile/.test(m)?d.querySelector(\".hayir\"):d.querySelector(\".evet\")).click()},30)}).observe(document.documentElement,{childList:true,subtree:true});});"+pre});
 const ev=async x=>{const r=await send("Runtime.evaluate",{expression:x,awaitPromise:true,returnByValue:true});return r.result?.exceptionDetails?"EXC "+(r.result.exceptionDetails.exception?.description||"").slice(0,200):r.result?.result?.value};
 const until=async(x,ms=20000)=>{const t0=Date.now();while(Date.now()-t0<ms){if(await ev(x)===true)return true;await wait(250)}return false};
 const shot=async(n,h=1400)=>{await send("Emulation.setDeviceMetricsOverride",{width:390,height:h,deviceScaleFactor:1,mobile:true});await wait(300);const r=await send("Page.captureScreenshot",{format:"png"});writeFileSync(`${S}/${n}.png`,Buffer.from(r.result.data,"base64"))};
 return{ev,until,send,errs,shot,go:u=>send("Page.navigate",{url:u}),close:()=>{ws.close();p.kill()}}}
const U="http://127.0.0.1:8765/gezi/index.html",o=[],log=(k,v)=>o.push(k+": "+v);
const set=(sel,v)=>`{const e=document.querySelector(${JSON.stringify(sel)});e.value=${JSON.stringify(v)};e.dispatchEvent(new Event("input",{bubbles:true}));e.dispatchEvent(new Event("change",{bubbles:true}));true}`;
const click=(sel)=>`{document.querySelector(${JSON.stringify(sel)}).click();true}`;
const clickText=(sel,txt)=>`{[...document.querySelectorAll(${JSON.stringify(sel)})].find(b=>b.textContent.includes(${JSON.stringify(txt)})).click();true}`;

/* ---------- 1) Yeni telefon ---------- */
const a=await br(9401);
await a.go(U);await wait(1500);
log("ev ekranı",await a.ev(`document.querySelector("#ust h1").textContent+" | "+document.querySelector(".bos")?.textContent.slice(0,30)`));
await a.ev(click(".yeni-gezi"));await wait(200);
await a.ev(set(".mform2 input","Mardin hafta sonu"));
await a.ev(`{const d=document.querySelectorAll(".mform2 input[type=date]");d[0].value="2026-11-20";d[0].dispatchEvent(new Event("change"));d[1].value="2026-11-22";true}`);
await a.ev(`{const i=document.querySelector(".yersec input");i.value="Mardin";i.dispatchEvent(new Event("input"));true}`);
log("şehir önerisi",await a.until(`document.querySelectorAll(".yoneri button").length>0`)+" "+await a.ev(`document.querySelector(".yoneri button")?.innerText.replace(/\\n/g," / ")`));
await a.ev(click(".yoneri button"));
await a.ev(`{const i=[...document.querySelectorAll(".mform2 input")].find(x=>x.placeholder.includes("Evim"));i.value="Evim, Pendik";true}`);
await a.ev(`{document.querySelector(".mform2").requestSubmit();true}`);await wait(800);
log("gezi açıldı",await a.ev(`document.querySelector("#ust h1").textContent+" | gün kartı "+document.querySelectorAll(".day").length+" | bölge "+document.querySelector(".yerbtn").textContent+" | çıkış durağı "+Object.values(D("plan").items).filter(s=>s.c).map(s=>s.t+" "+s.n).join()`));
// Elle durak: öneriden seç
await a.ev(clickText(".aibar button","Durak ekle"));await wait(200);
await a.ev(`{const f=document.querySelector(".mkutu .mform2");f.querySelector("input[type=time]").value="13:00";true}`);
await a.ev(`{const i=document.querySelector(".mkutu .yersec input");i.value="Mardin Müzesi";i.dispatchEvent(new Event("input"));true}`);
log("yer önerisi",await a.until(`document.querySelectorAll(".mkutu .yoneri button").length>0`)+" "+await a.ev(`document.querySelector(".mkutu .yoneri button")?.innerText.replace(/\\n/g," / ")`));
await a.ev(click(".mkutu .yoneri button"));
await a.ev(`{document.querySelector(".mkutu .mform2").requestSubmit();true}`);await wait(300);
log("öneriden durak",await a.ev(`JSON.stringify(Object.values(D("plan").items).filter(s=>!s.c).map(s=>({n:s.n,la:s.la,q:s.q})))`));
log("Git linki",await a.ev(`[...document.querySelectorAll("li.stop a.go")].map(x=>x.href).join(" ; ")`));
// Google link
await a.ev(clickText(".aibar button","Durak ekle"));await wait(200);
await a.ev(`{const f=document.querySelector(".mkutu .mform2");f.querySelector("input[type=time]").value="20:00";const g=f.querySelector(".hsatir input");g.value="https://www.google.com/maps/place/Cercis+Murat+Kona%C4%9F%C4%B1/@37.3121,40.7339,17z/data=!3d37.3121!4d40.7339";g.dispatchEvent(new Event("input"));f.requestSubmit();true}`);await wait(300);
await a.ev(`{const id=Object.entries(D("plan").items).find(([,s])=>s.gl)[0];durakFormu(id,D("plan").items[id].d);const f=document.querySelector(".mkutu .mform2");f.querySelector("input[type=tel]").value="0482 213 68 41";f.requestSubmit();true}`);await wait(300);
await a.ev(`{[...document.querySelectorAll("li.stop")].find(l=>l.textContent.includes("Cercis")).querySelector(".telbtn").click();true}`);await wait(200);
log("telefon",await a.ev(`document.querySelector(".telno")?.textContent+" | ara linki "+document.querySelector(".mkutu a.tara")?.href+" | numarasız durakta: "+(()=>{modalKapat();[...document.querySelectorAll("li.stop")].find(l=>l.textContent.includes("Müzesi")).querySelector(".telbtn").click();return document.querySelector(".mkutu .note")?.textContent.slice(0,40)})()`));
await a.ev(`{modalKapat();true}`);
log("Google linkiyle",await a.ev(`JSON.stringify(Object.values(D("plan").items).filter(s=>s.gl).map(s=>({n:s.n,la:s.la,lo:s.lo})))`));
// AI
await a.ev(click(".aibar .ana"));await wait(300);
await a.ev(`{document.querySelector(".mic textarea").value="yemek ağırlıklı";true}`);
await a.ev(clickText(".aib","ChatGPT"));
log("ChatGPT açılan",await a.ev(`(window._opened||"").slice(0,60)+" … istek uzunluğu "+decodeURIComponent((window._opened||"").split("q=")[1]||"").length`));
log("istek metni",await a.ev(`decodeURIComponent(window._opened.split("q=")[1]).split("\\n").slice(0,8).join(" | ")`));
const cevap=`Harika bir plan:\n\n\`\`\`json\n{"gunler":[{"tarih":"2026-11-21","duraklar":[{"saat":"09:00","ad":"Cercis Murat Konağı","not":"kahvaltı","arama":"Cercis Murat Konağı, Artuklu, Mardin","acilis":"08:00","kapanis":"23:00","telefon":"+90 482 213 68 41"},{"saat":"11:00","ad":"Zinciriye Medresesi","not":"","arama":"Zinciriye Medresesi, Mardin"}]},{"tarih":"2026-11-22","duraklar":[{"saat":"10:00","ad":"Deyrulzafaran Manastırı","arama":"Deyrulzafaran, Mardin","kapanis":"17:00"},]}]}\n\`\`\``;
await a.ev(`{const t=document.querySelectorAll(".mic textarea")[1];t.value=${JSON.stringify(cevap)};t.dispatchEvent(new Event("input"));true}`);await wait(700);
log("önizleme",await a.ev(`document.querySelector(".onizle").innerText.replace(/\\n/g," / ")`));
await a.shot("v2-ai",1500);
await a.ev(clickText(".onizle .ana","Plana ekle"));await wait(300);
log("AI telefon",await a.ev(`Object.values(D("plan").items).filter(s=>s.tel).map(s=>s.n+": "+s.tel).join(" ; ")`));
log("AI sonrası durak",await a.ev(`Object.values(D("plan").items).length+" | "+Object.values(D("plan").items).filter(s=>s.d==="2026-11-22").map(s=>s.t+" "+s.n+" "+(s.kp||"")).join()`));
// Bütçe
await a.ev(clickText("nav button","Bütçe"));await wait(200);
await a.ev(`{const f=document.querySelector(".mform");f.querySelector("input[type=number]").value="350";f.requestSubmit();true}`);await wait(200);
log("masraf",await a.ev(`document.querySelector(".pct.mas").textContent`));
// Bavul
await a.ev(clickText("nav button","Bavul"));await wait(200);
log("bavul önerilen",await a.ev(`document.querySelectorAll(".chk").length+" madde, "+document.querySelector(".pct").textContent`));
await a.ev(clickText(".seg button","Kendi"));await wait(200);
await a.ev(`{const f=document.querySelector("form.add");f.querySelector("input").value="Şarj aleti";f.requestSubmit();true}`);await wait(200);
log("bavul kendi",await a.ev(`[...document.querySelectorAll(".chk span")].map(x=>x.textContent).join()`));
// Tarih değiştir
await a.ev(clickText("nav button","Program"));await a.ev(click(".ubar .menu"));await a.ev(clickText(".mbtn","düzenle"));await wait(200);
await a.ev(`{const d=document.querySelectorAll(".mform2 input[type=date]");d[0].value="2026-11-27";d[1].value="2026-11-29";document.querySelector(".mkutu .mform2").requestSubmit();true}`);await wait(300);
log("tarih kaydırıldı",await a.ev(`[...new Set(Object.values(D("plan").items).map(s=>s.d))].sort().join()+" | bölge "+document.querySelector(".yerbtn").textContent`));
await a.ev(`window.scrollTo(0,0);true`);await a.shot("v2-program",1700);
await a.ev(click(".ubar .geri"));await wait(300);await a.shot("v2-ev",800);
log("ev ekranı kart",await a.ev(`[...document.querySelectorAll(".gkart")].map(x=>x.innerText.replace(/\\n/g," / ")).join(" || ")`));
await a.ev(`{geziAc(Object.keys(GEZI.items)[0]);document.querySelector(".ubar .menu").click();true}`);await wait(200);
await a.ev(`{[...document.querySelectorAll(".mbtn")].find(b=>b.textContent.includes("sil")).click();true}`);await wait(600);
log("menüden gezi sil",await a.ev(`"kalan gezi "+Object.keys(GEZI.items).length+" | ekran "+document.querySelector("#ust h1").textContent`));
await a.ev(`{const i=document.createElement("div");document.body.append(i);const y=yerSecici("x",()=>{},{});i.append(y);const q=y.querySelector("input");q.value="Ankara";q.dispatchEvent(new Event("input"));window._ys=y;true}`);
await a.until(`window._ys.querySelectorAll(".yoneri button").length>0`);
log("öneri sayısı (en fazla 5)",await a.ev(`window._ys.querySelectorAll(".yoneri button").length+" | kayan liste yüksekliği "+getComputedStyle(window._ys.querySelector(".yoneri")).maxHeight`));
log("A hataları",a.errs.join(" || ")||"yok");a.close();

/* ---------- 2) Eski uygulama verisi olan telefon ---------- */
const yabanci=await br(9405);await yabanci.go(U);await wait(2000);
log("BAŞKASI açınca",await yabanci.ev(`"gezi sayısı "+Object.keys(GEZI.items).length+" | sayfada Adana: "+document.body.innerText.includes("Adana")+" | aktar butonu: "+document.body.innerText.includes("Eski uygulamadaki")`));yabanci.close();
const b=await br(9402);await b.go("http://127.0.0.1:8765/gezinti-repo/index.html");await wait(2500);
await b.ev(`{localStorage.setItem("depo-masraf",JSON.stringify({items:{m1:{g:"2026-10-28",k:"yemek",tl:450,n:"test",s:1}}}));true}`);
await b.go(U);await wait(2000);
log("aktarım",await b.ev(`(document.querySelector("#ust h1")?.textContent)+" | gezi sayısı "+Object.keys(GEZI.items).length+" | plan "+Object.keys(depo("adana2026_plan").items).length+" | masraf "+Object.keys(depo("adana2026_masraf").items).length+" | çıkış "+Object.values(depo("adana2026_plan").items).filter(s=>s.c).map(s=>s.n).join()`));
await b.shot("v2-adana",1300);
await b.ev(`{document.querySelector(".ubar .menu").click();true}`);await wait(200);
await b.ev(`{[...document.querySelectorAll(".mbtn")].find(x=>x.textContent.includes("sil")).click();true}`);await wait(600);
await b.go(U);await wait(2000);
log("Adana silindikten sonra yenile",await b.ev(`"gezi sayısı "+Object.keys(GEZI.items).length+" | aktar butonu "+document.body.innerText.includes("Eski uygulamadaki gezini aktar")`));
await b.ev(`{[...document.querySelectorAll("button")].find(x=>x.textContent.includes("Eski uygulamadaki")).click();true}`);await wait(500);
log("butonla tekrar aktar",await b.ev(`"gezi sayısı "+Object.keys(GEZI.items).length+" | plan "+Object.keys(depo("adana2026_plan").items).length`));
log("B hataları",b.errs.join(" || ")||"yok");b.close();

/* ---------- 3) İki telefon aynı grupta ---------- */
const A_="ABCDEFGHJKMNPQRSTUVWXYZ23456789",raw=Array.from({length:12},()=>A_[Math.floor(Math.random()*A_.length)]).join(""),KOD=raw.match(/.{4}/g).join("-");
const c=await br(9403),d=await br(9404);
await c.go(U+"#grup="+KOD);
log("C bağlandı",await c.until(`/Bağlı/.test(document.querySelector(".grup-kart small")?.textContent||"")`));
await c.ev(`{GEZI.koy("gtest1",{ad:"Ortak test",bas:"2026-12-01",son:"2026-12-02",s:Date.now()});aktif="gtest1";D("plan").koy("p1",{d:"2026-12-01",t:"10:00",n:"Ortak durak",q:"Ankara Kalesi"});true}`);await wait(1500);
await d.go(U+"#grup="+KOD);
log("D gezi gördü",await d.until(`!!GEZI.items.gtest1`));
await d.ev(`{geziAc("gtest1");true}`);
log("D durak gördü",await d.until(`Object.values(D("plan").items).some(s=>s.n==="Ortak durak")`));
await d.ev(`{D("plan").koy("p2",{d:"2026-12-02",t:"12:00",n:"D'nin durağı",q:"Anıtkabir"});true}`);
log("C, D'nin durağını gördü",await c.until(`Object.values(depo("gtest1_plan").items).some(s=>s.n==="D'nin durağı")`));
log("C/D hataları",[...c.errs,...d.errs].join(" || ")||"yok");
console.log(o.join("\n"));c.close();d.close();
/* test grubunu temizlemek için kodu yaz */
writeFileSync(`${S}/t2kod.txt`,raw);process.exit(0);
