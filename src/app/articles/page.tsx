import Link from 'next/link';
import type { Metadata } from 'next';
import { getArticles } from '@/lib/content';

export const metadata: Metadata = { title: 'Articles', description: 'Notes on programming, tools, and development workflows.' };

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <main>
        <header className="page-header">
          <p className="eyebrow">Archive</p>
          <h1>Articles</h1>
          <p>Thoughts, working notes, and lessons worth keeping.</p>
        </header>
        <ol className="article-index">
          {articles.map((article) => (
            <li key={article.slug}>
              <time dateTime={article.date}>{article.date}</time>
              <div><h2><Link href={`/articles/${article.slug}`}>{article.title}</Link></h2>{article.excerpt && <p>{article.excerpt}</p>}</div>
            </li>
          ))}
        </ol>
    </main>
  );
}
