const browse = new URLSearchParams(location.search).get('browse');
if (browse !== null) {
  const supplied = new URLSearchParams(browse), safe = new URLSearchParams();
  for (const key of ['q','mechanism','status','sort','format','focus','page']) {
    if (supplied.has(key)) safe.set(key,supplied.get(key));
  }
  for (const link of document.querySelectorAll('.archive-breadcrumb a,.back-to-archive')) {
    link.href = '/time-travel/' + (safe.size ? '?' + safe : '') + '#catalog';
    link.textContent = '← Back to your film results';
  }
}
const format = document.querySelector('#release-format');
if (format) {
  const releases = [...document.querySelectorAll('.release-card')];
  document.querySelector('.release-controls').hidden = false;
  const filter = () => {
    let count = 0;
    for (const release of releases) { release.hidden = !!format.value && release.dataset.format !== format.value; if (!release.hidden) count++; }
    document.querySelector('#release-count').textContent = `${count} of ${releases.length} releases`;
  };
  format.addEventListener('change',filter);
  filter();
}
