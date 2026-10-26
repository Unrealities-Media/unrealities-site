const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const sources = { 'talkie-trivia': ['talkie-trivia', 'time-travel'], DeckLogic: ['decklogic'], 'fmv-games': ['rip-fmv'] };
const order = ['talkie-trivia', 'decklogic', 'rip-fmv', 'time-travel'];
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
function validate(projects, ids = order) {
  if (!Array.isArray(projects) || projects.length !== ids.length || new Set(projects.map(p => p.id)).size !== ids.length) throw Error('Expected unique project summaries: ' + ids.join(', '));
  for (const p of projects) {
    if (!ids.includes(p.id)) throw Error('Unexpected project: ' + p.id);
    for (const field of ['name', 'category', 'status', 'description', 'url', 'action', 'milestone', 'reviewedOn']) {
      if (typeof p[field] !== 'string' || !p[field].trim()) throw Error(`${p.id}: missing ${field}`);
    }
    if (!/^https:\/\/[^\s]+$/.test(p.url) && !/^\/(?!\/)[\w/-]*$/.test(p.url)) throw Error(`${p.id}: unsafe URL`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(p.reviewedOn) || new Date(p.reviewedOn).toISOString().slice(0, 10) !== p.reviewedOn) throw Error(`${p.id}: invalid review date`);
  }
  return projects;
}
function upstream() {
  const projects = [], provenance = {};
  for (const [repo, ids] of Object.entries(sources)) {
    const dir = path.resolve(root, '..', repo);
    const content = validate(read(path.join(dir, 'public-projects.json')), ids);
    projects.push(...content);
    provenance[repo] = { summaryHash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), commit: execFileSync('git', ['-C', dir, 'rev-parse', 'HEAD'], {encoding:'utf8'}).trim() };
  }
  return { projects: order.map(id => projects.find(p => p.id === id)), provenance };
}
function snapshot() { return validate(read(path.join(root, 'data/projects.json'))); }
function render(template, projects = snapshot(), current = '') {
  const nav = projects.map(p => `<a href="${escape(p.url)}"${p.id === current ? ' aria-current="page"' : ''}>${escape(p.name)}</a>`).join('');
  const cards = projects.map(p => `        <article class="project-card" id="${p.id}">
          <span class="project-label">${escape(p.category)}</span>
          <h3>${escape(p.name)}</h3>
          <p class="project-status">${escape(p.status)}</p>
          <p>${escape(p.description)}</p>
          <p class="project-milestone">${escape(p.milestone)}</p>
          <a href="${escape(p.url)}">${escape(p.action)} <span aria-hidden="true">↗</span></a>
        </article>`).join('\n');
  let output = template.replaceAll('<!-- PROJECT_NAV -->', nav).replace('<!-- PROJECT_CARDS -->', cards);
  for (const p of projects) {
    for (const key of ['url', 'status', 'action']) output = output.replaceAll(`<!-- ${p.id.toUpperCase()}_${key.toUpperCase()} -->`, escape(p[key]));
  }
  return output;
}
module.exports = { root, sources, order, validate, upstream, snapshot, render };
