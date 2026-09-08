
import Link from 'next/link'
import { getArticles } from '@/lib/content'

export default function HomePage() {
  const articles = getArticles()
  return (
    <main>
      <section className="intro" aria-labelledby="intro-title">
        <p className="eyebrow">Hello, I&apos;m by4nwu.</p>
        <h1 id="intro-title">I write things down while I figure them out.</h1>
        <p>A small collection of notes about programming, developer tools, and projects in progress.</p>
        <p className="contact-line">Find me on <a href="https://github.com/by4nwu">GitHub</a> or browse the <Link href="/about">about page</Link>.</p>
      </section>
      <section className="home-section" aria-labelledby="writing-title">
        <div className="section-heading">
          <h2 id="writing-title">Writing</h2>
          <Link href="/articles">View all <span aria-hidden="true">→</span></Link>
        </div>
        <ol className="post-list">
          {articles.slice(0, 5).map((article) => (
            <li key={article.slug}>
              <time dateTime={article.date}>{article.date}</time>
              <Link href={`/articles/${article.slug}`}>{article.title}</Link>
            </li>
          ))}
        </ol>
      </section>
      <section className="home-section compact-section" aria-labelledby="explore-title">
        <h2 id="explore-title">Elsewhere</h2>
        <p>Selected builds live under <Link href="/projects">projects</Link>. Longer context and a bit about this site live under <Link href="/about">about</Link>.</p>
      </section>
    </main>
  )
}
