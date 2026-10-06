import Lenis,{type LenisOptions} from 'lenis';
import gsap from 'gsap';

/*
 Lenis driven by GSAP's ticker, so smooth scrolling and every GSAP animation share one
 requestAnimationFrame loop (no double rAF, no drift between scroll and tweens).
*/
let tickerReady=false;
export function createLenis(options:LenisOptions={}){
 if(!tickerReady){gsap.ticker.lagSmoothing(0);tickerReady=true} // a hitch must not make scroll jump
 const lenis=new Lenis({autoRaf:false,...options});
 const raf=(time:number)=>lenis.raf(time*1000);
 gsap.ticker.add(raf);
 return {lenis,destroy:()=>{gsap.ticker.remove(raf);lenis.destroy()}};
}
