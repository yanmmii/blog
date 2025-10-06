import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define a type for our article data
type Article = {
  slug: string;
  frontmatter: {
    [key: string]: any;
  };
};

// This function runs on the server to get all articles
async function getArticles(): Promise<Article[]> {
  const articlesDirectory = path.join(process.cwd(), '_articles');
  const filenames = fs.readdirSync(articlesDirectory);

  const articles = filenames.map((filename) => {
    const slug = filename.replace(/\.md$/, '');
    const filePath = path.join(articlesDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter } = matter(fileContents);

    return {
      slug,
      frontmatter,
    };
  });

  // Sort articles by date in descending order
  return articles.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date);
    const dateB = new Date(b.frontmatter.date);
    return dateB.getTime() - dateA.getTime();
  });
}


export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <div className="w-full max-w-2xl">
        <header className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-100">Articles</h1>
          <p className="mt-4 text-neutral-400">All my thoughts, learnings, and reflections.</p>
        </header>

        <div className="w-full">
          {articles.map((article) => (
            <article key={article.slug} className="mb-12">
              <p className="text-neutral-500 mb-2 text-sm">{article.frontmatter.date}</p>
              <h2 className="text-2xl font-bold mb-3">
                <Link href={`/articles/${article.slug}`} className="text-neutral-100 hover:text-neutral-300 transition-colors">
                  {article.frontmatter.title}
                </Link>
              </h2>
              <p className="text-neutral-400">{article.frontmatter.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}