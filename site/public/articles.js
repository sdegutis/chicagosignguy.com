const container = document.getElementById('article-list')
const direction = document.getElementById('article-list-sorter-dir')
const articles = [...document.querySelectorAll('[data-group]')]
const order = container.dataset.order.split(',')
const htag = container.querySelector('h2,h3').tagName

let dir = -1
let ran = sortByDate

setupButton('article-list-sorter-date', sortByDate)
setupButton('article-list-sorter-type', sortByType)

ran()

function setupButton(id, run) {
  document.getElementById(id).onclick = e => {
    e.preventDefault()
    ran = run
    ran()
  }
}

direction.onclick = e => {
  e.preventDefault()
  dir *= -1
  direction.textContent = ['oldest', 'newest'][+(dir < 0)]
  ran()
}

function sortByType() {
  const groups = Object.groupBy(articles, article =>
    article.dataset.group)

  const nodes = []

  for (const group of order) {
    const items = groups[group]
    if (!items?.length) continue

    const header = document.createElement(htag)
    header.textContent = group

    items.sort(sorter)

    nodes.push(header)
    nodes.push(...items)
  }

  show(nodes)
}

function sortByDate() {
  articles.sort(sorter)
  show(articles)
}

// No need for comparisons; let math do it for you
function sorter(a, b) {
  return (+a.dataset.date - +b.dataset.date) * dir
}

function show(nodes) {
  const ul = document.createElement('ul')
  ul.className = 'articles'
  ul.append(...nodes)
  container.replaceChildren(ul)
}
