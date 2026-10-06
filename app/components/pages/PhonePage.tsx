"use client";
import {useRef,type MutableRefObject} from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import Phone from '../Phone';
import AboutScreen from './About';
import ContactScreen from './Contact';
import {owner} from '../../data/content';

export type PhoneView='about'|'contact';
// the desk photo of the phone shows it lying upside down, i.e. the big (upright) phone turned ~185°
const DESK_TURN=185;

/*
 Where the desk phone (.obj-phoneObj) is right now, expressed as a transform of the big phone:
 offset between centres, size ratio, and angle. Reads the live matrix, so it also works mid-way
 through the desk's own animations (home arrangements, edge layouts, the .86 mobile scale).
*/
function deskPose(phone:HTMLElement){
 const desk=document.querySelector<HTMLElement>('.obj-phoneObj');
 if(!desk||!desk.offsetParent)return null; // hidden at this breakpoint
 const t=getComputedStyle(desk).transform,m=t==='none'?new DOMMatrix():new DOMMatrix(t);
 const d=desk.getBoundingClientRect(),p=phone.getBoundingClientRect(),k=Math.hypot(m.a,m.b);
 return {
  x:d.left+d.width/2-(p.left+p.width/2),
  y:d.top+d.height/2-(p.top+p.height/2),
  // crop and big phone have slightly different proportions: meet halfway between width and height fit
  scale:k*(desk.offsetWidth/phone.offsetWidth+desk.offsetHeight/phone.offsetHeight)/2,
  rotation:DESK_TURN+Math.atan2(m.b,m.a)*180/Math.PI
 };
}

/*
 About + Contact share one phone: it is the desk phone, picked up and brought to the middle.
 Switching between the two only swaps the app on the screen. `exitRef` lets the page play the
 return flight before it unmounts us; it reports how long that takes (ms).
*/
export default function PhonePage({view,onBack,exitRef}:{view:PhoneView,onBack:()=>void,exitRef:MutableRefObject<(()=>number)|null>}){
 const root=useRef<HTMLDivElement>(null);
 useGSAP(()=>{
  const phone=root.current!.querySelector<HTMLElement>('.phone')!,glass=phone.querySelector('.phone-glass');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const from=reduce?null:deskPose(phone);
  if(from){
   // unwind from the desk angle while growing into place, then the screen wakes up
   gsap.timeline()
    .fromTo(phone,from,{x:0,y:0,scale:1,rotation:0,duration:.62,ease:'power3.out'})
    .to(glass,{opacity:0,duration:.35,ease:'power1.out'},'-=.12');
  }else{
   gsap.set(glass,{opacity:0});
   gsap.from(phone,{opacity:0,scale:.97,duration:.35,ease:'power1.out'});
  }
  exitRef.current=()=>{
   const to=reduce?null:deskPose(phone),tl=gsap.timeline();
   tl.to(glass,{opacity:1,duration:.14,ease:'none'});
   if(to)tl.to(phone,{...to,duration:.46,ease:'power2.in'});
   else tl.to(phone,{opacity:0,duration:.25});
   return Math.round(tl.duration()*1000);
  };
  return ()=>{exitRef.current=null};
 },{scope:root});

 return <div ref={root} className="phone-stage">
  <div className="phone-page">
   <Phone label={view==='about'?'About Rohit':'Write to Rohit'}>
    <div className="phone-app" key={view}>
     {view==='about'?<AboutScreen onBack={onBack}/>:<ContactScreen onBack={onBack}/>}
    </div>
   </Phone>
  </div>
  {view==='contact'&&<nav className="contact-foot fade-in" aria-label="Elsewhere">{owner.socials.map(s=><a key={s.label} href={s.href} target="_blank" rel="noreferrer">{s.label}</a>)}</nav>}
 </div>;
}
