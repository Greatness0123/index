"use client"

import { Search, Sparkles, User, LogOut, Settings, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SubmitToolDialog } from "./submit-tool-dialog"
import { FiltersModal } from "./filters-modal"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedPricing: string | null
  selectedRating: string | null
  onPricingChange: (pricing: string | null) => void
  onRatingChange: (rating: string | null) => void
  onClearFilters: () => void
}

export function Header({
  searchQuery,
  onSearchChange,
  selectedPricing,
  selectedRating,
  onPricingChange,
  onRatingChange,
  onClearFilters,
}: HeaderProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:rotate-3">
              <span className="text-primary-foreground font-bold text-lg">I</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Index
            </h1>
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
          </Link>

          <nav className="hidden md:flex items-center gap-1 ml-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="gap-2">
                Tools
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/community" className="gap-2">
                <Users className="h-4 w-4" />
                Community
              </Link>
            </Button>
          </nav>

          <div className="flex-1 max-w-2xl mx-2 md:mx-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
              <Input
                placeholder="Search tools..."
                className="pl-10 bg-muted/50 border-border text-sm md:text-base transition-all duration-200 focus:bg-background focus:shadow-md focus:border-primary/50"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <FiltersModal
              selectedPricing={selectedPricing}
              selectedRating={selectedRating}
              onPricingChange={onPricingChange}
              onRatingChange={onRatingChange}
              onClearFilters={onClearFilters}
            />

            <div className="hidden sm:block">
              <SubmitToolDialog />
            </div>
            <div className="sm:hidden">
              <SubmitToolDialog />
            </div>

            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{user.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuItem className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.email}</p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Profile Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button variant="ghost" size="sm" asChild>
                    <a href="/auth/login">
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </a>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
