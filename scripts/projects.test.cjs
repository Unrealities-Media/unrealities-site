const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validate, render, snapshot } = require('./projects.cjs');

test('all four projects receive one card and navigation link', () => {
  const projects = snapshot();
  const html = render('<!-- PROJECT_NAV --><!-- PROJECT_CARDS -->', projects, 'rip-fmv');
  assert.equal((html.match(/class="project-card"/g) || []).length, 4);
  assert.equal((html.match(/aria-current="page"/g) || []).length, 1);
  for (const p of projects) assert.equal((html.match(new RegExp(`id="${p.id}"`, 'g')) || []).length, 1);
});

test('import rejects duplicate identities, missing fields and executable URLs', () => {
  const projects = snapshot();
  assert.throws(() => validate([projects[0], projects[0], ...projects.slice(2)]));
  assert.throws(() => validate(projects.map((p, i) => i ? p : {...p, milestone:''})));
  assert.throws(() => validate(projects.map((p, i) => i ? p : {...p, url:'javascript:alert(1)'})));
  assert.throws(() => validate(projects.map((p, i) => i ? p : {...p, url:'//example.com'})));
});

test('public text is escaped and destinations/status come from summaries', () => {
  const projects = snapshot().map((p, i) => i ? p : {...p, name:'<script>alert("x")</script>', status:'Released & ready'});
  const html = render('<!-- PROJECT_CARDS --><!-- TALKIE-TRIVIA_STATUS --><!-- TALKIE-TRIVIA_URL -->', projects);
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('Released &amp; ready'));
  assert.ok(!html.includes('<!--'));
});
