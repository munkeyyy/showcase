/*
 Every desk object in one place. <DeskObject> renders these; the home scroll animation reads `B`/`C`.

 pos     resting position + width (any CSS lengths). Use left|right and top|bottom.
 mobile  overrides at <=620px, or 'hidden' to drop the piece on small phones.
 edge    transform used on the Work and Process pages, where the desk is pushed out to the edges.
 z       stacking order (matters when pieces pile up on the home page).
 B / C   home-page arrangements: [centre x in vw, centre y in vh, rotation in deg relative to rest].
         B = tools tidied into a pile ("design"), C = workstation in the middle ("build").
         Rotations include full turns on purpose: pieces spin as they travel.
*/
export type Pose=[number,number,number];
export type DeskPos={left?:string,right?:string,top?:string,bottom?:string,width:string};
export type DeskItem={
 id:string,src:string,z:number,
 pos:DeskPos,mobile?:Partial<DeskPos>|'hidden',
 edge:string,
 B:Pose,C:Pose
};

export const deskItems:DeskItem[]=[
 {id:'notebook',src:'/assets/notebook_ref.png',z:0,
  pos:{left:'6.5vw',top:'4vh',width:'11.5vw'},mobile:{width:'27vw'},
  edge:'translate(-5vw,-11vh) rotate(-7deg)',B:[56.4,52.2,350],C:[83.4,-6.9,20]},
 {id:'pencil',src:'/assets/pencil_ref.png',z:9,
  pos:{left:'18.1vw',top:'4vh',width:'4.2vw'},mobile:{left:'30vw',width:'8vw'},
  edge:'translate(-4vw,-14vh)',B:[51.6,46.4,-361],C:[98.6,-5.9,-28]},
 {id:'phoneObj',src:'/assets/phone_ref.png',z:1,
  pos:{left:'31.4vw',top:'14vh',width:'6.2vw'},mobile:{left:'52vw',width:'14vw'},
  edge:'translate(-4vw,-18vh)',B:[101,98.6,160],C:[33,48.4,-182]},
 {id:'keyboard',src:'/assets/keyboard_ref.png',z:1,
  pos:{left:'47.2vw',top:'7vh',width:'17.2vw'},mobile:'hidden',
  edge:'translate(-4vw,-13vh)',B:[42.3,48.7,-69],C:[19.1,-5.8,16]},
 {id:'receipt',src:'/assets/receipt_ref.png',z:1,
  pos:{left:'68.5vw',top:'18vh',width:'8.6vw'},mobile:{left:'auto',right:'7vw',width:'17vw'},
  edge:'translate(3vw,-12vh)',B:[-.2,97,-191],C:[72.6,49.6,-107]},
 {id:'loop',src:'/assets/loop_ref.png',z:6,
  pos:{right:'4.6vw',top:'18vh',width:'8vw'},mobile:'hidden',
  edge:'translate(6vw,-2vh)',B:[56.8,40.6,-230],C:[76.3,102.3,15]},
 {id:'shell',src:'/assets/shell_ref.png',z:8,
  pos:{left:'2.5vw',top:'43vh',width:'7.8vw'},mobile:{width:'19vw'},
  edge:'translate(-8vw,19vh)',B:[61.4,37.8,360],C:[66.7,-2.5,730]},
 {id:'marker',src:'/assets/marker_ref.png',z:6,
  pos:{left:'12.7vw',top:'38vh',width:'6.2vw'},mobile:{width:'10vw'},
  edge:'translate(-9vw,36vh)',B:[58.2,55.3,-331],C:[27,103.7,-380]},
 {id:'tube',src:'/assets/tube_ref.png',z:9,
  pos:{left:'24.8vw',top:'55vh',width:'6.1vw'},mobile:{width:'12vw'},
  edge:'translate(-4vw,33vh)',B:[47.5,42.2,-230],C:[50,105.2,-35]},
 {id:'screwdriver',src:'/assets/screwdriver_ref.png',z:4,
  pos:{left:'11.5vw',bottom:'4vh',width:'9.2vw'},mobile:{width:'11vw'},
  edge:'translate(-1vw,10vh)',B:[37.9,51.9,-306],C:[1.4,-5.4,-345]},
 {id:'scissors',src:'/assets/scissorsfilm_ref.png',z:2,
  pos:{right:'1.7vw',top:'43vh',width:'19vw'},mobile:{width:'18vw'},
  edge:'translate(6vw,30vh)',B:[42,50.2,310],C:[97.7,103.9,323]},
 {id:'ring',src:'/assets/ring_ref.png',z:7,
  pos:{left:'24.1vw',top:'37vh',width:'4.8vw'},mobile:'hidden',
  edge:'translate(5vw,-25vh)',B:[64,55.2,300],C:[33.2,.5,90]},
 {id:'laptop',src:'/assets/laptop_ref.png',z:1,
  pos:{left:'43.8vw',bottom:'1.5vh',width:'23vw'},mobile:{left:'39vw',width:'45vw'},
  edge:'translate(53vw,-37vh) rotate(4deg)',B:[102.1,6.1,6],C:[50,43.7,4]}
];
