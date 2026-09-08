import Link from 'next/link';
import type { Metadata } from 'next';
import { getProjects } from '@/lib/content';

export const metadata: Metadata = { title: 'Projects' };

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main>
        <header className="page-header"><p className="eyebrow">Selected work</p><h1>Projects</h1><p>Things I&apos;ve built, explored, and learned from.</p></header>
        <div className="project-list">
          {projects.map((project) => (
            <article key={project.slug}>
              <div className="project-heading"><h2>{project.title}</h2><time dateTime={project.date}>{project.date}</time></div>
              <p className="project-tech">{project.tech}</p>
              <p>{project.excerpt}</p>
              <div className="project-links">
                {project.repoUrl && <Link href={project.repoUrl} target="_blank" rel="noreferrer">GitHub</Link>}
                {project.liveUrl && <Link href={project.liveUrl} target="_blank" rel="noreferrer">Live Demo</Link>}
              </div>
            </article>
          ))}
        </div>
    </main>
  );
}
