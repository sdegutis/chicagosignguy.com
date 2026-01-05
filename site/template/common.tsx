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
        {attrs.children}
      </body>
    </html>
  </>
}
