// Cloudflare Worker: handles POST /api/contact; every other request is served from the static export (out/).
// Sends the contact form to CONTACT_TO through Resend's HTTP API (set RESEND_API_KEY and CONTACT_TO as secrets on the Worker).
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// CORS: the GitHub Pages copy of the site posts here from another origin
const cors={'access-control-allow-origin':'*','access-control-allow-methods':'POST, OPTIONS','access-control-allow-headers':'content-type'};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json',...cors}});

async function contact(request,env){
 if(!env.RESEND_API_KEY||!env.CONTACT_TO)return json({error:'Mail is not configured'},500);
 let data;try{data=await request.json()}catch{return json({error:'Bad request'},400)}
 const from=String(data.from||'').trim().slice(0,200),message=String(data.message||'').trim().slice(0,5000);
 const budget=String(data.budget||'—').slice(0,100),deadline=String(data.deadline||'—').slice(0,200);
 if(!/^\S+@\S+\.\S+$/.test(from)||!message)return json({error:'Email and message are required'},400);
 if(data.website)return json({ok:true}); // honeypot: bots fill hidden fields

 const res=await fetch('https://api.resend.com/emails',{
  method:'POST',
  headers:{authorization:`Bearer ${env.RESEND_API_KEY}`,'content-type':'application/json'},
  body:JSON.stringify({
   // the sender *name* is the visitor's email; the sending address must be one Resend can sign for (see CONTACT_FROM)
   from:`${from.replace(/[<>"\s]/g,'')} <${env.CONTACT_FROM||'onboarding@resend.dev'}>`,
   to:[env.CONTACT_TO],
   reply_to:from,
   subject:`New project enquiry from ${from}`,
   text:`${message}\n\nBudget: ${budget}\nDeadline: ${deadline}\nReply to: ${from}`,
   html:`<p style="white-space:pre-wrap">${esc(message)}</p><hr><p>Budget: ${esc(budget)}<br>Deadline: ${esc(deadline)}<br>Reply to: ${esc(from)}</p>`
  })
 });
 return res.ok?json({ok:true}):json({error:'Could not send'},502);
}

export default {
 fetch(request,env){
  const {pathname}=new URL(request.url);
  if(pathname==='/api/contact'&&request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
  if(pathname==='/api/contact')return request.method==='POST'?contact(request,env):json({error:'Method not allowed'},405);
  return env.ASSETS.fetch(request);
 }
};
