---
title: Write a Villanelle
image: /img/moviestills/Screenshot_2025-12-19_132133.png
date: 2026-04-12
list: Thoughts
---

(The image above is from [my favorite movie](/blog/my-favorite-film.html).)

Here's a little tool I made to help me write a [villanelle](https://en.wikipedia.org/wiki/Villanelle) for my book.
Feel free to use it yourself if you want.

When you're done writing it,
click here to <a href='#' download='villanelle' onclick='this.href=`data:text/plain;charset=utf-8,${encodeURIComponent(villanelle.textContent)}`'>download</a> the file.

To rework one you've downloaded,
click here to <a href='#' onclick='doimport(event)'>import</a> and edit it.

<script>
  function doimport(e) {
    e.preventDefault()
    const input = document.createElement('input')
    input.type='file'
    input.onchange = e => {
      const reader = new FileReader()
      reader.onload = () => {
        const lines = reader.result
          .split(/\r?\n/)
          .map(s => s.trim())
          .filter(s => s)
        const spans = document.querySelectorAll('#villanelle span')
        for (let i = 0; i < spans.length; i++)
          spans[i].innerText = lines[i]
      }
      reader.readAsText(input.files[0])
    }
    input.click()
  }
</script>

<style>
  #villanelle span {
    display: block;
    width: 100%;
    font: inherit;
    min-height: 1em;
    border-bottom: 1px dashed var(--h);
    text-align: left;

    &:focus {
      outline: none;
      border-bottom-style: solid;
    }
  }
</style>

<div id='villanelle'>

<p>
  <span contenteditable oninput="for (const el of document.querySelectorAll('#villanelle .a')) el.innerHTML = this.innerHTML"></span>
  <span contenteditable></span>
  <span contenteditable oninput="for (const el of document.querySelectorAll('#villanelle .b')) el.innerHTML = this.innerHTML"></span>
</p>

<p>
  <span contenteditable></span>
  <span contenteditable></span>
  <span contenteditable class="a"></span>
</p>

<p>
  <span contenteditable></span>
  <span contenteditable></span>
  <span contenteditable class="b"></span>
</p>

<p>
  <span contenteditable></span>
  <span contenteditable></span>
  <span contenteditable class="a"></span>
</p>

<p>
  <span contenteditable></span>
  <span contenteditable></span>
  <span contenteditable class="b"></span>
</p>

<p>
  <span contenteditable></span>
  <span contenteditable></span>
  <span contenteditable class="a"></span>
  <span contenteditable class="b"></span>
</p>

</div>
