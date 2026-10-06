/*
 Hand-drawn nav icons. All share #ink-rough (a light turbulence displacement, defined once in <InkFilter/>)
 so straight SVG strokes read as pen lines. Parts that animate get their own class.
*/
export function InkFilter(){
 return <svg width="0" height="0" style={{position:'absolute'}} aria-hidden="true">
  <filter id="ink-rough" x="-20%" y="-20%" width="140%" height="140%">
   <feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="4"/>
   <feDisplacementMap in="SourceGraphic" scale="1.3" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
 </svg>;
}

// pivots near the bottom of the handle (see .hammer in CSS) so it can wind up and strike
export function Hammer(){
 return <svg className="hammer" viewBox="0 0 24 28" aria-hidden="true">
  <path className="fill" d="M3.6 6.6 L18.8 3.4 L20.4 8.9 L5.3 11.6 Z"/>
  <path d="M12.6 10.6 L13.4 26.2" strokeWidth="3.1"/>
  <path d="M18.6 3.6 L21.6 2.6 L22.4 6.4 L20.2 8.6" strokeWidth="1.4"/>
 </svg>;
}

// six-armed asterisk: rotationally symmetric every 60°, so it can come to rest on any multiple of 60
export function Asterisk({className='asterisk'}:{className?:string}){
 return <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
  <path d="M12.3 2.4 C12 8 12.4 15.5 11.8 21.6"/>
  <path d="M3.6 7.3 C8.6 9.6 15.2 14.1 20.6 16.8"/>
  <path d="M20.2 6.8 C15.6 10 8.3 13.6 3.9 16.9"/>
 </svg>;
}

// outlines stay put; the pupils group follows the pointer
export function Eyes(){
 return <svg className="eyes" viewBox="0 0 30 22" aria-hidden="true">
  <path d="M8 2.2 C2.4 2.4 1.8 10 2.3 13.6 C3 19.6 12.4 20.6 13.3 13.4 C14 7.6 12.8 2.1 8 2.2 Z"/>
  <path d="M22.2 2.4 C16.6 2.3 16.2 9.8 16.6 13.5 C17.4 19.5 26.6 20.4 27.5 13.2 C28.2 7.4 27 2.4 22.2 2.4 Z"/>
  <g className="pupils"><circle className="fill" cx="8" cy="12" r="2.6"/><circle className="fill" cx="22" cy="12" r="2.6"/></g>
 </svg>;
}

export function Heart(){
 return <svg className="heart" viewBox="0 0 24 22" aria-hidden="true">
  <path d="M12 20.4 C7.4 16.6 2.4 12.8 2.6 7.6 C2.8 3.6 7.6 1.6 10.6 5 C11.4 5.9 11.9 7 12 8.2 C12.4 4.6 15.4 2.2 18.6 2.9 C22.8 3.8 22.6 9.6 19.9 12.9 C17.8 15.6 14.6 18 12 20.4 C11.6 20.8 11.2 20.6 11 20.2"/>
 </svg>;
}

// a loop-de-loop arrow pointing back
export function BackArrow(){
 return <svg className="back-arrow" viewBox="0 0 48 40" aria-hidden="true">
  <path d="M43 12 C52 24 39 37 30 30 C23 24.5 32 13.5 37 19.5 C42 26 29 32 19 27.6 C13.5 25.2 9.6 22.6 5.8 20.6"/>
  <path d="M12.6 14.4 L5.4 20.4 L13.6 25.4"/>
 </svg>;
}
