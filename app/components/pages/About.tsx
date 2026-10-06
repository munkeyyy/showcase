"use client";
import {useEffect,useRef} from 'react';
import {createLenis} from '../../lib/lenis';
import {aboutNote} from '../../data/content';

const today=()=>new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});

/* About screen: a note open on the phone (see PhonePage). The note scrolls inside the screen (wheel, trackpad or touch). */
export default function AboutScreen({onBack}:{onBack:()=>void}){
 // smooth, eased scrolling for the note (Lenis on the screen element, not the page)
 const body=useRef<HTMLDivElement>(null),content=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const {destroy}=createLenis({wrapper:body.current!,content:content.current!,lerp:.09,syncTouch:true,touchMultiplier:1.4});
  return destroy;
 },[]);
 return <>
   <div className="notes-bar">
    <button className="ios-round" onClick={onBack} aria-label="Back">‹</button>
    <span className="notes-actions" aria-hidden="true">
     <svg viewBox="0 0 20 20"><path d="M7 5 3 9l4 4M3.5 9H12a5 5 0 0 1 0 10h-2"/></svg>
     <svg viewBox="0 0 20 20"><path d="M10 2v11M6 6l4-4 4 4M4 10v8h12v-8"/></svg>
     <svg viewBox="0 0 20 20"><circle cx="4" cy="10" r="1.3"/><circle cx="10" cy="10" r="1.3"/><circle cx="16" cy="10" r="1.3"/></svg>
    </span>
   </div>
   <div className="notes-body" tabIndex={0} ref={body}><div ref={content}>
    <p className="notes-date">{today()}</p>
    {aboutNote.map((b,i)=>{
     switch(b.kind){
      case 'field':return <p key={i} className="notes-field"><b>{b.label}:</b> {b.text}</p>;
      case 'text':return <p key={i}>{b.text}</p>;
      case 'tags':return <p key={i} className="notes-tags">{b.items.map(t=><span key={t}>{t}</span>)}</p>;
      case 'photo':return b.src
       ?<img key={i} className="notes-photo" src={b.src} alt={b.alt}/>
       :<div key={i} className="notes-photo notes-photo--empty" role="img" aria-label={b.alt}><span>RK</span></div>;
     }
    })}
   </div></div>
   <div className="notes-tools" aria-hidden="true">
    <svg viewBox="0 0 20 20"><path d="M7 5h10M7 10h10M7 15h10"/><circle cx="3.5" cy="5" r="1"/><circle cx="3.5" cy="10" r="1"/><circle cx="3.5" cy="15" r="1"/></svg>
    <svg viewBox="0 0 20 20"><path d="M13.5 6.5 7.6 12.4a1.8 1.8 0 0 0 2.6 2.6l6.4-6.4a3.4 3.4 0 0 0-4.8-4.8L5.2 10.4a5 5 0 0 0 7.1 7.1l4.6-4.6"/></svg>
    <svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7.5"/><path d="M5 15 15 5"/></svg>
    <span/>
    <svg viewBox="0 0 20 20"><path d="M3 17l1-4L14 3l3 3L7 16l-4 1Z"/></svg>
   </div>
 </>;
}
