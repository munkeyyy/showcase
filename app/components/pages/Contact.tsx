"use client";
import {useState,type FormEvent} from 'react';
import {budgets,owner} from '../../data/content';

const PROMPT="Let's work together! What kind of website are we making? :)";

/* Contact screen: a mail draft on the phone (see PhonePage). "Send" opens the visitor's mail app with everything filled in. */
export default function ContactScreen({onBack}:{onBack:()=>void}){
 const [from,setFrom]=useState(''),[budget,setBudget]=useState(''),[deadline,setDeadline]=useState(''),[msg,setMsg]=useState('');
 const [picking,setPicking]=useState(false);
 const ready=/^\S+@\S+\.\S+$/.test(from)&&msg.trim().length>0;
 const send=(e:FormEvent)=>{
  e.preventDefault();if(!ready)return;
  const body=[msg.trim(),'',`Budget: ${budget||'—'}`,`Deadline: ${deadline||'—'}`,`Reply to: ${from}`].join('\n');
  location.href=`mailto:${owner.email}?subject=${encodeURIComponent('New project')}&body=${encodeURIComponent(body)}`;
 };
 return <form className="mail" onSubmit={send}>
    <div className="mail-bar">
     <button type="button" onClick={onBack}>Cancel</button>
     <b>New Message</b>
     <button type="submit" disabled={!ready}>Send</button>
    </div>
    <label className="mail-row"><span>From:</span><input type="email" required autoComplete="email" placeholder="you@somewhere.com" value={from} onChange={e=>setFrom(e.target.value)}/></label>
    <div className="mail-row"><span>To:</span><a href={`mailto:${owner.email}`}>{owner.email}</a></div>
    <button type="button" className="mail-row mail-pick" onClick={()=>setPicking(true)} aria-haspopup="listbox">
     <span>Budget:</span><em className={budget?'':'ph'}>{budget||'Pick a range'}</em><i aria-hidden="true">›</i>
    </button>
    <label className="mail-row"><span>Deadline:</span><input placeholder="When by?" value={deadline} onChange={e=>setDeadline(e.target.value)}/></label>
    <textarea aria-label="Message" placeholder={PROMPT} value={msg} onChange={e=>setMsg(e.target.value)}/>
    {picking&&<div className="mail-sheet" onClick={()=>setPicking(false)}>
     <div role="listbox" aria-label="Budget" onClick={e=>e.stopPropagation()}>
      {budgets.map(b=><button type="button" role="option" aria-selected={b===budget} key={b} onClick={()=>{setBudget(b);setPicking(false)}}>{b}</button>)}
      <button type="button" className="cancel" onClick={()=>setPicking(false)}>Cancel</button>
     </div>
    </div>}
   </form>;
}
