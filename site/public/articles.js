const container = document.getElementById('article-list')
const articles = [...document.querySelectorAll('[data-group]')]
const order = container.dataset.order.split(',')
const htag = container.querySelector('h2,h3').tagName
let dir = -1
let ran = sortByType

sortByType()

setupButton('article-list-sorter-date', sortByDate)
setupButton('article-list-sorter-type', sortByType)

function setupButton(id, run) {
  document.getElementById(id).onclick = e => {
    e.preventDefault()

    if (ran === run)
      dir *= -1
    else
      ran = run

    run()
  }
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

function sorter(a, b) {
  return (+a.dataset.date - +b.dataset.date) * dir
}

function show(nodes) {
  const ul = document.createElement('ul')
  ul.className = 'articles'
  ul.append(...nodes)
  container.replaceChildren(ul)
}
