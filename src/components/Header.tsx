'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Articles', href: '/articles' },
  { name: 'Projects', href: '/projects' },
  { name: 'About', href: '/about' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link href="/" className="site-mark" aria-label="by4nwu's blog, home">
        <span aria-hidden="true">~/</span>by4nwu
      </Link>
      <nav aria-label="Primary navigation">
        <ul>
          {navLinks.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
            return (
              <li key={link.name}>
                <Link href={link.href} aria-current={isActive ? 'page' : undefined}>{link.name}</Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
