"use client";
import {useEffect,useRef,useState} from 'react';
import DeskObject from './components/DeskObject';
import Preloader from './components/Preloader';
import Walker from './components/Walker';
import Nav,{type View} from './components/Nav';
import Work from './components/pages/Work';
import Process from './components/pages/Process';
import PhonePage,{type PhoneView} from './components/pages/PhonePage';
import {deskItems} from './data/desk';
import {owner} from './data/content';
import {LOOP_PX,useDeskArrangements} from './hooks/useDeskArrangements';

const words=['create','design','build'];
const isPhone=(v:View):v is PhoneView=>v==='about'||v==='contact';

export default function Page(){
 const [view,setView]=useState<View>('home');
 const [transitioning,setTransitioning]=useState(false);
 const [ready,setReady]=useState(false); // preloader finished
 const [scrolled,setScrolled]=useState(false); // first home scroll: the walker heads back to his corner
 const canvas=useRef<HTMLElement>(null);
 const phoneExit=useRef<(()=>number)|null>(null);
 useDeskArrangements(canvas,ready&&view==='home',()=>setScrolled(true));
 const go=(v:View)=>{
  if(v===view||transitioning)return;
  setTransitioning(true);
  // leaving the phone pages: the phone flies back onto the desk first (About↔Contact keeps it in place)
  const out=isPhone(view)&&!isPhone(v)?phoneExit.current?.()??310:310;
  setTimeout(()=>{setView(v);setTimeout(()=>setTransitioning(false),40)},out);
 };
 useEffect(()=>{const h=(e:KeyboardEvent)=>{if(e.key==='Escape')go('home')};addEventListener('keydown',h);return()=>removeEventListener('keydown',h)},[view,transitioning]);
 const home=()=>go('home');
 return <>
 {/* home only: the document scrolls over this (Lenis); the canvas stays fixed and reads the position */}
 {view==='home'&&<div className="home-spacer" style={{height:`calc(100vh + ${LOOP_PX}px)`}} aria-hidden="true"/>}
 <main ref={canvas} className={`canvas view-${view}${transitioning?' leaving':''}${ready?' is-ready':''}`}>
   <div className="paper-noise"/>
   <Nav view={view} go={go}/>
   <div className="objects" aria-hidden="true">{deskItems.map((item,i)=><DeskObject key={item.id} order={i} {...item}/>)}</div>
   <section className="stage">
     {view==='home'&&<Home/>}
     {view==='work'&&<Work/>}
     {view==='process'&&<Process/>}
     {isPhone(view)&&<PhonePage view={view} onBack={home} exitRef={phoneExit}/>}
   </section>
   <Preloader onDone={()=>setReady(true)}/>
   <Walker say={!ready?'loading':view==='home'&&!scrolled?'scroll':''} rest={scrolled}/>
 </main>
 </>
}

function Home(){return <div className="homecopy"><span>Hey my name is {owner.name} and I </span><em className="ink">{words.map((w,i)=><span key={w} aria-hidden={i>0||undefined}>{w}</span>)}</em><span> cool websites :)</span></div>}
