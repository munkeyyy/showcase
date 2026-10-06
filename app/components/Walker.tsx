"use client";
import {useEffect,useRef} from 'react';
import gsap from 'gsap';
import {rng,sketchCircle} from '../lib/sketch';

const SPEED=69; // px/s while pacing on its own: fixed, so the stride reads the same on any screen width
const RETURN_SPEED=60; // walking back to the corner once the visitor starts scrolling
const STRIDE_S=.76; // one 8-frame walk cycle at SPEED; other speeds scale it so legs match ground speed
// keyboard control (A/D or ←/→ to walk, W or Space to jump)
const KEY_SPEED=320,JUMP_V=860,GRAVITY=3200; // px/s, px/s, px/s² → about a 115px hop, ~0.55s in the air

/*
 Pen-drawn stick figure with real joints: hip → knee → ankle → toe, shoulder → elbow → hand.
 A pose gives each leg [thigh angle, knee bend] and each arm [upper-arm angle, elbow bend], in degrees
 from straight down, positive = forwards (the figure faces right). Every frame gets its own seeded
 jitter so the lines "boil" like a flipbook.
*/
type Limb=[number,number];
type Pose={legs:[Limb,Limb],arms:[Limb,Limb],bob?:number};
const HIP=[30,55],SHOULDER=[30,27.5],THIGH=21,SHIN=21,FOOT=5.5,UPPER=12,FORE=11.5;

function draw({legs,arms,bob=0}:Pose,seed:number){
 const r=rng(seed),j=(v:number)=>(v+(r()-.5)*1.1).toFixed(1),rad=(d:number)=>d*Math.PI/180;
 const dir=(a:number,len:number)=>[Math.sin(rad(a))*len,Math.cos(rad(a))*len];
 const hipY=HIP[1]+bob,shY=SHOULDER[1]+bob*.6;
 const leg=([thigh,knee]:Limb)=>{
  const [kx,ky]=dir(thigh,THIGH),shin=thigh-knee,[ax,ay]=dir(shin,SHIN);
  const K=[HIP[0]+kx,hipY+ky],A=[K[0]+ax,K[1]+ay];
  const T=[A[0]+Math.cos(rad(shin))*FOOT,A[1]-Math.sin(rad(shin))*FOOT]; // foot points forwards off the shin
  return `M${j(HIP[0])} ${j(hipY)}L${j(K[0])} ${j(K[1])}L${j(A[0])} ${j(A[1])}L${j(T[0])} ${j(T[1])}`;
 };
 const arm=([upper,elbow]:Limb)=>{
  const [ex,ey]=dir(upper,UPPER),E=[SHOULDER[0]+ex,shY+ey],[hx,hy]=dir(upper+elbow,FORE);
  return `M${j(SHOULDER[0])} ${j(shY)}L${j(E[0])} ${j(E[1])}L${j(E[0]+hx)} ${j(E[1]+hy)}`;
 };
 return [
  sketchCircle(30,11.5+bob*.6,6.2,seed+90,.06),                              // head
  `M${j(30)} ${j(18+bob*.6)}Q${j(31.2)} ${j(36+bob)} ${j(HIP[0])} ${j(hipY)}`, // spine
  leg(legs[0]),leg(legs[1]),arm(arms[0]),arm(arms[1])
 ].join('');
}

// one leg through a full stride: contact, load, mid-stance, push, toe-off, kick up behind, swing through, reach
const stride:Limb[]=[[26,6],[16,22],[4,14],[-10,6],[-24,14],[-14,55],[8,72],[22,30]];
const bob=[0,1.3,.4,-1,0,1.3,.4,-1];
const frames=stride.map((a,i)=>{
 const b=stride[(i+4)%8]; // other leg is half a cycle apart
 const swing=(l:Limb):Limb=>[-l[0]*.85,l[0]<0?10:28]; // arms swing against their leg, elbow bent more going forward
 return draw({legs:[a,b],arms:[swing(a),swing(b)],bob:bob[i]},40+i);
});
const standing=draw({legs:[[6,5],[-5,4]],arms:[[7,14],[-6,10]]},11);
const jumping=draw({legs:[[34,78],[-8,62]],arms:[[148,-30],[122,-24]],bob:-2},12);

const typing=(t:EventTarget|null)=>t instanceof HTMLElement&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

/*
 say:    bubble text ('' = none)
 rest:   stop pacing, walk back to the starting corner and stand there (first scroll on home)
 arrows: ←/→ also walk (off on pages that use those keys themselves)
*/
export default function Walker({say,rest=false,arrows=true}:{say:string,rest?:boolean,arrows?:boolean}){
 const el=useRef<HTMLDivElement>(null);
 const controlled=useRef(false),returning=useRef<ReturnType<typeof setTimeout>>();
 const arrowsRef=useRef(arrows);arrowsRef.current=arrows;

 // pace from the corner to the far wall and back; the wall is measured, the duration derived from SPEED
 useEffect(()=>{
  const w=el.current!;
  const fit=()=>{
   const wall=Math.max(0,innerWidth-w.offsetLeft-w.offsetWidth-12); // offset* ignore the walking transform
   w.style.setProperty('--walk-x',`${Math.round(wall)}px`);
   w.style.setProperty('--walk-t',`${(wall/SPEED).toFixed(2)}s`);
  };
  fit();w.classList.add('is-walking');
  let t:ReturnType<typeof setTimeout>;
  const onResize=()=>{clearTimeout(t);t=setTimeout(fit,150)};
  addEventListener('resize',onResize);
  return ()=>{removeEventListener('resize',onResize);clearTimeout(t)};
 },[]);

 // heading home: freeze where he is, turn round, walk back to x=0, then stand still facing forward
 useEffect(()=>{
  const w=el.current!;
  if(!rest||controlled.current||!w.classList.contains('is-walking'))return;
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
  returning.current=setTimeout(stand,secs*1000);
  return ()=>clearTimeout(returning.current);
 },[rest]);

 // keyboard control: the first walk/jump key takes over from whatever he was doing
 useEffect(()=>{
  const w=el.current!;
  const s={x:0,y:0,vy:0,left:false,right:false,face:1};
  const wall=()=>Math.max(0,innerWidth-w.offsetLeft-w.offsetWidth-12);
  const tick=(_t:number,dtMs:number)=>{
   const dt=Math.min(dtMs,50)/1000,dir=(s.right?1:0)-(s.left?1:0);
   if(dir)s.face=dir;
   s.x=Math.min(wall(),Math.max(0,s.x+dir*KEY_SPEED*dt));
   if(s.y>0||s.vy>0){s.vy-=GRAVITY*dt;s.y+=s.vy*dt;if(s.y<=0){s.y=0;s.vy=0}}
   w.style.transform=`translate(${s.x.toFixed(1)}px,${(-s.y).toFixed(1)}px)`;
   w.classList.toggle('is-moving',dir!==0&&s.y===0);
   w.classList.toggle('is-air',s.y>0);
   w.classList.toggle('sf-left',s.face<0);
  };
  const takeOver=()=>{
   if(controlled.current)return;
   controlled.current=true;
   s.x=new DOMMatrix(getComputedStyle(w).transform).m41; // continue from wherever he is right now
   const facing=new DOMMatrix(getComputedStyle(w.querySelector('.walker-face')!).transform).a;
   s.face=facing<0?-1:1;
   clearTimeout(returning.current);
   w.classList.remove('is-walking','is-returning','is-standing');
   w.style.transition='';
   w.classList.add('is-control');
   gsap.ticker.add(tick);
  };
  const key=(e:KeyboardEvent,down:boolean)=>{
   if(e.ctrlKey||e.metaKey||e.altKey||typing(e.target))return;
   const k=e.key.length===1?e.key.toLowerCase():e.key;
   const left=k==='a'||(arrowsRef.current&&k==='ArrowLeft'),right=k==='d'||(arrowsRef.current&&k==='ArrowRight');
   const jump=k==='w'||(k===' '&&!(e.target instanceof HTMLButtonElement||e.target instanceof HTMLAnchorElement));
   if(!left&&!right&&!jump)return;
   if(down)takeOver();
   if(left)s.left=down;
   if(right)s.right=down;
   if(jump&&down&&s.y===0&&s.vy===0)s.vy=JUMP_V;
   if(jump||(arrowsRef.current&&(left||right)))e.preventDefault(); // no page scroll / button press
  };
  const onDown=(e:KeyboardEvent)=>key(e,true),onUp=(e:KeyboardEvent)=>key(e,false);
  const release=()=>{s.left=s.right=false}; // window lost focus mid-press
  addEventListener('keydown',onDown);addEventListener('keyup',onUp);addEventListener('blur',release);
  return ()=>{removeEventListener('keydown',onDown);removeEventListener('keyup',onUp);removeEventListener('blur',release);gsap.ticker.remove(tick)};
 },[]);

 return <div ref={el} className="walker" aria-hidden="true">
  {say&&<div className="walker-bubble" key={say}>
   <svg viewBox="0 0 92 46"><circle cx="6" cy="40" r="2.2"/><circle cx="14" cy="32" r="3.4"/><path d={sketchCircle(56,20,17,say.length*7+3,.05)} transform="translate(-60 0) scale(2.07 1)" vectorEffect="non-scaling-stroke"/></svg>
   <span>{say}</span>
  </div>}
  <div className="walker-face">
   <svg viewBox="0 0 60 104">
    {frames.map((d,i)=><path key={i} className="walker-frame" d={d} style={{'--i':i} as React.CSSProperties}/>)}
    <path className="walker-stand" d={standing}/>
    <path className="walker-jump" d={jumping}/>
   </svg>
  </div>
 </div>;
}
