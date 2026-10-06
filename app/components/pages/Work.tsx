"use client";
import {Fragment,useEffect,useMemo,useRef,useState} from 'react';
import gsap from 'gsap';
import {Observer} from 'gsap/Observer';
import {projects,type Project} from '../../data/content';
import {sketchCircle,sketchRoundRect} from '../../lib/sketch';

if(typeof window!=='undefined')gsap.registerPlugin(Observer);

// frame drawing units; the frame keeps this aspect ratio so the SVG scales uniformly with it
const W=1000,H=628,R=58;
// the meta line runs along the top edge, round the corner and down the right side
const META_PATH=`M4 -20H${W-R}A${R+20} ${R+20} 0 0 1 ${W+20} ${R}V${H-10}`;
const STEP_MS=950; // one wheel gesture = one project

export default function Work(){
 const [index,setIndex]=useState(0);
 const frame=useRef<HTMLDivElement>(null),track=useRef<HTMLDivElement>(null),first=useRef(true);
 const border=useMemo(()=>sketchRoundRect(W,H,R,{seed:11,amp:2.6}),[]);
 const p=projects[index];

 // wheel / swipe / arrow keys move one project per gesture, wrapping at both ends
 useEffect(()=>{
  let locked=false;
  const step=(d:number)=>{if(locked)return;locked=true;setIndex(i=>(i+d+projects.length)%projects.length);setTimeout(()=>locked=false,STEP_MS)};
  // wheelSpeed -1 makes "scroll down" and "swipe up" both fire onUp → next
  const obs=Observer.create({target:window,type:'wheel,touch',wheelSpeed:-1,tolerance:12,onUp:()=>step(1),onDown:()=>step(-1)});
  const keys=(e:KeyboardEvent)=>{
   if(['ArrowDown','ArrowRight','PageDown'].includes(e.key)){e.preventDefault();step(1)}
   if(['ArrowUp','ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();step(-1)}
  };
  addEventListener('keydown',keys);
  return ()=>{obs.kill();removeEventListener('keydown',keys)};
 },[]);

 // next project slides up inside the frame while the frame breathes out a touch
 useEffect(()=>{
  if(first.current){first.current=false;return}
  const t=gsap.timeline();
  t.to(track.current,{yPercent:-100*index,duration:.9,ease:'power3.inOut'},0)
   .to(frame.current,{scale:1.035,duration:.45,ease:'sine.inOut',yoyo:true,repeat:1},0);
  return ()=>{t.progress(1).kill()};
 },[index]);

 return <div className="work scene-in">
  <MetaLine p={p} key={'m'+index} className="work-meta-m"/>
  <div className="work-frame" ref={frame}>
   <div className={`work-window${p.url?' is-link':''}`} onClick={()=>p.url&&open(p.url,'_blank','noopener')}>
    <div className="work-track" ref={track}>
     {projects.map((q,i)=><div className="work-slide" key={q.title} aria-hidden={i!==index}>
      {q.video
       ?<video src={q.video} poster={q.img} muted loop autoPlay playsInline/>
       :<img src={q.img} alt={i===index?`${q.title} screenshot`:''}/>}
     </div>)}
    </div>
   </div>
   <svg className="work-ink" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
    <path className="work-line" d={border}/>
    <path id="work-meta-path" d={META_PATH} fill="none"/>
    <text className="work-meta" key={index}>
     <textPath href="#work-meta-path"><MetaSpans p={p}/></textPath>
    </text>
   </svg>
  </div>
  <div className="work-dots" role="tablist" aria-label="Projects">
   {projects.map((q,i)=><button key={q.title} role="tab" aria-selected={i===index} aria-label={q.title} onClick={()=>setIndex(i)}>
    <svg viewBox="0 0 20 20" aria-hidden="true">
     <path d={sketchCircle(10,10,7.2,i*7+2)}/>
     {i===index&&<path className="x" d="M4.5 5.5L15.2 14.6M15 5.2L5.4 15.3"/>}
    </svg>
   </button>)}
  </div>
  <p className="sr-only" aria-live="polite">{p.title}: {p.desc}</p>
 </div>;
}

// the same pieces of info, as SVG spans (desktop, on the path) …
function MetaSpans({p}:{p:Project}){
 const star=<tspan className="wm-star">  ✶  </tspan>;
 const bits=[
  <tspan className="wm-desc">{p.desc}</tspan>,
  p.live&&<>Live: <a href={p.url??`https://${p.live}`} target="_blank" rel="noreferrer"><tspan className="wm-strong">{p.live}</tspan></a></>,
  <>{p.tag}</>,
  <>Stack: {p.stack}</>,
  p.url&&<a href={p.url} target="_blank" rel="noreferrer" className="wm-open"><tspan>Click to open project</tspan></a>
 ].filter(Boolean);
 return <><tspan className="wm-title">{p.title}</tspan>{bits.map((b,i)=><Fragment key={i}>{star}{b}</Fragment>)}</>;
}
// … and as plain HTML for small screens, where text on a path would be too small to read
function MetaLine({p,className}:{p:Project,className:string}){
 return <div className={className}>
  <strong>{p.title}</strong><span>{p.desc}</span>
  <small>{[p.tag,`Stack: ${p.stack}`].join('  ✶  ')}{p.url&&<> ✶ <a href={p.url} target="_blank" rel="noreferrer">Open project</a></>}</small>
 </div>;
}
