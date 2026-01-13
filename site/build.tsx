import * as FrontMatter from 'front-matter'
import { FileTree } from "immaculata/filetree.js"
import { Pipeline } from 'immaculata/pipeline.js'
import MarkdownIt from 'markdown-it'

interface Blog {
  path: string
  title: string
  image: string
  html: string
  list: string
  date: Date
}

type Blogs = [string, Blog[]][]

const md = new MarkdownIt({ html: true })
const fm = FrontMatter.default as unknown as typeof FrontMatter['default']['default']

export function processSite(tree: FileTree) {
  const pipeline = Pipeline.from(tree.files)

  const blogs: Blog[] = []

  pipeline.with('\.md$').do(file => {
    const text = file.content.toString('utf8')
    const { attributes, body } = fm(text)
    const { title, image, date: dateObj, list, draft } = attributes as {
      title: string
      image: string
      date: Date
      list: string
      draft?: boolean
    }
    if (draft) return

    const html = md.render(body)
    const date = new Date(+dateObj + 1000 * 60 * 60 * 12)
    const path = file.path.replace('.md', '.html')
    blogs.push({ path, title, image, html, date, list })
  })
  blogs.sort((a, b) => -(b.date < a.date))

  const order = [
    'Surveys',
    'Thoughts',
    'Jokes',
    'Experiments',
  ]

  const posts = Object.entries(Object.groupBy(blogs, blog => blog.list))
    .sort((a, b) => order.indexOf(b[0]) - order.indexOf(a[0]))
    .reverse() as Blogs

  for (const blog of blogs) {
    pipeline.add(blog.path, BlogPage(blog, posts))
  }

  pipeline.with('^/public/').do(f => {
    pipeline.add(f.path.slice('/public'.length), f.content)
  })

  pipeline.add('/index.html', HomePage(posts))
  pipeline.add('/about.html', AboutPage())
  pipeline.add('/playlist.html', PlaylistPage())
  pipeline.add('/articles.html', AllArticlesPage(posts))

  return pipeline.results()
}

function Html(attrs: { title: string, children: any }) {
  return <>
    {'<!DOCTYPE html>'}
    <html lang="en">
      <head>

        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{attrs.title} - Chicago Sign Guy's Website</title>
        <link rel="stylesheet" href={"/css/base.css?" + Date.now()} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin='' />
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Mako&display=swap" rel="stylesheet"></link>

      </head>
      <body>

        <header>
          <nav>
            <ul>
              <li><a href="/">ChicagoSignGuy.com</a></li>
              <li><a href='/about.html'>About</a></li>
              <li><a href='/articles.html'>Articles</a></li>
              <li><a href='/playlist.html'>Playlist</a></li>
            </ul>
          </nav>
        </header>

        <main>
          <h1>{attrs.title}</h1>
          {attrs.children}
        </main>

        <footer>&copy; 2025-<script>{`document.write(new Date().getFullYear())`}</script> Steven</footer>

      </body>
    </html>
  </>
}

function HomePage(blogs: Blogs) {
  return <Html title="Chicago Sign Guy">

    <article>
      <p>
        Hi, I'm <a href="/about.html">Steven</a>.
        You may know me from making funny signs or doing public surveys in Chicago.
        This website is where I document all the survey results,
        and write down all my other thoughts as well.
      </p>

      <figure>
        <img src="/img/me.jpg" />
        <figcaption>
          A portrait that a talented young woman drew of me in a coffee shop.
        </figcaption>
      </figure>
    </article>

    <h2>All articles</h2>
    <AllArticles blogs={blogs} />

    <h2>Upcoming book</h2>
    <p><img src='/img/bookcover1.jpg' alt="My new book's cover" /></p>
    <p>
      I'm starting to write a book based on the surveys, the results and discussions they've led to,
      and my own thoughts and wonderings about these topics.
    </p>
    <p>
      It's called "What is love?"
      and I plan to release it before Thanksgiving 2026, so it can be a good Christmas gift.
      If there's enough interest, I might offer a preorder,
      which will help fund the time it takes me to write it.
    </p>

  </Html>
}

function AboutPage() {
  return <Html title="About me">

    <article>

      <figure>
        <img src="/img/me.jpg" />
        <figcaption>
          A portrait that a talented young woman drew of me in a coffee shop.
        </figcaption>
      </figure>

      <p>
        My name is Steven.
        I'm a successful software engineer and best selling author.
        But I feel deeply <b>unfulfilled</b>.
        I think I'm meant for more than making banks richer.
      </p>

      <p>
        But I don't know what my <b>purpose</b> is, or how I can help anyone.
        I don't know what God wants from me, and he won't tell me.
        So I'm trying to figure it out my own way.
      </p>

      <p>
        That's why I do public <b>surveys</b> in Chicago on Sundays,
        on the corner of State and Randolph, from Noon to 6.
        This year, I plan to publish a book of my experiences.
      </p>

      <p>
        I choose topics I'm trying to <b>understand</b> better about myself, and which seem to be common conundrums.
        Love, despair, hope, anxiety, happiness, trauma, destiny.
      </p>

      <p>
        As a <b>Catholic</b>, I look at these topics through that lens.
        But ancient theologians didn't anticipate a world with OF, SSRIs, and algorithms.
        And modern theologians have lost the plot.
        Maybe together we can find answers.
      </p>

      {/* <p>
        A secondary and unlikely goal is to make friends.
        But I've never found anyone that I really click with.
        People find me fun, but I find that same "fun" boring.
        I just can't imagine who I could ever possibly vibe with.
      </p>

      <p>
        A tertiary and extremely unrealistic goal is to fall in love.
        Some day I'd like to know what it feels like,
        and not just to be used for my body or wallet.
        But I've never met anyone with the same dream,
        someone who's willing to go on $0 dates and be 100% celibate and sober. Oh well.
      </p> */}

      <p>
        Je suis un homme <b>insignifiant</b>, presque inutile, incapable d'aider qui que ce soit.
        Je ne parle pas français, je trouve simplement que c'est une belle langue.
        J'aimerais vraiment trouver le temps de l'apprendre un jour, peut-être.
        (<a href="https://youtu.be/O_xMgyLuZ2I?t=3682" target='_blank'>Mais n'importe quoi!</a>)
      </p>

      <p>
        If for some reason you still want to know more about me, take a look at my <a href="/playlist.html">autobiography</a>,
        as well as my two websites <a href="https://ImmaculataLibrary.com" target='_blank'>ImmaculataLibrary.com</a> and <a href="https://90s.dev">90s.dev</a>,
        which, along with this website, form my three magna opera, each the most beautiful I can make per genre.
      </p>

    </article>

  </Html>
}

function PlaylistPage() {
  return <Html title="Autobiography of Songs">

    <article>

      <p>
        This tells the story of my life in 73 songs,
        from beginning to likely end,
        with "Every Day is Exactly the Same"
        (#70)
        being where I'm at right now in life.
      </p>

      <h2 style='float:left; margin:0 .33em 0 0; line-height: .73em'>Act I</h2>
      <p style='margin-top:0'>
        The first moments of my life,
        followed by trauma and disillusionment,
        and ending with becoming an outcast.
      </p>

      <h2 style='float:left; margin:0 .33em 0 0; line-height: .73em'>Act II</h2>
      <p style='margin-top:0'>
        The only relationship I had,
        followed by trauma and disillusionment,
        and ending with me leaving her.
      </p>

      <h2 style='float:left; margin:0 .33em 0 0; line-height: .73em'>Act III</h2>
      <p style='margin-top:0'>
        My conversion to Catholicism,
        followed by trauma and disillusionment,
        and ending with victory.
      </p>

      <iframe
        data-testid="embed-iframe"
        style="border-radius:12px"
        src="https://open.spotify.com/embed/playlist/2Lf21iQ0NprqPAFL7XkGCp?utm_source=generator"
        width="100%"
        height="400"
        frameborder="0"
        allowfullscreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy" />

    </article>

    <h2>Bonus tracks</h2>

    <p>(These are only available on YouTube unfortunately.)</p>

    <ul class='articles'>
      <li><i>a french girl singing <a href='https://www.youtube.com/watch?v=QwoF1-1QgwA'>je te laisserai des mots</a> while it rains</i></li>
      <li><i>hozier singing <a href='https://www.youtube.com/watch?v=1nnRC6jDOCI'>take me to church</a> in an nyc subway</i></li>
      <li><i>the only good <a href="https://www.youtube.com/watch?v=J_sH-GrUeUw&t=22s">creep</a> live performance by radiohead</i></li>
      <li><i>tool performing a better version of their song <a href='https://www.youtube.com/watch?v=EgDwkSlCwHw'>pushit</a></i></li>
      <li><i>aaron lewis's acoustic cover of <a href="https://www.youtube.com/watch?v=EEaLxw3Gpp8">black</a> by pearl jam</i></li>
      <li><i>emotional cover of <a href='https://www.youtube.com/watch?v=nfuYmE1CxP4&t=44s'>exit music (for a film)</a> at a talent show</i></li>
      <li><i>unique version of <a href='https://www.youtube.com/watch?v=ze5fxkUcpbc&t=1959s'>King of glory, King of peace</a> in Mass</i></li>
    </ul>

  </Html>
}

function AllArticles(data: { blogs: Blogs, blog?: Blog, tag?: string }) {
  const H = data.tag ?? 'h3'
  return <>
    {data.blogs.map(([title, blogs]) => <>
      <H>{title}</H>
      <ul class='articles'>
        {blogs.map(blog => <>
          <li class={data.blog == blog ? 'currentblog' : ''}>
            <a href={blog.path}>{blog.title}</a> {blog.date.toLocaleDateString('en-US', { dateStyle: 'medium' })}
          </li>
        </>)}
      </ul>
    </>)}
    <H>Planned</H>
    <ul class='articles'>
      <li>Survey: How alone do you feel?</li>
      <li>Survey: How did you meet your friends?</li>
      <li>Article: Anxiety, confidence, fear, arrogance</li>
      <li>Article: Love, purpose, burnout, motivation</li>
      <li>Article: Masculinity, femininity, destiny, Eden</li>
      <li>Experiment: Live upvote/downvote in person</li>
      <li>Experiment: Podcast episode with 100 cohosts</li>
      <li>Experiment: Free 3 minute trauma dumping</li>
      <li>Experiment: Trade hats, second try</li>
      <li>Discussion: What is masculinity?</li>
      <li>Discussion: What is femininity?</li>
      <li>Discussion: How do you fall in love?</li>
    </ul>
  </>
}

function AllArticlesPage(blogs: Blogs) {
  return <Html title="All Articles">
    <AllArticles blogs={blogs} tag="h2" />
  </Html>
}

function BlogPage(blog: Blog, blogs: Blogs) {
  return <Html title={blog.title}>

    <article>
      <p>
        <img src={blog.image} />
        <br />
        <small style='font-style: italic'>Written on {blog.date.toLocaleDateString('en-US', { dateStyle: 'long' })}</small>
      </p>
      <p>{blog.html}</p>
    </article>

    <h2>Leave a comment</h2>
    <aside>
      <p>
        To share your thoughts,
        come find me in Chicago
        on Sundays, from about Noon to 6pm,
        at the corner of State and Randolph,
        and tell me in person.
      </p>
      <p>
        To leave a comment that others can also see,
        stop by at precisely 3pm,
        when others will also be present,
        and share your thoughts with all of us.
      </p>
    </aside>

    <h2>All articles</h2>
    <AllArticles blogs={blogs} blog={blog} />

  </Html>
}
