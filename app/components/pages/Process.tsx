"use client";
import {useEffect,useState} from 'react';
import {steps} from '../../data/content';
import {sketchCircle} from '../../lib/sketch';

/* Process list: the row under the pointer (or focused / arrowed to) is inked in, the rest stay faded. */
export default function Process(){
 const [active,setActive]=useState(0);
 useEffect(()=>{
  const keys=(e:KeyboardEvent)=>{
   if(e.key==='ArrowDown'){e.preventDefault();setActive(a=>Math.min(steps.length-1,a+1))}
   if(e.key==='ArrowUp'){e.preventDefault();setActive(a=>Math.max(0,a-1))}
  };
  addEventListener('keydown',keys);return ()=>removeEventListener('keydown',keys);
 },[]);
 return <div className="process scene-in">
  <h2>Process</h2>
  <ol>
   {steps.map(([title,body],i)=><li key={title} className={i===active?'on':''}
     onMouseEnter={()=>setActive(i)} onFocus={()=>setActive(i)} onClick={()=>setActive(i)} tabIndex={0} aria-current={i===active||undefined}>
    <span className="pnum">
     <svg viewBox="0 0 46 46" aria-hidden="true"><path pathLength={1} d={sketchCircle(23,23,19,i*13+5,.05)}/></svg>
     {i+1}
    </span>
    <h3>{title}</h3>
    <p>{body}</p>
   </li>)}
  </ol>
 </div>;
}
