import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const articlesDirectory = path.join(process.cwd(), '_articles');

// This function generates the slugs for all articles at build time
export async function generateStaticParams() {
  const filenames = fs.readdirSync(articlesDirectory);
  return filenames.map((filename) => ({
    slug: filename.replace(/\.md$/, ''),
  }));
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
        <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
            <div className="w-full max-w-2xl">
                <article>
                    <header className="mb-8">
                        <h1 className="text-4xl font-bold tracking-tight text-neutral-100 mb-3">{articleData.title}</h1>
                        <p className="text-neutral-500 text-sm">{articleData.date}</p>
                    </header>
                    <div 
                        className="prose prose-invert prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: articleData.contentHtml }} 
                    />
                </article>
            </div>
        </main>
    );
}