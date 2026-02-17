const container = document.getElementById('comments')
const blogid = container.className

const html = await fetch(`https://the.chicagosignguy.com/comments/${blogid}`)
  .then(r => r.text())

container.innerHTML = html
