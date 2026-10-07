"use client";
import {useEffect,useState,type ReactNode} from 'react';
import {asset} from '../lib/asset';

const clock=()=>new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',hour12:false});

/*
 The torn-out photo of a phone with a live screen laid over it. About shows a note on it,
 Contact a mail draft. `screen` is the app UI; it fills the area between status bar and phone chin.
*/
export default function Phone({label,children}:{label:string,children:ReactNode}){
 const [time,setTime]=useState(clock);
 useEffect(()=>{const t=setInterval(()=>setTime(clock()),15000);return ()=>clearInterval(t)},[]);
 return <div className="phone">
  <img className="phone-shell" src={asset("/assets/contact-phone-ref.png")} alt="" draggable={false}/>
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
 </div>;
}

