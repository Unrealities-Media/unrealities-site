const cards = [...document.querySelectorAll('.film-card')]
const search = document.querySelector('#film-search')
const mechanism = document.querySelector('#film-mechanism')
const count = document.querySelector('#film-count')

function filterFilms() {
  const query = search.value.trim().toLocaleLowerCase()
  let shown = 0
  for (const card of cards) {
    const visible = card.dataset.title.includes(query) && (!mechanism.value || card.dataset.mechanism === mechanism.value)
    card.hidden = !visible
    if (visible) shown++
  }
  count.textContent = `${shown} ${shown === 1 ? 'film' : 'films'}`
}

search.addEventListener('input', filterFilms)
mechanism.addEventListener('change', filterFilms)
