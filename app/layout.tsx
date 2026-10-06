import './globals.css';
import {Covered_By_Your_Grace,DM_Sans,Outfit} from 'next/font/google';

// --font-hand: scratchy handwriting for titles and notes; --font-sans: body copy; --font-ui: nav pills
const hand=Covered_By_Your_Grace({subsets:['latin'],weight:'400',variable:'--font-hand'});
const sans=Outfit({subsets:['latin'],variable:'--font-sans'});
const ui=DM_Sans({subsets:['latin'],variable:'--font-ui'});

export const metadata={title:'Rohit Khatri — Developer',description:'Full-stack developer portfolio'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className={`${hand.variable} ${sans.variable} ${ui.variable}`}><body>
 {/* without JS the preloader would never lift */}
 <noscript><style>{'.preloader{display:none}.canvas .obj,.canvas .header,.canvas .homecopy{opacity:1;translate:none}'}</style></noscript>
 {children}
</body></html>}
