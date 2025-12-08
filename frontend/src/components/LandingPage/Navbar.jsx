import { Link } from 'react-router-dom'

export default function Navbar({ onBecomeMemberClick = () => {} }) {
  return (
    <header className="w-full bg-gradient-to-r from-yellow-50 to-amber-50 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <img src="/adma_logo.svg" alt="ADMA" className="h-10 w-10 sm:h-12 sm:w-12" />
        </Link>
        <ul className="hidden items-center gap-8 text-base font-medium text-gray-800 sm:flex">
          <li>
            <Link to="/" className="transition-colors hover:text-gray-900 hover:underline decoration-2 underline-offset-4">
              Home
            </Link>
          </li>
          <li>
            <Link to="/events" className="transition-colors hover:text-gray-900 hover:underline decoration-2 underline-offset-4">
              Events
            </Link>
          </li>
          <li>
            <a href="#publications" className="transition-colors hover:text-gray-900 hover:underline decoration-2 underline-offset-4">
              Publications
            </a>
          </li>
          <li>
            <a href="#gallery" className="transition-colors hover:text-gray-900 hover:underline decoration-2 underline-offset-4">
              Gallery
            </a>
          </li>
          <li>
            <a href="#members" className="transition-colors hover:text-gray-900 hover:underline decoration-2 underline-offset-4">
              Members
            </a>
          </li>
        </ul>
        <div className="hidden sm:block">
          <button
            onClick={onBecomeMemberClick}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Become a Member
          </button>
        </div>
      </nav>
    </header>
  )
}


