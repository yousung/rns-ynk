const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3005;
const DIR = __dirname;
const DEFAULT = '/outbound-execute.html';
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
};

// 프리뷰 iframe은 localStorage가 비어있어 requireAuth() 무한 리다이렉트가 발생한다.
// <head> 직후에 더미 유저를 주입해 우회한다.
const AUTH_INJECT = `<script>(function(){try{if(!localStorage.getItem('wms_user')){localStorage.setItem('wms_user',JSON.stringify({name:'프리뷰',role:'super_admin'}));}}catch(e){}})();</script>`;

http.createServer((req, res) => {
  let pathname = url.parse(req.url).pathname;
  if (pathname === '/' || pathname === '/index.html') pathname = DEFAULT;
  const filePath = path.join(DIR, pathname);
  try {
    const ext = path.extname(filePath);
    let data = fs.readFileSync(filePath);
    if (ext === '.html') {
      const txt = data.toString('utf-8').replace(/<head(\s[^>]*)?>/i, m => m + AUTH_INJECT);
      data = Buffer.from(txt, 'utf-8');
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(data);
  } catch (e) {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(PORT, () => console.log('preview server on port ' + PORT));
