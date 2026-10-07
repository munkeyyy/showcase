/*
 Desk objects as solid ground for the stick figure.

 Each cut-out photo becomes a small solidity mask (its alpha channel at ≤64px), so only the drawn
 object is solid, not the transparent corners of the image. A screen point is tested by undoing the
 object's live transform (GSAP on home, the edge layout on inner pages, the mobile scale) and
 looking the point up in that mask. Objects move, so geometry is re-read every frame for the few
 objects near the figure.
*/
type Mask={bits:Uint8Array,w:number,h:number};
export type Solid={el:HTMLImageElement,cx:number}; // cx = on-screen centre x, used to ride moving objects
type Geo=Solid&{ox:number,oy:number,w:number,h:number,inv:DOMMatrix,mask:Mask};

const MASK_MAX=64,ALPHA_MIN=96,MIN_BLOB=24,NEAR=320,REFRESH_MS=150; // MIN_BLOB in mask cells (of ≤64×64)
const masks=new WeakMap<HTMLImageElement,Mask>();

function buildMask(img:HTMLImageElement){
 const nw=img.naturalWidth,nh=img.naturalHeight;if(!nw||!nh)return;
 const k=MASK_MAX/Math.max(nw,nh),w=Math.max(1,Math.round(nw*k)),h=Math.max(1,Math.round(nh*k));
 const c=document.createElement('canvas');c.width=w;c.height=h;
 const ctx=c.getContext('2d',{willReadFrequently:true})!;
 ctx.drawImage(img,0,0,w,h);
 const px=ctx.getImageData(0,0,w,h).data,bits=new Uint8Array(w*h);
 for(let i=0;i<bits.length;i++)bits[i]=px[i*4+3]>=ALPHA_MIN?1:0;
 masks.set(img,{bits:despeckle(bits,w,h),w,h});
}

/*
 The scans carry stray specks around the object; each would be an invisible ledge to stand on.
 Keep only connected blobs of a real size (4-neighbour flood fill on the small mask).
*/
function despeckle(bits:Uint8Array,w:number,h:number){
 const seen=new Uint8Array(bits.length),out=new Uint8Array(bits.length),stack:number[]=[];
 for(let start=0;start<bits.length;start++){
  if(!bits[start]||seen[start])continue;
  const blob:number[]=[];stack.push(start);seen[start]=1;
  while(stack.length){
   const i=stack.pop()!,x=i%w;blob.push(i);
   for(const n of [x>0?i-1:-1,x<w-1?i+1:-1,i-w,i+w])if(n>=0&&n<bits.length&&bits[n]&&!seen[n]){seen[n]=1;stack.push(n)}
  }
  if(blob.length>=MIN_BLOB)for(const i of blob)out[i]=1;
 }
 return out;
}

/* Build masks for every desk object once the images are in (cheap, but done off the critical path). */
export function prepareDeskMasks(){
 const run=()=>document.querySelectorAll<HTMLImageElement>('.obj').forEach(img=>{
  if(masks.has(img))return;
  img.complete&&img.naturalWidth?buildMask(img):img.decode().then(()=>buildMask(img)).catch(()=>{});
 });
 'requestIdleCallback' in window?requestIdleCallback(run):setTimeout(run,300);
}

/* Tracks which objects are near the figure and answers "is this screen point solid?". */
export function createDeskWorld(){
 let near:HTMLImageElement[]=[],lastRefresh=-1e9,geos:Geo[]=[];

 // every frame: fresh geometry for the nearby objects (they may be animating)
 const update=(now:number,fx:number,fy:number)=>{
  if(now-lastRefresh>=REFRESH_MS){
   lastRefresh=now;
   near=[...document.querySelectorAll<HTMLImageElement>('.obj')].filter(img=>{
    if(!masks.has(img)||!img.offsetParent)return false; // no mask yet, or hidden at this breakpoint
    if(+getComputedStyle(img).opacity<.5)return false;   // e.g. the phone, "picked up" on About/Contact
    const r=img.getBoundingClientRect();
    return r.right>fx-NEAR&&r.left<fx+NEAR&&r.bottom>fy-NEAR&&r.top<fy+NEAR;
   });
  }
  geos=near.map(el=>{
   const parent=(el.offsetParent as HTMLElement).getBoundingClientRect(),w=el.offsetWidth,h=el.offsetHeight;
   const t=getComputedStyle(el).transform,r=el.getBoundingClientRect();
   return {el,w,h,mask:masks.get(el)!,
    ox:parent.left+el.offsetLeft+w/2,oy:parent.top+el.offsetTop+h/2, // layout centre = transform origin
    inv:(t==='none'?new DOMMatrix():new DOMMatrix(t)).inverse(),
    cx:r.left+r.width/2};
  });
 };

 const hit=(x:number,y:number):Solid|null=>{
  for(const g of geos){
   const q=g.inv.transformPoint(new DOMPoint(x-g.ox,y-g.oy));
   const u=(q.x+g.w/2)/g.w,v=(q.y+g.h/2)/g.h;
   if(u<0||u>=1||v<0||v>=1)continue;
   if(g.mask.bits[Math.floor(v*g.mask.h)*g.mask.w+Math.floor(u*g.mask.w)])return g;
  }
  return null;
 };

 const find=(el:HTMLImageElement)=>geos.find(g=>g.el===el)??null;
 return {update,hit,find,get empty(){return geos.length===0}};
}
