/* Site copy and links. Everything a visitor reads lives here. */

export const owner={
 name:'Rohit',
 email:'hello@rohitkhatri.dev',
 socials:[{label:'LinkedIn',href:'#'},{label:'GitHub',href:'#'},{label:'Instagram',href:'#'}]
};

/*
 Work slides. `media` is shown inside the hand-drawn frame: an image, or a muted looping video
 (set `video` — e.g. a screen recording of the site — and keep `img` as its poster).
 `url` turns on "Click to open project"; `live` adds a "Live:" link.
*/
export type Project={title:string,desc:string,tag:string,stack:string,img:string,video?:string,url?:string,live?:string};
export const projects:Project[]=[
 {title:'Marketplace OS',desc:'Full-stack operations platform.',tag:'Live product',stack:'Architecture, UI, APIs',img:'/assets/proj-marketplace.png'},
 {title:'Niyaraa Commerce',desc:'Shopify storefront & custom theme.',tag:'Commerce',stack:'Shopify, Liquid, UX',img:'/assets/proj-shopify.png'},
 {title:'WebAR Lab',desc:'Browser-based face tracking prototype.',tag:'Experiment',stack:'MindAR, A-Frame',img:'/assets/proj-ar.png'},
 {title:'DocuFlow',desc:'Document generation + signing workflow.',tag:'Automation',stack:'Node, APIs, Workflows',img:'/assets/proj-docs.png'}
];

export const steps:[string,string][]=[
 ['Getting to know you','I ask a lot of questions because I want the product to feel tailored to the real problem, not like a template with your logo dropped on top.'],
 ['Designing the system','I map the information, states and interactions first, then decide what belongs in the frontend, backend and infrastructure.'],
 ['Building the site','I build with custom code, adding motion and interaction only where it makes the experience clearer or more memorable.'],
 ['Handover & going live','Deployment, analytics, performance checks, documentation and a clean handoff so the project is easy to keep evolving.'],
 ['After launch','I stay available for fixes, iteration and the next version once real usage starts producing useful feedback.']
];

/* About = a note open on the phone. `photo` blocks render as a picture (or a placeholder until you add one). */
export type NoteBlock={kind:'field',label:string,text:string}|{kind:'text',text:string}|{kind:'photo',src?:string,alt:string}|{kind:'tags',items:string[]};
export const aboutNote:NoteBlock[]=[
 {kind:'field',label:'Name',text:'Rohit'},
 {kind:'field',label:'Job',text:'Full-stack developer, designing and building products from scratch'},
 {kind:'photo',alt:'Rohit at his desk'},
 {kind:'text',text:'I like products that feel considered — not polished for the sake of looking polished, but clear, fast and a little bit human.'},
 {kind:'text',text:'I work across frontend, backend, commerce, APIs, automation and cloud infrastructure. I care about the invisible parts as much as the visible ones.'},
 {kind:'field',label:'Usually working with',text:''},
 {kind:'tags',items:['Next.js','TypeScript','NestJS','Shopify','AWS']}
];

/* Contact form options (the form sends a pre-filled email to owner.email). */
export const budgets=['Not sure yet','< $1k','$1k – $3k','$3k – $6k','$6k+'];
