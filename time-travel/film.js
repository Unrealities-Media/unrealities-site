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
