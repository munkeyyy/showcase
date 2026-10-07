/* Prefixes public/ file paths with the site's base path (set when it is hosted under a subpath, e.g. GitHub Pages). */
export const asset=(path:string)=>`${process.env.NEXT_PUBLIC_BASE_PATH||''}${path}`;
