import { type Blog } from "../build.ts"

export function RenderHome(blogs: Blog[]) {
  return <>
    <ul>
      {blogs.map(blog => <>
        <li><a href={blog.path}>{blog.title}</a></li>
      </>)}
    </ul>
  </>
}
