
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define a type for our post data
type Note = {
  slug: string;
  frontmatter: {
    [key: string]: any;
  };
};

// This function runs on the server to get all notes
async function getNotes(): Promise<Note[]> {
  const notesDirectory = path.join(process.cwd(), '_notes');
  const filenames = fs.readdirSync(notesDirectory);

  const notes = filenames.map((filename) => {
    const slug = filename.replace(/\.md$/, '');
    const filePath = path.join(notesDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter } = matter(fileContents);

    return {
      slug,
      frontmatter,
    };
  });

  // Sort notes by date in descending order
  return notes.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date);
    const dateB = new Date(b.frontmatter.date);
    return dateB.getTime() - dateA.getTime();
  });
}


export default async function NotesPage() {
  const notes = await getNotes();

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <div className="w-full max-w-2xl">
        <header className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-100">Notes</h1>
          <p className="mt-4 text-neutral-400">All my thoughts, learnings, and reflections.</p>
        </header>

        <div className="w-full">
          {notes.map((note) => (
            <article key={note.slug} className="mb-12">
              <p className="text-neutral-500 mb-2 text-sm">{note.frontmatter.date}</p>
              <h2 className="text-2xl font-bold mb-3">
                <Link href={`/notes/${note.slug}`} className="text-neutral-100 hover:text-neutral-300 transition-colors">
                  {note.frontmatter.title}
                </Link>
              </h2>
              <p className="text-neutral-400">{note.frontmatter.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
