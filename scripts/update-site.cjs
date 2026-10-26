// Run from any directory; all input repositories are siblings of unrealities-site.
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const check = process.argv.includes('--check');
const upstream = process.argv.includes('--upstream');
function run(script, args = []) {
  execFileSync(process.execPath, [path.join(__dirname, script), ...args], {stdio:'inherit'});
}
run('sync-fmv.cjs', check ? ['--check'] : []);
run('build-projects.cjs', check ? ['--check', ...(upstream ? ['--upstream'] : [])] : ['--refresh']);
run('build-time-travel.cjs', check ? ['--check'] : []);
run('build-sitemap.cjs', check ? ['--check'] : []);
run('check-public.cjs');
