"use client";
import type {RefObject} from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {deskItems,type Pose} from '../data/desk';
import {createLenis} from '../lib/lenis';

if(typeof window!=='undefined')gsap.registerPlugin(useGSAP);

const poseOf=Object.fromEntries(deskItems.map(o=>[o.id,o]));
// headline offset per arrangement, in vh (rest sits at 46% from CSS)
const headY=[0,-21,21.6];
// timeline units: each arrangement holds for HOLD, then a TRAVEL-long transition; 3 of these make one loop
const HOLD=.4,TRAVEL=.6;
// px of scroll for one full loop. Page renders a spacer this tall (+1 screen) while home is active
export const LOOP_PX=3500;

/*
 Home desk arrangements, cycled by scrolling (loops in both directions):
   rest ("create") → pile under the headline ("design") → workstation in the middle ("build") → rest.
 Lenis smooth-scrolls the document over a spacer (infinite mode, so it wraps), and the timeline
 reads Lenis' position. Touch gets real momentum via syncTouch.
*/
export function useDeskArrangements(root:RefObject<HTMLElement>,active:boolean,onFirstScroll?:()=>void){
 useGSAP(()=>{
  const el=root.current;if(!active||!el)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const vw=(n:number)=>n*innerWidth/100,vh=(n:number)=>n*innerHeight/100;
  const tl=gsap.timeline({paused:true,defaults:{immediateRender:false}});
  const seg=(i:number)=>HOLD/2+i*(HOLD+TRAVEL); // start of transition i (rest→B, B→C, C→rest)
  el.querySelectorAll<HTMLElement>('[data-scatter]').forEach((o,n)=>{
   const p=poseOf[o.dataset.scatter!];if(!p)return;
   // resting centre from layout (offset* ignore transforms), so poses are absolute screen spots
   const cx=()=>o.offsetLeft+o.offsetWidth/2,cy=()=>o.offsetTop+o.offsetHeight/2;
   const spin=(r:number)=>reduce?((r%360)+540)%360-180:r; // reduced motion: shortest turn, no extra spins
   const at=(P:Pose|null)=>P?{x:()=>vw(P[0])-cx(),y:()=>vh(P[1])-cy(),rotation:spin(P[2])}:{x:0,y:0,rotation:0};
   const poses=[at(null),at(p.B),at(p.C),at(null)];
   const lag=((n*37)%9)/100; // small, uneven offsets so pieces don't move in lockstep
   // every segment has explicit from-values → any jump/wrap/resize lands exactly on the pose, nothing accumulates
   for(let i=0;i<3;i++)tl.fromTo(o,poses[i],{...poses[i+1],duration:TRAVEL-.09,ease:i===1?'power3.inOut':'power2.inOut'},seg(i)+lag);
  });
  const stage=el.querySelector('.stage'),ink=el.querySelectorAll('.ink span');
  for(let i=0;i<3;i++){
   tl.fromTo(stage,{y:()=>vh(headY[i])},{y:()=>vh(headY[(i+1)%3]),duration:TRAVEL,ease:'power2.inOut'},seg(i));
   // word swaps around the middle of each transition
   tl.fromTo(ink[i],{opacity:1},{opacity:0,duration:.12,ease:'none'},seg(i)+TRAVEL/2-.12)
     .fromTo(ink[(i+1)%3],{opacity:0},{opacity:1,duration:.12,ease:'none'},seg(i)+TRAVEL/2);
  }
  tl.set({},{},3*(HOLD+TRAVEL)); // pad to a full loop so the end equals the start
  const D=tl.duration(),wrap=gsap.utils.wrap(0,D);

  // the canvas is fixed; the document scrolls over the spacer (see .home-scroll in globals.css)
  const html=document.documentElement;
  history.scrollRestoration='manual';
  html.classList.add('home-scroll');scrollTo(0,0);
  const {lenis,destroy}=createLenis({infinite:true,syncTouch:true,touchMultiplier:2.5,lerp:reduce?1:.075});
  const render=()=>tl.totalTime(wrap(lenis.scroll/(lenis.limit||LOOP_PX)*D));
  let started=false;
  lenis.on('scroll',()=>{
   if(!started&&lenis.velocity!==0){started=true;el.setAttribute('data-scrubbing','');onFirstScroll?.()} // also fades the walker's 'scroll' bubble (CSS)
   render();
  });
  // one arrangement per key press, eased by Lenis like a wheel scroll (Space is the walker's jump)
  const keys=(e:KeyboardEvent)=>{
   const d=['ArrowDown','PageDown'].includes(e.key)?1:['ArrowUp','PageUp'].includes(e.key)?-1:0;
   if(!d)return;
   e.preventDefault();
   lenis.scrollTo(lenis.targetScroll+d*LOOP_PX/3,{duration:1.1});
  };
  addEventListener('keydown',keys);
  // poses are in vw/vh from the resting layout: recompute on resize and re-render where we are
  const resize=()=>{tl.invalidate();render()};
  addEventListener('resize',resize);
  return ()=>{
   destroy();removeEventListener('keydown',keys);removeEventListener('resize',resize);
   html.classList.remove('home-scroll');scrollTo(0,0);
   tl.kill();el.removeAttribute('data-scrubbing');
   // hand the pieces back to CSS so the .view-* edge layouts (and their transitions) apply
   gsap.set(el.querySelectorAll('[data-scatter],.stage,.ink span'),{clearProps:'transform,opacity,translate,rotate,scale'});
  };
 },{dependencies:[active],scope:root,revertOnUpdate:true});
}
