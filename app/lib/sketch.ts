/* Hand-drawn SVG paths. Seeded, so the same seed always draws the same wobble (no hydration surprises). */
type Pt=[number,number];

export function rng(seed:number){
 return ()=>{seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
}

// Catmull-Rom through the points → smooth cubic Béziers
function smooth(p:Pt[],closed:boolean){
 const n=p.length,at=(i:number)=>closed?p[(i+n)%n]:p[Math.max(0,Math.min(n-1,i))],f=(v:number)=>v.toFixed(1);
 let d=`M${f(p[0][0])} ${f(p[0][1])}`;
 for(let i=0;i<(closed?n:n-1);i++){
  const [a,b,c,e]=[at(i-1),at(i),at(i+1),at(i+2)];
  d+=`C${f(b[0]+(c[0]-a[0])/6)} ${f(b[1]+(c[1]-a[1])/6)} ${f(c[0]-(e[0]-b[0])/6)} ${f(c[1]-(e[1]-b[1])/6)} ${f(c[0])} ${f(c[1])}`;
 }
 return d+(closed?'Z':'');
}

// low-frequency jitter: a damped random walk, so lines drift instead of buzzing
function drift(count:number,amp:number,seed:number){
 const r=rng(seed);let v=0;return Array.from({length:count},()=>(v=v*.72+(r()-.5)*.9)*amp);
}

/* Rounded rectangle (0,0)–(w,h) with radius r, wobbling up to ~amp units off the true outline. */
export function sketchRoundRect(w:number,h:number,r:number,{amp=2.4,step=26,seed=1}={}){
 const arc=Math.PI*r/2,legs=[w-2*r,arc,h-2*r,arc,w-2*r,arc,h-2*r,arc],per=legs.reduce((a,b)=>a+b);
 const corner=(cx:number,cy:number,a0:number,t:number):[Pt,Pt]=>{const a=a0+t*Math.PI/2;return [[cx+r*Math.cos(a),cy+r*Math.sin(a)],[Math.cos(a),Math.sin(a)]]};
 const pointAt=(s:number):[Pt,Pt]=>{
  let k=0;while(s>legs[k]){s-=legs[k];k++}const t=s/legs[k];
  switch(k){
   case 0:return [[r+t*(w-2*r),0],[0,-1]];
   case 1:return corner(w-r,r,-Math.PI/2,t);
   case 2:return [[w,r+t*(h-2*r)],[1,0]];
   case 3:return corner(w-r,h-r,0,t);
   case 4:return [[w-r-t*(w-2*r),h],[0,1]];
   case 5:return corner(r,h-r,Math.PI/2,t);
   case 6:return [[0,h-r-t*(h-2*r)],[-1,0]];
   default:return corner(r,r,Math.PI,t);
  }
 };
 const n=Math.ceil(per/step),off=drift(n,amp,seed);
 const pts=Array.from({length:n},(_,i)=>{const [[x,y],[nx,ny]]=pointAt(i/n*per*.9999);return [x+nx*off[i],y+ny*off[i]] as Pt});
 return smooth(pts,true);
}

/* A quick pen circle: slightly lopsided and overshooting where the stroke started. */
export function sketchCircle(cx:number,cy:number,rad:number,seed:number,amp=.08){
 const r=rng(seed),start=r()*Math.PI*2,n=14,sweep=Math.PI*2*(1.08+r()*.06),off=drift(n+1,amp*rad,seed+3);
 const pts=Array.from({length:n+1},(_,i)=>{const a=start+sweep*i/n,k=rad+off[i]+(i/n)*rad*.06;return [cx+Math.cos(a)*k,cy+Math.sin(a)*k*.94] as Pt});
 return smooth(pts,false);
}
