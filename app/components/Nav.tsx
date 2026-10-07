"use client";
import {useEffect,useRef,useState} from 'react';
import gsap from 'gsap';
import {MorphSVGPlugin} from 'gsap/MorphSVGPlugin';
import {useGSAP} from '@gsap/react';
import {owner} from '../data/content';
import {Asterisk,BACK_ARROW,BackArrow,Eyes,Hammer,Heart,InkFilter} from './NavIcons';

export type View='home'|'work'|'process'|'about'|'contact';

/*
 Pill nav with a little life in each icon (desktop pointer only):
   Work     the hammer keeps winding up and striking; every hit jolts the pill and knocks the letters askew
   Process  the asterisk is flung into a spin that slows down, then settles on a resting angle
   About    the pupils follow the pointer anywhere on the page
   Contact  the heart beats (lub-dub) while hovered
   Back     pops in on inner pages; its loopy arrow springs out straight on hover and coils back on leave
 Small screens get a Menu toggle that slides the pills in as a drawer.
*/
export default function Nav({view,go}:{view:View,go:(v:View)=>void}){
 const root=useRef<HTMLElement>(null);
 const [open,setOpen]=useState(false);
 const pick=(v:View)=>{setOpen(false);go(v)};

 useEffect(()=>{
  if(!open)return;
  const esc=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.stopPropagation();setOpen(false)}};
  addEventListener('keydown',esc,true);return ()=>removeEventListener('keydown',esc,true);
 },[open]);

 useGSAP((_,contextSafe)=>{
  const el=root.current!,$=(s:string)=>el.querySelector<HTMLElement>(s)!;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const offs:(()=>void)[]=[];
  // hover = a real mouse entering (taps on touch screens must not start loops that never get a "leave")
  const hover=(t:HTMLElement,enter:()=>void,leave:()=>void)=>{
   const on=contextSafe!((e:PointerEvent)=>{if(e.pointerType==='mouse')enter()}),off=contextSafe!((e:PointerEvent)=>{if(e.pointerType==='mouse')leave()});
   t.addEventListener('pointerenter',on);t.addEventListener('pointerleave',off);
   offs.push(()=>{t.removeEventListener('pointerenter',on);t.removeEventListener('pointerleave',off)});
  };
  const R=gsap.utils.random;

  // --- Work: wind up → strike → settle, on repeat. Each strike knocks the letters a bit further out of line
  const work=$('[data-pill=work]'),hammer=$('[data-pill=work] .hammer'),letters=[...el.querySelectorAll<HTMLElement>('.work-letter')];
  let swing:gsap.core.Timeline|null=null,hits=0;
  const knock=()=>{
   hits++;
   gsap.fromTo(work,{x:1.6,y:.6},{x:0,y:0,duration:.2,ease:'power2.out'});
   letters.forEach(l=>gsap.timeline()
    .to(l,{x:R(2,7),y:R(0,3),rotation:R(3,14),duration:.06,ease:'power2.out',overwrite:true})
    .to(l,{x:R(-1,3),y:R(2,4.5)+Math.min(hits,5)*.5,rotation:R(-10,9),opacity:Math.max(.88,1-hits*.025),duration:.3,ease:'power3.out'}));
  };
  hover(work,()=>{
   hits=0;swing?.kill();
   swing=gsap.timeline({repeat:-1})
    .to(hammer,{rotation:-25,duration:.3,ease:'power2.out'})
    .to(hammer,{rotation:62,duration:.07,ease:'power3.in',onComplete:knock})
    .to(hammer,{rotation:0,duration:.22,ease:'back.out(3)'});
  },()=>{
   swing?.kill();swing=null;
   gsap.to(hammer,{rotation:0,duration:.25,ease:'power2.out'});
   gsap.to(letters,{x:0,y:0,rotation:0,opacity:1,duration:.22,ease:'power2.out',overwrite:true});
  });

  // --- Process: fling it into a spin; on leave, coast to the next resting angle (it repeats every 60°)
  const star=$('[data-pill=process] .asterisk');
  hover(star.closest('button')!,()=>gsap.to(star,{rotation:'+=620',duration:1.9,ease:'power3.out',overwrite:true}),()=>{
   const r=gsap.getProperty(star,'rotation') as number;
   gsap.to(star,{rotation:Math.ceil((r+25)/60)*60,duration:.75,ease:'power2.out',overwrite:true});
  });

  // --- About: pupils look at the pointer, wherever it is
  const eyes=$('[data-pill=about] .eyes'),pupils=$('[data-pill=about] .pupils');
  const px=gsap.quickTo(pupils,'x',{duration:.35,ease:'power3.out'}),py=gsap.quickTo(pupils,'y',{duration:.35,ease:'power3.out'});
  const look=contextSafe!((e:PointerEvent)=>{
   const r=eyes.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);
   const d=Math.hypot(dx,dy)||1,k=Math.min(1,d/160); // gaze shifts less for points right next to the eyes
   px(dx/d*k*2.6);py(dy/d*k*3);
  });
  addEventListener('pointermove',look);offs.push(()=>removeEventListener('pointermove',look));

  // --- Contact: heartbeat while hovered
  const heart=$('[data-pill=contact] .heart');
  let beat:gsap.core.Timeline|null=null;
  hover(heart.closest('button')!,()=>{
   beat?.kill();
   beat=gsap.timeline({repeat:-1,repeatDelay:.38})
    .to(heart,{scale:1.17,duration:.1,ease:'power2.out'})
    .to(heart,{scale:1,duration:.12,ease:'power2.in'})
    .to(heart,{scale:1.1,duration:.09,ease:'power2.out'})
    .to(heart,{scale:1,duration:.2,ease:'power2.inOut'});
  },()=>{beat?.kill();beat=null;gsap.to(heart,{scale:1,duration:.2})});

  return ()=>offs.forEach(f=>f());
 },{scope:root});

 const pill=(v:View,label:React.ReactNode,icon:React.ReactNode,cls='')=>
  <button type="button" className={`navpill${view===v?' on':''}${cls}`} data-pill={v} aria-current={view===v?'page':undefined} onClick={()=>pick(v)}>
   <span className="pill-icon">{icon}</span>{label}
  </button>;

 return <header ref={root} className={`header${open?' menu-open':''}`}>
  <InkFilter/>
  <button className="signature" onClick={()=>pick('home')}>{owner.name.toLowerCase()}</button>
  <button type="button" className="nav-toggle" aria-expanded={open} aria-controls="nav-pills" onClick={()=>setOpen(o=>!o)}>
   <Asterisk className="asterisk toggle-star"/>
   <span className="toggle-words" aria-hidden="true"><span>Menu</span><span>Close</span></span>
   <span className="sr-only">{open?'Close menu':'Open menu'}</span>
  </button>
  <div className="nav-scrim" onClick={()=>setOpen(false)} aria-hidden="true"/>
  <nav id="nav-pills" className="nav-pills" aria-label="Main">
   {view!=='home'&&<BackPill onClick={()=>pick('home')}/>}
   {pill('work',<span className="work-word" aria-label="Work">{'Work'.split('').map((l,i)=><span className="work-letter" aria-hidden="true" key={i}>{l}</span>)}</span>,<Hammer/>)}
   {pill('process','Process',<Asterisk/>)}
   {pill('about','About',<Eyes/>)}
   {pill('contact','Contact',<Heart/>)}
  </nav>
 </header>;
}

// Back: the curl uncoils into a long straight line on hover (morph + rotate, power3.inOut) and coils up again on leave.
// On click the arrow squashes against its head and springs back while the pill fades out.
gsap.registerPlugin(MorphSVGPlugin);
function BackPill({onClick}:{onClick:()=>void}){
 const btn=useRef<HTMLButtonElement>(null);
 const tl=useRef<gsap.core.Timeline>();
 useGSAP(()=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const el=btn.current!,svg=el.querySelector('.back-arrow'),path=el.querySelector('.shaft');
  tl.current=gsap.timeline({paused:true})
   .to(path,{duration:.55,ease:'power3.inOut',morphSVG:{shape:BACK_ARROW.straight}},0)
   .to(svg,{duration:.55,ease:'power3.inOut',rotation:0},0);
 },{scope:btn});
 const hover=(e:React.PointerEvent)=>{if(e.pointerType==='mouse')tl.current?.play()};
 const leave=(e:React.PointerEvent)=>{if(e.pointerType==='mouse')tl.current?.reverse()};
 const click=()=>{
  const arrow=btn.current!.querySelector('.pill-icon');
  if(arrow&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   gsap.set(arrow,{transformOrigin:'100% 50%'});
   gsap.timeline({onComplete:()=>{gsap.set(arrow,{clearProps:'transform,transformOrigin'})}})
    .to(arrow,{scaleX:.78,duration:.1,ease:'power2.out'})
    .to(arrow,{scaleX:1,duration:.26,ease:'back.out(2)'});
  }
  onClick();
 };
 return <button ref={btn} type="button" className="navpill back" onClick={click} onPointerEnter={hover} onPointerLeave={leave}>
  <span className="pill-icon"><BackArrow/></span>Back
 </button>;
}
