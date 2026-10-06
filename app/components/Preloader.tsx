"use client";
import {useEffect,useState} from 'react';

const MIN_MS=1400; // long enough to read as a loader, not a flash

/*
 Blank paper over everything until the page, fonts and desk photos are ready. The walking figure
 (rendered by the page, above this sheet) does the "loading" part. Calls onDone once, then fades out.
*/
export default function Preloader({onDone}:{onDone:()=>void}){
 const [gone,setGone]=useState(false);
 useEffect(()=>{
  let live=true;
  const loaded=new Promise<void>(r=>document.readyState==='complete'?r():addEventListener('load',()=>r(),{once:true}));
  const imgs=[...document.querySelectorAll<HTMLImageElement>('.obj')].map(i=>i.decode().catch(()=>{}));
  Promise.all([loaded,document.fonts?.ready,...imgs,new Promise(r=>setTimeout(r,MIN_MS))]).then(()=>{
   if(!live)return;
   onDone();
   setTimeout(()=>live&&setGone(true),900); // after the fade
  });
  return ()=>{live=false};
 },[]);
 return gone?null:<div className="preloader" aria-hidden="true"/>;
}
