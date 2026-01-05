import * as FrontMatter from 'front-matter'
import { FileTree } from "immaculata/filetree.js"
import { Pipeline } from 'immaculata/pipeline.js'
import MarkdownIt from 'markdown-it'
import { BlogPage } from './template/blog.tsx'
import { RenderHome } from './template/home.tsx'

export interface Blog {
  path: string
  title: string
  image: string
  html: string
}

const md = new MarkdownIt({})
const fm = FrontMatter.default as unknown as typeof FrontMatter['default']['default']

export function processSite(tree: FileTree) {
  const pipeline = Pipeline.from(tree.files)

  const blogs: Blog[] = []

  pipeline.with('\.md$').do(file => {
    const text = file.content.toString('utf8')
    const { attributes, body } = fm(text)
    const { title, image } = attributes as Record<string, string>
    const html = md.render(body)

    const path = file.path.replace('.md', '.html')
    blogs.push({ path, title, image, html })

    pipeline.add(path, BlogPage(title, image, html))
  })

  pipeline.with('^/public/').do(f => {
    pipeline.add(f.path.slice('/public'.length), f.content)
  })

  pipeline.add('/index.html', RenderHome(blogs))

  return pipeline.results()
}
