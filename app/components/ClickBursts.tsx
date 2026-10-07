"use client";
import {useEffect,useRef} from 'react';
import gsap from 'gsap';

const NS='http://www.w3.org/2000/svg';
const R=gsap.utils.random;

// a fresh little "pop" of pen dashes radiating from the centre: uneven count, angles and lengths every time
function burstPath(){
 const n=Math.round(R(7,9)),start=R(0,Math.PI*2),c=20;
 let d='';
 for(let i=0;i<n;i++){
  const a=start+i/n*Math.PI*2+R(-.22,.22),r0=R(6,8.5),r1=r0+R(4.5,9),bend=R(-.1,.1);
  d+=`M${(c+Math.cos(a)*r0).toFixed(1)} ${(c+Math.sin(a)*r0).toFixed(1)}L${(c+Math.cos(a+bend)*r1).toFixed(1)} ${(c+Math.sin(a+bend)*r1).toFixed(1)}`;
 }
 return d;
}

/*
 Click feedback: every press leaves a tiny ink burst under the pointer. It pops out with a slight
 overshoot, holds for a beat and is gone in ~0.3s.
*/
export default function ClickBursts(){
 const layer=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const onDown=(e:PointerEvent)=>{
   if(e.button!==0||!layer.current)return;
   const svg=document.createElementNS(NS,'svg'),path=document.createElementNS(NS,'path');
   svg.setAttribute('viewBox','0 0 40 40');
   path.setAttribute('d',burstPath());
   svg.appendChild(path);
   const box=layer.current.getBoundingClientRect();
   svg.style.left=`${e.clientX-box.left}px`;
   svg.style.top=`${e.clientY-box.top}px`;
   layer.current.appendChild(svg);
   const peak=R(.85,1.15);
   const tl=gsap.timeline({onComplete:()=>svg.remove()}).set(svg,{xPercent:-50,yPercent:-50,rotation:R(-25,25)});
   if(reduce)tl.set(svg,{scale:peak}).to(svg,{opacity:0,duration:.28,ease:'power1.in'});
   else tl.fromTo(svg,{scale:0},{scale:peak*1.12,duration:.1,ease:'power2.out'})
     .to(svg,{scale:peak,duration:.1,ease:'power1.inOut'})
     .to(svg,{opacity:0,duration:.08,ease:'power1.in'});
  };
  addEventListener('pointerdown',onDown);
  return ()=>removeEventListener('pointerdown',onDown);
 },[]);
 return <div ref={layer} className="burst-layer" aria-hidden="true"/>;
}
