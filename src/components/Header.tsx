'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Articles', href: '/articles' },
  { name: 'Projects', href: '/projects' },
  { name: 'About', href: '/about' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full max-w-2xl mx-auto pt-8 px-8 md:px-0">
        <nav>
            <ul className="flex space-x-6 text-neutral-400">
                <li>
                    <Link href="/" className="font-bold text-xl text-neutral-100 hover:text-neutral-300 transition-colors">My Blog</Link>
                </li>
                <li className="flex-grow"></li>
                {navLinks.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    return (
                        <li key={link.name}>
                            <Link
                                href={link.href}
                                className={isActive ? "text-neutral-100 font-medium" : "hover:text-neutral-200 transition-colors"}>
                                {link.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    </header>
  );
}
