
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <main>
      <header className="page-header"><p className="eyebrow">Profile</p><h1>About me</h1></header>
      <div className="prose prose-invert about-copy">
        <p>Welcome to my digital garden.</p>
        <p>This is where I share what I&apos;m learning about programming, technology, and maybe some other things.</p>
        <p>You can also find my work on <a href="https://github.com/by4nwu">GitHub</a>.</p>
      </div>
    </main>
  );
}
