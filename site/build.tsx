import * as FrontMatter from 'front-matter'
import { FileTree } from "immaculata/filetree.js"
import { Pipeline } from 'immaculata/pipeline.js'
import MarkdownIt from 'markdown-it'

const isDev = process.argv[2] == 'dev'

interface Blog {
  path: string
  title: string
  image: string
  html: string
  list: string
  date: Date
  draft: boolean | undefined
}

type Blogs = [string, Blog[]][]

const md = new MarkdownIt({ html: true, typographer: true })
const fm = FrontMatter.default as unknown as typeof FrontMatter['default']['default']

const order = [
  'Surveys',
  'Thoughts',
  'Experiments',
  'Jokes',
]

export function processSite(tree: FileTree) {
  const pipeline = Pipeline.from(tree.files)

  const blogs: Blog[] = []

  pipeline.with('\.md$').do(file => {
    const text = file.content.toString('utf8')
    const { attributes, body } = fm(text)
    const { title, image, date: dateObj, list, draft } = attributes as {
      title: string
      image: string
      date: Date
      list: string
      draft?: boolean
    }
    if (draft && !isDev) return

    const html = md.render(body)
    const date = new Date(+dateObj + 1000 * 60 * 60 * 12)
    const path = file.path.replace('.md', '.html')
    blogs.push({ path, draft, title, image, html, date, list })
  })
  blogs.sort((a, b) => -(b.date < a.date))

  const posts = Object.entries(Object.groupBy(blogs, blog => blog.list))
    .sort((a, b) => order.indexOf(b[0]) - order.indexOf(a[0]))
    .reverse() as Blogs

  for (const blog of blogs) {
    pipeline.add(blog.path, BlogPage(blog, posts))
  }

  pipeline.with('^/public/').do(f => {
    pipeline.add(f.path.slice('/public'.length), f.content)
  })

  pipeline.add('/index.html', HomePage(posts))
  pipeline.add('/about.html', AboutPage())
  pipeline.add('/commented.html', <Html title="The comment thing worked.">
    <p>Thanks for your comment, it looks great, very thoughtful. Other people will agree probably.</p>
  </Html>)
  pipeline.add('/signedup.html', <Html title="You are now signed up.">
    <p>Thanks for signing up, you will receive emails sometimes now.</p>
  </Html>)
  pipeline.add('/404.html', <Html title="Page not found">
    <p>Also how'd you even get here?</p>
  </Html>)
  pipeline.add('/book.html', BookPage())
  pipeline.add('/articles.html', AllArticlesPage(posts))
  // pipeline.add('/playlist.html', PlaylistPage())

  return pipeline.results()
}

function Html(attrs: { title: string, image?: string, children: any }) {
  return <>
    {'<!DOCTYPE html>'}
    <html lang="en">
      <head>

        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{attrs.title} - Chicago Sign Guy's Website</title>
        <link rel="stylesheet" href={"/css/base.css?" + Date.now()} />

        {attrs.image && <>
          <meta property="og:image" content={'https://chicagosignguy.com' + attrs.image}></meta>
        </>}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin='' />
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Mako&display=swap" rel="stylesheet"></link>

      </head>
      <body>

        <header>
          <nav>
            <ul>
              <li><a href="/">ChicagoSignGuy.com</a></li>
              <li><a href='/about.html'>Author</a></li>
              <li><a href='/articles.html'>Articles</a></li>
              <li><a href='/book.html'>Book</a></li>
            </ul>
          </nav>
        </header>

        <main>
          <h1>{attrs.title}</h1>
          {attrs.children}
        </main>

        <footer>&copy; 2025-<script>{`document.write(new Date().getFullYear())`}</script> ChicagoSignGuy.com, All Rights Reserved.</footer>

      </body>
    </html>
  </>
}

function HomePage(blogs: Blogs) {
  return <Html title="Chicago Sign Guy">

    <article>
      <p>
        Hi. I'm <a href="/about.html">Steven</a>.
      </p><p>
        I do public surveys in Chicago.
      </p><p>
        Usually I write <a href="/articles.html">articles</a> about them.
      </p><p>
        Eventually I'll write a <a href="/book.html">book</a> too.
      </p>
    </article>

    <aside>
      <h3>Update, March 26th</h3>
      <p><i>Comments, mailing list, and my email have been disabled to cut costs.</i></p>
    </aside>

  </Html>
}

function PlaylistPage() {
  return <Html title="Playlist">

    <p>
      I believe you can tell a lot about a person's character
      by the songs they love,
      like glass resonating at a certain frequency.
    </p>

    <iframe
      data-testid="embed-iframe"
      style="border-radius:12px"
      src="https://open.spotify.com/embed/playlist/2Lf21iQ0NprqPAFL7XkGCp?utm_source=generator"
      width="100%"
      height="400"
      frameborder="0"
      allowfullscreen
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy" />

    <h2>Bonus tracks</h2>

    <ul class='articles'>
      <li><i>a french girl singing <a href='https://www.youtube.com/watch?v=QwoF1-1QgwA'>je te laisserai des mots</a> while it rains</i></li>
      <li><i>hozier singing <a href='https://www.youtube.com/watch?v=1nnRC6jDOCI'>take me to church</a> in an nyc subway</i></li>
      <li><i>the only good <a href="https://www.youtube.com/watch?v=J_sH-GrUeUw&t=22s">creep</a> live performance by radiohead</i></li>
      <li><i>tool performing a better version of their song <a href='https://www.youtube.com/watch?v=EgDwkSlCwHw'>pushit</a></i></li>
      <li><i>aaron lewis's acoustic cover of <a href="https://www.youtube.com/watch?v=EEaLxw3Gpp8">black</a> by pearl jam</i></li>
      <li><i>emotional cover of <a href='https://www.youtube.com/watch?v=nfuYmE1CxP4&t=44s'>exit music (for a film)</a> at a talent show</i></li>
      <li><i>unique version of <a href='https://www.youtube.com/watch?v=ze5fxkUcpbc&t=1959s'>King of glory, King of peace</a> in Mass</i></li>
    </ul>

  </Html>
}

function AllArticles(data: { blogs: Blogs, blog?: Blog, tag?: string }) {
  const H = data.tag ?? 'h3'
  return <>
    <div>
      Sorted by { }
      <a href='#' id='article-list-sorter-date'>date</a>
      { } or { }
      <a href='#' id='article-list-sorter-type'>type</a>,
      { } with <a href='#' id='article-list-sorter-dir'>newest</a> first.
    </div>
    <div id='article-list' data-order={order.join(',')}>
      {data.blogs.map(([title, blogs]) => <>
        <H>{title}</H>
        <ul class='articles'>
          {blogs.map(blog => <>
            <li class={data.blog == blog ? 'currentblog' : ''} data-group={title} data-date={blog.date.getTime()}>
              <a href={blog.path}>{blog.title} {blog.draft && <b>(draft)</b>}</a> {blog.date.toLocaleDateString('en-US', { dateStyle: 'medium' })}
            </li>
          </>)}
        </ul>
      </>)}
    </div>
    {/* <H>Planned</H>
    <ul class='articles'>
      <li>Survey: How did you meet your friends?</li>
      <li>Survey: Is there a loneliness epidemic?</li>
      <li>Article: Anxiety, confidence, fear, arrogance</li>
      <li>Article: Love, purpose, burnout, motivation</li>
      <li>Article: Masculinity, femininity, destiny, Eden</li>
      <li>Experiment: Live upvote/downvote in person</li>
      <li>Experiment: Podcast episode with 100 cohosts</li>
      <li>Experiment: Free 3 minute trauma dumping</li>
      <li>Experiment: Trade hats, second try</li>
      <li>Discussion: What is masculinity?</li>
      <li>Discussion: What is femininity?</li>
      <li>Discussion: How do you fall in love?</li>
    </ul> */}
    <script src='/articles.js' />
  </>
}

function AllArticlesPage(blogs: Blogs) {
  return <Html title="All Articles">
    <AllArticles blogs={blogs} tag="h2" />
  </Html>
}

function BlogPage(blog: Blog, blogs: Blogs) {
  const blogid = blog.path.slice('/blog/'.length, -'.html'.length)

  return <Html image={blog.image} title={`${blog.list.slice(0, -1)}: ${blog.title}`}>

    {blog.draft &&
      <div style='position:sticky; top:3em; font-weight:bold; background:var(--b); color:var(--h)'>
        (DRAFT)
      </div>
    }

    <article>
      <p>
        <img src={blog.image} />
        <br />
        <span id='main-article' />
        <small style='font-style: italic'>Written on {blog.date.toLocaleDateString('en-US', { dateStyle: 'long' })}</small>
      </p>

      <p>
        <a href="#" onclick="shareThisPage(); return false">Share this article</a> with curious people.
      </p>

      {blog.html}
    </article>

    <p><a href='#main-article' class='back-to-top'>Back to top</a></p>

    <h2>Leave a comment</h2>
    <aside>
      <p><i>Comments and email have been disabled to cut costs.</i></p>
    </aside>

    <h2>All articles</h2>
    <AllArticles blogs={blogs} blog={blog} />

  </Html>
}

function AboutPage() {
  return <Html title="About me">

    <article>

      <figure>
        <img src="/img/me.jpg" />
        <figcaption>
          A portrait that a talented young woman drew of me in a coffee shop.
        </figcaption>
      </figure>

      <p>
        My name is Steven.
        I'm a successful software engineer and best selling author.
        But I feel deeply <b>unfulfilled</b>.
        I think I'm meant for more than making banks richer.
      </p>

      <p>
        But I don't know what my <b>purpose</b> is, or how I can help anyone.
        I don't know what God wants from me, and he won't tell me.
        So I'm trying to figure it out my own way.
      </p>

      <p>
        That's why I do public <b>surveys</b> in Chicago on Sundays,
        on the corner of State and Randolph, from Noon to 6.
        Every week, I write new <a href="/articles.html">articles</a> based on the experiences.
      </p>

      <p>
        I choose topics I'm trying to <b>understand</b> better about myself,
        and which seem to be common conundrums.
        Love, despair, hope, anxiety, happiness, trauma, destiny.
      </p>

      <p>
        As a <b>Catholic</b>, I look at these topics through that lens.
        But ancient theologians didn't anticipate a world with OF, SSRIs, and algorithms.
        And modern theologians have lost the plot.
        Maybe together we can find answers.
      </p>

      <p>
        So by late 2026, I plan to publish a <a href="/book.html">book</a> on all this.
      </p>

      {/* <p>
        I also made a <a href="/playlist.html">Spotify playlist</a> of my favorite songs ever.
      </p> */}

    </article>

  </Html>
}

function BookPage() {
  return <Html title="Book">

    <article>

      <p>
        I'm working on a book called "What is love?", partly based on my surveys,
        results and discussions they've led to.
        I plan to publish it by autumn of 2026.
      </p>

      <p><img src='/img/bookcover1.jpg' alt="My new book's cover" /></p>

    </article>

  </Html>
}
