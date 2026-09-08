import Link from 'next/link'

const footerLinks = [
  { name: 'Home', href: '/' },
  { name: 'Articles', href: '/articles' },
  { name: 'Projects', href: '/projects' },
  { name: 'About', href: '/about' },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>Built with Next.js and Markdown.</p>
      <nav aria-label="Footer navigation">
        {footerLinks.map((link) => <Link key={link.href} href={link.href}>{link.name}</Link>)}
      </nav>
    </footer>
  )
}
