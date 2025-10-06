import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

// Define a type for our project data
type Project = {
  slug: string;
  frontmatter: {
    [key: string]: any;
  };
};

// This function runs on the server to get all projects
async function getProjects(): Promise<Project[]> {
  const projectsDirectory = path.join(process.cwd(), '_projects');
  const filenames = fs.readdirSync(projectsDirectory);

  const projects = filenames.map((filename) => {
    const slug = filename.replace(/\.md$/, '');
    const filePath = path.join(projectsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter } = matter(fileContents);

    return {
      slug,
      frontmatter,
    };
  });

  // Sort projects by date in descending order
  return projects.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date);
    const dateB = new Date(b.frontmatter.date);
    return dateB.getTime() - dateA.getTime();
  });
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <div className="w-full max-w-2xl">
        <header className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-100">Projects</h1>
          <p className="mt-4 text-neutral-400">A selection of projects I've worked on.</p>
        </header>
        <div className="w-full space-y-8">
          {projects.map((project) => (
            <div key={project.slug} className="p-6 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
              <h3 className="text-xl font-bold text-neutral-100">{project.frontmatter.title}</h3>
              <p className="mt-2 text-sm text-neutral-400">{project.frontmatter.tech}</p>
              <p className="mt-4 text-neutral-300">{project.frontmatter.excerpt}</p>
              <div className="mt-4 flex space-x-4">
                {project.frontmatter.repoUrl && (
                  <Link href={project.frontmatter.repoUrl} target="_blank" className="text-sm text-neutral-300 hover:text-white transition-colors">
                    GitHub
                  </Link>
                )}
                {project.frontmatter.liveUrl && (
                  <Link href={project.frontmatter.liveUrl} target="_blank" className="text-sm text-neutral-300 hover:text-white transition-colors">
                    Live Demo
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}