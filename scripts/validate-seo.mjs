import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const base='https://iwsgames.com';
const languages=['tr','en','ar'];
const pages=['index.html','mmorpg.html','privacy.html','terms.html','register.html','verify.html'];
const route=(language,page)=>(language==='tr'?'/':'/'+language+'/')+(page==='index.html'?'':page);
const docs=new Map();
for(const language of languages){
 for(const page of pages){
  const relative=(language==='tr'?'':language+'/')+page;
  const html=await readFile(path.join(root,relative),'utf8');
  const url=base+route(language,page);
  docs.set(url,html);
  assert(html.includes('lang="'+language+'"'),relative+' language');
  assert(html.includes('dir="'+(language==='ar'?'rtl':'ltr')+'"'),relative+' direction');
  assert(html.includes('<link rel="canonical" href="'+url+'">'),relative+' canonical');
  for(const alt of [...languages,'x-default']){
   const target=base+route(alt==='x-default'?'tr':alt,page);
   assert(html.includes('hreflang="'+alt+'" href="'+target+'"'),relative+' alternate '+alt);
  }
  assert(html.includes('href="/assets/site-icon.png"'),relative+' site icon');
  if(page==='verify.html') assert(html.includes('content="noindex,follow"'),relative+' verification indexing');
  else assert(html.includes('content="index,follow,max-image-preview:large"'),relative+' indexing');
 }
}
for(const language of languages){
 for(const page of ['index.html','mmorpg.html']){
  const url=base+route(language,page); const html=docs.get(url);
  assert(html.includes('property="og:site_name" content="iWs Games"'),url+' brand');
  assert(html.includes('property="og:image" content="'+base+'/assets/og.jpg"'),url+' social image');
  const marker='<script type="application/ld+json">';
  assert.equal(html.split(marker).length,2,url+' structured-data block');
  const start=html.indexOf(marker)+marker.length;
  const data=JSON.parse(html.slice(start,html.indexOf('</script>',start)));
  assert.equal(data['@context'],'https://schema.org');
  assert.equal(data['@graph'].find(item=>item['@type']==='WebSite').url,base+'/');
  assert(data['@graph'].some(item=>item.url===url&&item.inLanguage===language),url+' localized page');
  assert(html.includes('type="image/webp"'),url+' efficient images');
 }
}
const sitemap=await readFile(path.join(root,'sitemap.xml'),'utf8');
const locations=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(item=>item[1]);
assert.equal(new Set(locations).size,locations.length,'unique sitemap URLs');
for(const url of locations){assert(docs.has(url),'known sitemap page '+url);assert(!url.endsWith('verify.html'),'verification excluded from sitemap');}
for(const language of languages) for(const page of ['index.html','mmorpg.html']) assert(locations.includes(base+route(language,page)),'main page in sitemap');
const robots=await readFile(path.join(root,'robots.txt'),'utf8');assert(robots.includes('Sitemap: '+base+'/sitemap.xml'),'sitemap discovery');
for(const asset of ['favicon.ico','assets/site-icon.png','assets/og.jpg','assets/iwsmmo-hero.webp','assets/world-concept.webp','assets/encounter-concept.webp']) await access(path.join(root,asset));
console.log('SEO validation passed: '+docs.size+' pages, 3 languages, 6 structured-data pages, '+locations.length+' sitemap URLs.');
