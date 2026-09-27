import { cp, mkdir, rm, stat } from 'node:fs/promises';
await import('./validate-seo.mjs');
const required=['favicon.ico','assets/site-icon.png','assets/og.jpg','assets/iwsmmo-hero.webp','assets/world-concept.webp','assets/encounter-concept.webp','assets/language.css','assets/language.js','assets/language-dynamic.js','en/index.html','en/mmorpg.html','en/register.html','en/verify.html','en/privacy.html','en/terms.html','ar/index.html','ar/mmorpg.html','ar/register.html','ar/verify.html','ar/privacy.html','ar/terms.html','index.html','mmorpg.html','assets/features.css','assets/features.js','register.html','verify.html','privacy.html','terms.html','assets/styles.css','assets/hero-fix.css','assets/homepage.css','assets/site.js','assets/iwsmmo-hero.png','assets/og.png','assets/world-concept.png','assets/encounter-concept.png','CNAME'];
for(const file of required){await stat(file)}
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const file of required){await mkdir(`dist/${file.split('/').slice(0,-1).join('/')}`,{recursive:true});await cp(file,`dist/${file}`)}
await cp('.nojekyll','dist/.nojekyll');await cp('robots.txt','dist/robots.txt');await cp('sitemap.xml','dist/sitemap.xml');
console.log(`iWsMMO website build complete: ${required.length+3} files`);
