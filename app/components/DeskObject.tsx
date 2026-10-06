import type {CSSProperties} from 'react';
import type {DeskItem} from '../data/desk';

type Props=Pick<DeskItem,'id'|'src'|'z'|'pos'|'mobile'|'edge'>&{order?:number}; // order staggers the intro drop-in

/*
 One cut-out object on the desk. Position, size and the inner-page edge transform are passed in as
 CSS custom properties (see .obj in globals.css), so media queries and the .view-* rules still apply
 and GSAP is free to own `transform` on the home page.
*/
export default function DeskObject({id,src,z,pos,mobile,edge,order=0}:Props){
 const m=mobile==='hidden'?undefined:mobile;
 const vars={
  zIndex:z,
  '--l':pos.left,'--r':pos.right,'--t':pos.top,'--b':pos.bottom,'--w':pos.width,
  '--ml':m?.left,'--mr':m?.right,'--mt':m?.top,'--mb':m?.bottom,'--mw':m?.width,
  '--edge':edge,'--i':order
 } as CSSProperties;
 return <img className={`obj obj-${id}${mobile==='hidden'?' obj--mhide':''}`} data-scatter={id} src={src} style={vars} alt="" draggable={false}/>;
}
