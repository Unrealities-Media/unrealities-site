const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
function filesIn(directory) {
  return fs.readdirSync(path.join(root, directory), {withFileTypes:true}).flatMap(item => {
    if (item.name.startsWith('.') || ['scripts', 'docs'].includes(item.name)) return []
    const relative = path.join(directory, item.name)
    return item.isDirectory() ? filesIn(relative) : [relative]
  })
}
const files = filesIn('')
const pages = files.filter(file => file.endsWith('.html'))
const problems = []
const scripts = new Set()
for (const relative of pages) {
  const html = fs.readFileSync(path.join(root, relative), 'utf8')
  for (const match of html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)) {
    if (/^(?:[a-z]+:|\/\/)/i.test(match[1])) continue
    scripts.add(path.relative(root, match[1].startsWith('/') ? path.join(root,match[1].slice(1)) : path.resolve(root,path.dirname(relative),match[1])))
  }
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = match[1].replaceAll('&amp;', '&')
    if (/^(?:[a-z]+:|#|\/\/)/i.test(url)) continue
    const pathname = url.split(/[?#]/)[0]
    if (!pathname) continue
    const resolved = pathname.startsWith('/') ? path.join(root, pathname.slice(1)) : path.resolve(path.dirname(path.join(root, relative)), pathname)
    if ((resolved !== root && !resolved.startsWith(root + path.sep)) || !fs.existsSync(resolved) || (fs.statSync(resolved).isDirectory() && !fs.existsSync(path.join(resolved, 'index.html')))) problems.push(`${relative}: ${url}`)
  }
}
// Fetch dependencies are invisible to HTML-only link checks. Check literal runtime
// asset paths relative to their HTML host, including arrays passed to fetch().
for (const relative of scripts) {
  const source = fs.readFileSync(path.join(root, relative), 'utf8')
  const host = relative.startsWith(path.join('fmv', 'games', 'js')) ? path.join(root, 'fmv', 'games') : path.dirname(path.join(root, relative))
  for (const match of source.matchAll(/['"]((?:data|img|tools)\/[^'"\s]+\.(?:json|jpg|png|svg))['"]/g)) {
    if (match[1].endsWith('.local.json')) continue // Optional localhost-only overlay.
    if (!fs.existsSync(path.resolve(host, match[1]))) problems.push(`${relative}: ${match[1]}`)
  }
}
if (problems.length) throw new Error(`Broken local links:\n${problems.join('\n')}`)
console.log(`Checked local links in ${pages.length} public pages and runtime asset dependencies.`)
