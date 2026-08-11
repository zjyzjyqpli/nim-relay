const http = require('http');
const https = require('https');

const UP = 'integrate.api.nvidia.com';
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/healthz') {
    res.writeHead(200); res.end('ok'); return;
  }
  const opts = {
    hostname: UP, port: 443, path: req.url, method: req.method,
    headers: { ...req.headers, host: UP },
  };
  const p = https.request(opts, (r) => {
    res.writeHead(r.statusCode, r.headers);
    r.pipe(res);
  });
  p.on('error', (e) => {
    if (!res.headersSent) res.writeHead(502);
    res.end('proxy error: ' + e.message);
  });
  req.pipe(p);
});
server.listen(PORT, () => console.log('nim relay listening on ' + PORT));
