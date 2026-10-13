// 로컬 확인용 정적 파일 서버 — 외부 패키지 없이 Node.js 기본 모듈만 쓴다.
// Vercel 에는 public/ 폴더를 정적 사이트로 그대로 배포하므로, 이 파일은 로컬 테스트에만 쓰인다.
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

const ROOT = path.join(__dirname, 'public')
const PORT = Number(process.env.PORT) || 3000
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
}

const send = (res, status, file, method) => {
  fs.readFile(file, (err, data) => {
    if (err) {
      // 없는 주소는 Vercel 처럼 public/404.html 을 보여 준다
      if (status !== 404) return send(res, 404, path.join(ROOT, '404.html'), method)
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      return res.end('404 Not Found')
    }
    res.writeHead(status, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' })
    res.end(method === 'HEAD' ? undefined : data)
  })
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' })
    return res.end()
  }

  const rawPath = new URL(req.url, 'http://localhost').pathname
  let pathname
  try { pathname = decodeURIComponent(rawPath) } catch {
    res.writeHead(400)
    return res.end()
  }

  // public/ 밖의 파일(예: /../server.js)은 내주지 않는다
  const file = path.join(ROOT, pathname)
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)) {
    res.writeHead(403)
    return res.end()
  }

  fs.stat(file, (err, stat) => {
    if (err) return send(res, 404, path.join(ROOT, '404.html'), req.method)
    if (stat.isDirectory()) {
      // /projects/mend-day → /projects/mend-day/ 로 맞춰야 상대 경로가 어긋나지 않는다
      if (!rawPath.endsWith('/')) {
        res.writeHead(301, { Location: rawPath + '/' })
        return res.end()
      }
      return send(res, 200, path.join(file, 'index.html'), req.method)
    }
    send(res, 200, file, req.method)
  })
})

server.listen(PORT, () => {
  console.log(`프로필 사이트 실행 중 → http://localhost:${PORT}`)
  console.log('끄려면 Ctrl + C')
})
