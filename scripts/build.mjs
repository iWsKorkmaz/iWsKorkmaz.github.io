import { cp, mkdir, rm, stat } from 'node:fs/promises';
const required=['index.html','register.html','verify.html','privacy.html','terms.html','assets/styles.css','assets/hero-fix.css','assets/homepage.css','assets/site.js','assets/iwsmmo-hero.png','assets/og.png','assets/world-concept.png','assets/encounter-concept.png','CNAME'];
for(const file of required){await stat(file)}
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const file of required){await mkdir(`dist/${file.split('/').slice(0,-1).join('/')}`,{recursive:true});await cp(file,`dist/${file}`)}
await cp('.nojekyll','dist/.nojekyll');await cp('robots.txt','dist/robots.txt');await cp('sitemap.xml','dist/sitemap.xml');
console.log(`iWsMMO website build complete: ${required.length+3} files`);
