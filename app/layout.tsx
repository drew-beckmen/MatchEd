// Components within app router folder are React Server Components, improving performance and reducing bundle size. App router
// replaces the old pages router.
// Read more about RSC: https://nextjs.org/docs/app/building-your-application/rendering/server-components
// NextJS still supports client components as needed.
// Pages are UIs that are unique to a route, meaning it is the leaf of a route subtree. Layouts are shared across multiple pages, and
// can be nested. The root layout is the outermost layer and is required for every page.

import './globals.css'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MatchEd Frontend',
  description: 'Author: Drew Beckmen',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='h-full bg-gray-50'>
      <body className={`${inter.className} h-full`}>{children}</body>
    </html>
  )
}
