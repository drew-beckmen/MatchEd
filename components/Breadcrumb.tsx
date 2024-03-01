"use client"

import { HomeIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const pages = [
  { name: 'Projects', href: '#', current: false },
  { name: 'Project Nero', href: '#', current: true },
]

export default function Example() {
  const pathname = usePathname()
  const pathnames = pathname.split('/').filter((p) => p)
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex space-x-4 rounded-md bg-white px-6 shadow">
        <li className="flex">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-500">
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {pathnames.map((page, index) => {
          let href = `/${pathnames.slice(0, index + 1).join('/')}`  
          let itemText = page[0].toUpperCase() + page.slice(1, page.length)
          if (pathnames[index - 1] === 'experiments') {
            itemText = 'Current Experiment'
          } else if (pathnames[index - 1] === 'conditions' && pathnames[index] !== 'new') {
            itemText = 'Current Condition'
          }
          return (
          <li key={page} className="flex">
            <div className="flex items-center">
              <svg
                className="h-full w-6 flex-shrink-0 text-gray-200"
                viewBox="0 0 24 44"
                preserveAspectRatio="none"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
              </svg>
              <Link
                href={href}
                className={`ml-4 text-sm font-medium ${index == pathnames.length - 1 ? "text-indigo-500 hover:text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}
                aria-current={index == pathnames.length - 1 ? 'page' : undefined}
              >
                {itemText}
              </Link>
            </div>
          </li>
        )})}
      </ol>
    </nav>
  )
}
