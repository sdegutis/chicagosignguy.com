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
          <h1>Chicago Sign Guy (Steven)</h1>
        </header>

        <nav>
          <ul>
            <li><a href='/'>All articles</a></li>
            <li><a href='/'>Spotify playlist</a></li>
          </ul>
        </nav>

        <main>
          {attrs.children}
        </main>

        <footer>&copy; 2025-2026 Steven</footer>

      </body>
    </html>
  </>
}
