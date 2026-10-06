"use client";
import {useEffect,useState,type ReactNode} from 'react';

const clock=()=>new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',hour12:false});

/*
 The torn-out photo of a cracked phone with a live screen laid over it. About shows a note on it,
 Contact a mail draft. `screen` is the app UI; it fills the area between status bar and phone chin.
*/
export default function Phone({label,children}:{label:string,children:ReactNode}){
 const [time,setTime]=useState(clock);
 useEffect(()=>{const t=setInterval(()=>setTime(clock()),15000);return ()=>clearInterval(t)},[]);
 return <div className="phone">
  <img className="phone-shell" src="/assets/contact-phone-ref.png" alt="" draggable={false}/>
  <div className="phone-screen" role="group" aria-label={label}>
   <div className="ios-status" aria-hidden="true">
    <b>{time}</b>
    <span className="ios-icons">
     <svg viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx=".6"/><rect x="4.5" y="5" width="3" height="6" rx=".6"/><rect x="9" y="2.5" width="3" height="8.5" rx=".6"/><rect x="13.5" y="0" width="3" height="11" rx=".6"/></svg>
     <svg viewBox="0 0 15 11"><path d="M7.5 2.2c2.3 0 4.4.9 5.9 2.4l1.1-1.1A9.9 9.9 0 0 0 7.5.6 9.9 9.9 0 0 0 .5 3.5l1.1 1.1a8.3 8.3 0 0 1 5.9-2.4Zm0 3.3c1.4 0 2.6.5 3.6 1.4l1.1-1.1a6.7 6.7 0 0 0-9.4 0l1.1 1.1c1-.9 2.2-1.4 3.6-1.4Zm0 3.3c-.5 0-1 .2-1.3.5l1.3 1.3 1.3-1.3c-.3-.3-.8-.5-1.3-.5Z"/></svg>
     <span className="ios-battery"><i/>15</span>
    </span>
   </div>
   {children}
  </div>
  {/* dark glass = screen off. Covers the app while the phone flies between the desk and the centre */}
  <div className="phone-glass" aria-hidden="true"/>
  <Cracks/>
 </div>;
}

// a few hairline cracks drawn over the screen so the glass still reads as broken
function Cracks(){
 return <svg className="phone-cracks" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
  <path d="M8 31 L22 38 L31 36 L44 47 L52 46 L63 58 L71 57 L86 71 L97 74"/>
  <path d="M31 36 L35 27 L41 22 L44 12"/>
  <path d="M44 47 L40 58 L43 66 L38 79 L41 92"/>
  <path d="M63 58 L66 49 L76 44 L90 41"/>
  <path d="M52 46 L58 37 L57 28"/>
  <path d="M71 57 L69 68 L75 80 L73 95"/>
 </svg>;
}
