import Link from 'next/link';
import Image from 'next/image';
import './globals.css';
import Logo from '@/public/images/logo_drop_shadow.png'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <div className="logo-container">
            <Link href="/">
              <Image
                src={ Logo }
                alt={'Artistic'}
                height={250}
                width={150} />
            </Link>
          </div>
          <div className="nav-links">
            <ul>
              <li><Link href="/employees">Employees</Link></li>
              <li><Link href="/jobs">Jobs</Link></li>
              <li><Link href="/wood">Wood</Link></li>
            </ul>
          </div>
        </nav>
        <div className="content">
          {children}
        </div>
      </body>
    </html>
  );
}