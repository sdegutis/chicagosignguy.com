import { Html } from "./common.tsx"

export function BlogPage(title: string, image: string, body: string) {
  return <Html title={title}>
    <h1>{title}</h1>
    <p><img src={image} /></p>
    <p>{body}</p>
  </Html>
}
