import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-[#0a84ff]">404</h1>
        <h2 className="text-2xl">Page Not Found</h2>
        <p className="text-gray-400">The page you're looking for doesn't exist or has been moved.</p>
        <Link 
          href="/" 
          className="inline-block px-6 py-3 bg-[#0a84ff] text-white rounded-lg hover:bg-[#0077ed] transition-colors duration-300"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
} 