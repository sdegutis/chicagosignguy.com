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
    pipeline.add(path, BlogPage(title, image, html))
  })

  blogs.sort((a, b) => -(b.date < a.date))

  pipeline.with('^/public/').do(f => {
    pipeline.add(f.path.slice('/public'.length), f.content)
  })

  pipeline.add('/index.html', HomePage(blogs))

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
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet"></link>

      </head>
      <body>

        <header>
          <span>ChicagoSignGuy.com</span>
          <nav>
            <ul>
              <li><a href='/'>All articles</a></li>
              <li><a href='https://open.spotify.com/playlist/2Lf21iQ0NprqPAFL7XkGCp?si=89d2636cc53b443d'>Spotify playlist</a></li>
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
    <p><img src="/img/me.jpg" /></p>
    <h2>About Me</h2>
    <p>My name is Steven. I am not an important person.</p>
    <h2>All Articles</h2>
    <ul style='padding: 0; list-style-type: none'>
      {blogs.map(blog => <>
        <li>{blog.date.toLocaleDateString('en-US', { dateStyle: 'medium' })}, <a href={blog.path}>{blog.title}</a></li>
      </>)}
    </ul>
  </Html>
}

function BlogPage(title: string, image: string, body: string) {
  return <Html title={title}>
    <h1>{title}</h1>
    <p><img src={image} /></p>
    <p>{body}</p>
  </Html>
}
