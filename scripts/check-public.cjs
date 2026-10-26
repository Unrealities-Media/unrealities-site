const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const pages = ['index.html', '404.html', 'fmv/index.html', 'time-travel/index.html', ...['index', 'game', 'timeline', 'titans', 'collect', 'channel'].map(name => `fmv/games/${name}.html`)]
const problems = []
for (const relative of pages) {
  const html = fs.readFileSync(path.join(root, relative), 'utf8')
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = match[1].replaceAll('&amp;', '&')
    if (/^(?:[a-z]+:|#|\/\/)/i.test(url)) continue
    const pathname = url.split(/[?#]/)[0]
    if (!pathname) continue
    const resolved = pathname.startsWith('/') ? path.join(root, pathname.slice(1)) : path.resolve(path.dirname(path.join(root, relative)), pathname)
    if ((resolved !== root && !resolved.startsWith(root + path.sep)) || !fs.existsSync(resolved) || (fs.statSync(resolved).isDirectory() && !fs.existsSync(path.join(resolved, 'index.html')))) problems.push(`${relative}: ${url}`)
  }
}
if (problems.length) throw new Error(`Broken local links:\n${problems.join('\n')}`)
console.log(`Checked local links in ${pages.length} public pages.`)
