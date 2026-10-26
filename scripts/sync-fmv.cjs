const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const source = path.resolve(root, '..', 'fmv-games')
const target = path.join(root, 'fmv', 'games')
const check = process.argv.includes('--check')
const paths = ['index.html', 'game.html', 'timeline.html', 'titans.html', 'collect.html', 'channel.html']
for (const directory of ['css', 'js', 'data', 'img']) {
  function addFiles(folder) {
    for (const item of fs.readdirSync(path.join(source, folder), { withFileTypes: true })) {
      const relative = path.join(folder, item.name)
      if (item.isDirectory()) addFiles(relative)
      else if (item.isFile() && !item.name.endsWith('.local.json') && item.name !== 'README.md') paths.push(relative)
    }
  }
  addFiles(directory)
}

if (!target.startsWith(root + path.sep) || !source.startsWith(path.dirname(root) + path.sep)) throw new Error('Unexpected sync paths')
for (const relative of paths) {
  const input = path.join(source, relative)
  const output = path.join(target, relative)
  if (check) {
    if (!fs.existsSync(output) || !fs.readFileSync(input).equals(fs.readFileSync(output))) throw new Error(`FMV copy is out of date: ${relative}`)
  } else {
    fs.mkdirSync(path.dirname(output), { recursive: true })
    fs.copyFileSync(input, output)
  }
}
console.log(`${check ? 'Checked' : 'Synced'} ${paths.length} FMV site files.`)
