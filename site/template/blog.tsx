export function BlogPage(title: string, image: string, body: string) {
  return <>
    <h1>{title}</h1>
    <p><img src={image} /></p>
    <p>{body}</p>
  </>
}
