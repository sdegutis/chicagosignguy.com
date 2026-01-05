import { type Blog } from "../build.ts"
import { Html } from "./common.tsx"

export function RenderHome(blogs: Blog[]) {
  return <Html title="Chicago Sign Guy">
    <h1>Chicago Sign Guy (Steven)</h1>
    <p><img src="/img/me.jpg" /></p>
    <ul>
      {blogs.map(blog => <>
        <li>({blog.date.toLocaleDateString()}) <a href={blog.path}>{blog.title}</a></li>
      </>)}
    </ul>
  </Html>
}
