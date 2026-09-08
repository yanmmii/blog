import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type Article = { slug: string; title: string; date: string; excerpt: string }
export type Project = {
  slug: string
  title: string
  date: string
  tech: string
  excerpt: string
  repoUrl?: string
  liveUrl?: string
}

function readCollection<T>(directory: string): T[] {
  const collectionDirectory = path.join(process.cwd(), directory)

  return fs.readdirSync(collectionDirectory)
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => {
      const filePath = path.join(collectionDirectory, filename)
      const { data } = matter(fs.readFileSync(filePath, 'utf8'))
      return { slug: filename.replace(/\.md$/, ''), ...data } as T
    })
}

function byNewest<T extends { date: string }>(a: T, b: T) {
  return new Date(b.date).getTime() - new Date(a.date).getTime()
}

export function getArticles() {
  return readCollection<Article>('_articles').sort(byNewest)
}

export function getProjects() {
  return readCollection<Project>('_projects').sort(byNewest)
}
