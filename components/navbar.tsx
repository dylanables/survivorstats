"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FlameKindlingIcon as Campfire, Users, Calendar, BarChart, Home } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? "bg-survivor-brown text-white" : "hover:bg-survivor-beige"
  }

  return (
    <nav className="bg-survivor-green text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Campfire className="h-8 w-8 text-survivor-yellow" />
              <span className="text-xl font-bold">Survivor Stats</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link href="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/")}`}>
                <div className="flex items-center space-x-1">
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </div>
              </Link>

              <Link
                href="/contestants"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/contestants")}`}
              >
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>Contestants</span>
                </div>
              </Link>

              <Link
                href="/seasons"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/seasons")}`}
              >
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Seasons</span>
                </div>
              </Link>

              <Link
                href="/compare"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/compare")}`}
              >
                <div className="flex items-center space-x-1">
                  <BarChart className="h-4 w-4" />
                  <span>Compare</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
