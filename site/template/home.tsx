import { type Blog } from "../build.ts"

export function RenderHome(blogs: Blog[]) {
  return <>
    <h1>Chicago Sign Guy (Steven)</h1>
    <p><img src="/img/me.jpg" /></p>
    <ul>
      {blogs.map(blog => <>
        <li><a href={blog.path}>{blog.title}</a></li>
      </>)}
    </ul>
  </>
}
