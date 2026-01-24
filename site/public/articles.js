const container = document.getElementById('article-list')
const articles = [...document.querySelectorAll('[data-group]')]
const order = container.dataset.order.split(',')
const htag = container.querySelector('h2,h3').tagName
let dir = -1
let ran = sortByType

sortByType()

document.getElementById('article-list-sorter-date').onclick = e => {
  e.preventDefault()
  sortAndRun(sortByDate)
}

document.getElementById('article-list-sorter-type').onclick = e => {
  e.preventDefault()
  sortAndRun(sortByType)
}

function sortAndRun(run) {
  if (ran === run)
    dir *= -1
  else
    ran = run

  run()
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

  list(nodes)
}

function sortByDate() {
  articles.sort(sorter)
  list(articles)
}

function sorter(a, b) {
  return (+a.dataset.date - +b.dataset.date) * dir
}

function list(nodes) {
  const ul = document.createElement('ul')
  ul.className = 'articles'
  ul.append(...nodes)
  container.replaceChildren(ul)
}
