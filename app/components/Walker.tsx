"use client";
import {useEffect,useRef} from 'react';
import {rng,sketchCircle} from '../lib/sketch';

const SPEED=69; // px per second: fixed pace, so the stride reads the same on any screen width
const RETURN_SPEED=60; // walking back to the corner once the visitor starts scrolling
const STRIDE_S=.76; // one 8-frame walk cycle at SPEED; other speeds scale it so legs match ground speed

/*
 Pen-drawn stick figure walk cycle. Each frame is a pose (leg/arm swing in degrees) plus a little
 seeded jitter, so the lines "boil" like a flipbook. 8 frames = two steps (front leg swaps), ~10fps,
 one cycle (STRIDE_S) covers about one stride at SPEED.
*/
const poses:[number,number][]=[[24,-.8],[12,-.4],[0,0],[-12,.4],[-24,.8],[-12,.4],[0,0],[12,-.4]];
function drawPose(swing:number,arm:number,f:number){
 const r=rng(40+f),j=(v:number)=>+(v+(r()-.5)*1.1).toFixed(1);
 const limb=(x:number,y:number,a:number,len:number,bend:number,len2:number)=>{
  const rad=(d:number)=>d*Math.PI/180,kx=x+Math.sin(rad(a))*len,ky=y+Math.cos(rad(a))*len;
  return `M${j(x)} ${j(y)}L${j(kx)} ${j(ky)}L${j(kx+Math.sin(rad(a-bend))*len2)} ${j(ky+Math.cos(rad(a-bend))*len2)}`;
 };
 const hip:[number,number]=[30,56],sh:[number,number]=[30,29];
 return [
  sketchCircle(30,15,6.5,60+f,.06),                                   // head
  `M${j(30)} ${j(22)}Q${j(31.5)} ${j(40)} ${j(hip[0])} ${j(hip[1])}`, // spine
  limb(...hip,swing,21,swing>0?-6:-24,22),                             // leg (front)
  limb(...hip,-swing,21,-swing>0?-6:-24,22),                           // leg (back)
  limb(...sh,-swing*.9+arm*8,13,-18,12),                               // arm
  limb(...sh,swing*.9-arm*8,13,-18,12)                                 // arm
 ].join('');
}
const frames=poses.map(([swing,arm],f)=>drawPose(swing,arm,f));
const standing=drawPose(7,-.2,9); // feet a little apart, at rest

/* say: bubble text ('' = none). rest: stop pacing, walk back to the starting corner and stand there. */
export default function Walker({say,rest=false}:{say:string,rest?:boolean}){
 const el=useRef<HTMLDivElement>(null);
 // walk from the corner to the far wall and back; the wall is measured, the duration derived from SPEED
 useEffect(()=>{
  const w=el.current!;
  const fit=()=>{
   const wall=Math.max(0,innerWidth-w.offsetLeft-w.offsetWidth-12); // offset* ignore the walking transform
   w.style.setProperty('--walk-x',`${Math.round(wall)}px`);
   w.style.setProperty('--walk-t',`${(wall/SPEED).toFixed(2)}s`);
  };
  // measure at the corner (animation paused), then start walking
  fit();w.classList.add('is-walking');
  let t:ReturnType<typeof setTimeout>;
  const onResize=()=>{clearTimeout(t);t=setTimeout(fit,150)};
  addEventListener('resize',onResize);
  return ()=>{removeEventListener('resize',onResize);clearTimeout(t)};
 },[]);

 // heading home: freeze where he is, turn round, walk back to x=0, then stand still facing forward
 useEffect(()=>{
  const w=el.current!;
  if(!rest||!w.classList.contains('is-walking'))return;
  const x=new DOMMatrix(getComputedStyle(w).transform).m41;
  const stand=()=>{w.classList.remove('is-returning');w.classList.add('is-standing');w.style.transition=''};
  w.classList.remove('is-walking');
  if(x<2||matchMedia('(prefers-reduced-motion: reduce)').matches){w.style.transform='';stand();return}
  w.style.transform=`translateX(${x}px)`;
  w.classList.add('is-returning');
  w.getBoundingClientRect(); // commit the start position before transitioning
  const secs=x/RETURN_SPEED;
  w.style.setProperty('--step',`${(STRIDE_S*SPEED/RETURN_SPEED).toFixed(3)}s`); // legs slow down/speed up with the walk
  w.style.transition=`transform ${secs}s linear`;
  w.style.transform='translateX(0px)';
  const t=setTimeout(stand,secs*1000);
  return ()=>clearTimeout(t);
 },[rest]);
 return <div ref={el} className="walker" aria-hidden="true">
  {say&&<div className="walker-bubble" key={say}>
   <svg viewBox="0 0 92 46"><circle cx="6" cy="40" r="2.2"/><circle cx="14" cy="32" r="3.4"/><path d={sketchCircle(56,20,17,say.length*7+3,.05)} transform="translate(-60 0) scale(2.07 1)" vectorEffect="non-scaling-stroke"/></svg>
   <span>{say}</span>
  </div>}
  <div className="walker-face">
   <svg viewBox="0 0 60 104">
    {frames.map((d,i)=><path key={i} d={d} style={{'--i':i} as React.CSSProperties}/>)}
    <path className="walker-stand" d={standing}/>
   </svg>
  </div>
 </div>;
}
