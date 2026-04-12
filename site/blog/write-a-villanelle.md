---
title: Write a Villanelle
image: /img/moviestills/Screenshot_2025-12-19_132133.png
date: 2026-04-12
list: Thoughts
---

Here's a little tool I made to help me write a [villanelle](https://en.wikipedia.org/wiki/Villanelle) for my book.
Feel free to use it yourself if you want.

(The image above is from [my favorite movie](/blog/my-favorite-film.html).)

<div id='villanelle'>

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
