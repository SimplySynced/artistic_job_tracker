import Sidebar from '@/components/Sidebar'
import { Inter } from 'next/font/google'
import Theme from './theme-provider'
import logo from "../../public/images/logo_drop_shadow.png"
import '@/styles/globals.css'
import { auth } from "@/auth"
import { SessionProvider } from 'next-auth/react'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: 'Artistic Job Tracker',
  description: 'A NextJS App to track employee time and jobs.',
}

export const viewport = "width=device-width, initial-scale=1.0, user-scalable=no";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch the session on the server side
  const session = await auth();

  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="font-inter antialiased bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
        <Theme>
          {session ? ( // Render the app if authenticated
            <Sidebar session={session} logo={logo}>
              {children}
            </Sidebar>
          ) : (
            <>{children}</>
          )}
        </Theme>
      </body>
    </html>
  );
}
