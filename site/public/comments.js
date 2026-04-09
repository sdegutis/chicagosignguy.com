const container = document.getElementById('comments')
const blogid = container.className

let html

try {
  html = await fetch(`https://the.chicagosignguy.com/comments/${blogid}`)
    .then(r => r.text())
}
catch {
}

if (!html) html = '<p><i>No comments yet.</i></p>'

container.innerHTML = html
