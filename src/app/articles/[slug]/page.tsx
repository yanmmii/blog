import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import Link from 'next/link';
import type { Metadata } from 'next';

const articlesDirectory = path.join(process.cwd(), '_articles');

// This function generates the slugs for all articles at build time
export async function generateStaticParams() {
  const filenames = fs.readdirSync(articlesDirectory);
  return filenames.map((filename) => ({
    slug: filename.replace(/\.md$/, ''),
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const articleData = await getArticleData(params.slug);
    return { title: articleData.title, description: articleData.excerpt };
}

// This function gets the content for a specific article
async function getArticleData(slug: string): Promise<{ slug: string; contentHtml: string; [key: string]: any }> {
  const fullPath = path.join(articlesDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    slug,
    contentHtml,
    ...matterResult.data,
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
    const articleData = await getArticleData(params.slug);

    return (
        <main>
            <article className="article-page">
                <header>
                    <Link href="/articles" className="back-link"><span aria-hidden="true">←</span> All articles</Link>
                    <h1>{articleData.title}</h1>
                    <time dateTime={articleData.date}>{articleData.date}</time>
                </header>
                <div className="prose prose-invert" dangerouslySetInnerHTML={{ __html: articleData.contentHtml }} />
            </article>
        </main>
    );
}
