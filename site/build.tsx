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
        <link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet"></link>

      </head>
      <body>

        <header>
          <span><a href="/">ChicagoSignGuy.com</a></span>
          <nav>
            <ul>
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

    <p>
      Hi, I'm Steven.
      Je suis un homme sans importance,
      et je ne parle pas Français.
    </p>
    <p>
      On Sundays I do public surveys in Chicago.
      Here is a picture that a talented young woman drew of me.
    </p>

    <p><img src="/img/me.jpg" /></p>

    <AllArticles blogs={blogs} />

  </Html>
}

function AboutPage() {
  return <Html title="About me">

    <p><img src="/img/me.jpg" /></p>

    <p>
      My name is Steven.
      I'm a successful software engineer and best selling author.
    </p>

    <p>
      On Sundays, I do public surveys in Chicago,
      on the corner of State and Randolph, from Noon to 6pm.
      This year, I plan to publish a book of my experiences.
    </p>

  </Html>
}

function AllArticles(data: { blogs: Blog[], blog?: Blog }) {
  return <>
    <h2>All articles</h2>
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

    <aside>
      <h2>Leave a comment</h2>
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

    <AllArticles blogs={blogs} blog={blog} />

  </Html>
}
