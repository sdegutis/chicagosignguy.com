import * as FrontMatter from 'front-matter'
import { FileTree } from "immaculata/filetree.js"
import { Pipeline } from 'immaculata/pipeline.js'
import MarkdownIt from 'markdown-it'

export interface Blog {
  path: string
  title: string
  image: string
  html: string
  date: Date
}

const md = new MarkdownIt({})
const fm = FrontMatter.default as unknown as typeof FrontMatter['default']['default']

export function processSite(tree: FileTree) {
  const pipeline = Pipeline.from(tree.files)

  const blogs: Blog[] = []

  pipeline.with('\.md$').do(file => {
    const text = file.content.toString('utf8')
    const { attributes, body } = fm(text)
    const { title, image, date: dateObj } = attributes as Record<string, any>
    const html = md.render(body)
    const date = dateObj as Date
    const path = file.path.replace('.md', '.html')
    blogs.push({ path, title, image, html, date })
  })
  blogs.sort((a, b) => -(b.date < a.date))

  for (const blog of blogs) {
    pipeline.add(blog.path, BlogPage(blog, blogs))
  }

  pipeline.with('^/public/').do(f => {
    pipeline.add(f.path.slice('/public'.length), f.content)
  })

  pipeline.add('/index.html', HomePage(blogs))
  pipeline.add('/about.html', AboutPage())
  pipeline.add('/articles.html', AllArticlesPage(blogs))

  return pipeline.results()
}

function Html(attrs: { title: string, children: any }) {
  return <>
    {'<!DOCTYPE html>'}
    <html lang="en">
      <head>

        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{attrs.title}</title>
        <link rel="stylesheet" href={"/css/base.css?" + Date.now()} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin='' />
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Mako&display=swap" rel="stylesheet"></link>

      </head>
      <body>

        <header>
          <nav>
            <ul>
              <li><a href="/">ChicagoSignGuy.com</a></li>
              <li><a href='/about.html'>About</a></li>
              <li><a href='/articles.html'>Articles</a></li>
              <li><a href='https://open.spotify.com/playlist/2Lf21iQ0NprqPAFL7XkGCp?si=89d2636cc53b443d'>Playlist</a></li>
            </ul>
          </nav>
        </header>

        <main>
          {attrs.children}
        </main>

        <footer>&copy; 2025-2026 Steven</footer>

      </body>
    </html>
  </>
}

function HomePage(blogs: Blog[]) {
  return <Html title="Chicago Sign Guy">

    <h1>Chicago Sign Guy</h1>

    <p>
      Hi, I'm <a href="/about.html">Steven</a>.
      You may know me from making funny signs or doing public surveys in Chicago.
    </p>

    <p>
      Je suis un homme insignifiant.
      (Je ne parle pas français; je trouve simplement que c'est une belle langue.)
    </p>

    <p>
      <img src="/img/me.jpg" />
      <small style='font-style: italic'>A portrait that a talented young woman drew of me in a coffee shop.</small>
    </p>

    <h2>All articles</h2>
    <AllArticles blogs={blogs} />

  </Html>
}

function AboutPage() {
  return <Html title="About me">

    <h1>About me</h1>

    <p>
      <img src="/img/me.jpg" /><br />
      <small style='font-style: italic'>A portrait that a talented young woman drew of me in a coffee shop.</small>

    </p>

    <p>
      My name is Steven.
      I'm a successful software engineer and best selling author.
      But I feel deeply unfulfilled.
      I think I'm meant for more than making banks richer.
    </p>

    <p>
      But I don't know what my purpose is, or how I can help anyone.
      I don't know what God wants from me, and he won't tell me.
      So I'm trying to figure it out my own way.
    </p>

    <p>
      That's why I do public surveys in Chicago on Sundays,
      on the corner of State and Randolph, from Noon to 6.
      This year, I plan to publish a book of my experiences.
    </p>

    <p>
      I choose topics I'm trying to understand better about myself, and which seem to be common conundrums.
      Love, despair, hope, anxiety, happiness, trauma, destiny.
    </p>

    <p>
      As a Catholic, I look at these topics through that lens.
      But ancient theologians didn't anticipate a world with OF, SSRIs, and algorithms.
      And modern theologians have lost the plot.
      Maybe together we can find answers.
    </p>

    <p>
      A secondary and unlikely goal is to make friends.
      But I've never found anyone that I really click with.
      People find me fun, but I find that same "fun" boring.
      I just can't imagine who I could ever possibly vibe with.
    </p>

    <p>
      A tertiary and extremely unrealistic goal is to fall in love.
      Some day I'd like to know what it feels like,
      and not just to be used for my body or wallet.
      But I've never met anyone with the same dream,
      someone who's willing to go on $0 dates and be 100% celibate and sober. Oh well.
    </p>

    <p>
    </p>

  </Html>
}

function AllArticles(data: { blogs: Blog[], blog?: Blog }) {
  return <>
    <ul style='padding: 0; list-style-type: none'>
      {data.blogs.map(blog => <>
        <li class={data.blog == blog ? 'currentblog' : ''}>
          {blog.date.toLocaleDateString('en-US', { dateStyle: 'medium' })} <a href={blog.path}>{blog.title}</a>
        </li>
      </>)}
    </ul>
  </>
}

function AllArticlesPage(blogs: Blog[]) {
  return <Html title="All Articles">
    <h1>All articles</h1>
    <AllArticles blogs={blogs} />
  </Html>
}

function BlogPage(blog: Blog, blogs: Blog[]) {
  return <Html title={blog.title}>

    <article>
      <h1>{blog.title}</h1>
      <p><img src={blog.image} /></p>
      <p>{blog.html}</p>
    </article>

    <h2>Leave a comment</h2>
    <aside>
      <p>
        To share your thoughts,
        come find me in Chicago
        on Sundays, from about Noon to 6pm,
        at the corner of State and Randolph,
        and tell me in person.
      </p>
      <p>
        To leave a comment that others can also see,
        stop by at precisely 3pm,
        when others will also be present,
        and share your thoughts with all of us.
      </p>
    </aside>

    <h2>All articles</h2>
    <AllArticles blogs={blogs} blog={blog} />

  </Html>
}
