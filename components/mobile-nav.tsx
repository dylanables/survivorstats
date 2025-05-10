"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Users, Calendar, BarChart, Home, History } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? "bg-survivor-brown text-white" : "hover:bg-survivor-beige"
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="md:hidden">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-white">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-survivor-green z-50 shadow-lg">
          <div className="flex flex-col p-4 space-y-2">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/")}`}
              onClick={toggleMenu}
            >
              <div className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </div>
            </Link>

            <Link
              href="/contestants"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/contestants")}`}
              onClick={toggleMenu}
            >
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Contestants</span>
              </div>
            </Link>

            <Link
              href="/seasons"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/seasons")}`}
              onClick={toggleMenu}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Seasons</span>
              </div>
            </Link>

            <Link
              href="/compare"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/compare")}`}
              onClick={toggleMenu}
            >
              <div className="flex items-center space-x-2">
                <BarChart className="h-5 w-5" />
                <span>Compare</span>
              </div>
            </Link>

            <Link
              href="/changelog"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/changelog")}`}
              onClick={toggleMenu}
            >
              <div className="flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>Changelog</span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}