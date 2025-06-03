import { Button } from "@/components/ui/button"
import { ArrowLeft, Construction } from "lucide-react"
import Link from "next/link"

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
      <div className="text-center space-y-8 p-8">
        <Construction className="h-24 w-24 text-[#3498db] mx-auto" />
        <h1 className="text-4xl md:text-5xl font-bold text-[#3498db]">Under Construction</h1>
        <p className="text-gray-400 max-w-md mx-auto">
          We're working hard to bring you an amazing collection of projects. Please check back soon!
        </p>
        <Link href="/">
          <Button
            className="bg-[#3498db] hover:bg-[#2980b9] text-white px-6 py-3 rounded-lg transition-colors duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  )
} 