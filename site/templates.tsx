import { type Blog } from "./build.ts"

export function Html(attrs: { title: string, children: any }) {
  return <>
    {'<!DOCTYPE html>'}
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{attrs.title}</title>
        <link rel="stylesheet" href="/css/base.css" />
      </head>
      <body>

        <header>
          <nav>
            <ul>
              <li>Chicago Sign Guy</li>
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

export function RenderHome(blogs: Blog[]) {
  return <Html title="Chicago Sign Guy">
    <p><img src="/img/me.jpg" /></p>
    <ul>
      {blogs.map(blog => <>
        <li>({blog.date.toLocaleDateString()}) <a href={blog.path}>{blog.title}</a></li>
      </>)}
    </ul>
  </Html>
}

export function BlogPage(title: string, image: string, body: string) {
  return <Html title={title}>
    <h1>{title}</h1>
    <p><img src={image} /></p>
    <p>{body}</p>
  </Html>
}
