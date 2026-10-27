const grid = document.querySelector('#film-grid');
const films = [...grid.children];
const search = document.querySelector('#film-search');
const mechanism = document.querySelector('#film-mechanism');
const status = document.querySelector('#film-status');
const sort = document.querySelector('#film-sort');
function filter() {
  const query = search.value.trim().toLowerCase();
  let count = 0;
  for (const film of films) {
    film.hidden = !(film.dataset.search.includes(query) && (!mechanism.value || film.dataset.mechanism === mechanism.value) && (!status.value || film.dataset.status === status.value));
    if (!film.hidden) count++;
  }
  document.querySelector('#film-count').textContent = `${count} of ${films.length} records${count ? '' : ' — try another title or clear the filters'}`;
}
for (const input of [search, mechanism, status]) input.addEventListener('input', filter);
sort.addEventListener('change', () => {
  const sorted = films.slice().sort((a,b) => sort.value === 'title' ? a.dataset.title.localeCompare(b.dataset.title) : (Number(b.dataset[sort.value] || -1) - Number(a.dataset[sort.value] || -1)) || a.dataset.title.localeCompare(b.dataset.title));
  grid.append(...sorted);
});
document.querySelector('#film-reset').addEventListener('click', () => { search.value = mechanism.value = status.value = ''; filter(); });
function revealLink() {
  let id; try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  const film = document.getElementById(id);
  if (film?.classList.contains('film-card')) { search.value = mechanism.value = status.value = ''; filter(); film.querySelector('details').open = true; film.scrollIntoView(); }
}
window.addEventListener('hashchange', revealLink);
filter();
revealLink();
