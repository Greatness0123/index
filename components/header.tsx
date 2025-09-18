"use client"

import { Search, Sparkles, User, LogOut, Settings, Users, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SubmitToolDialog } from "./submit-tool-dialog"
import { FiltersModal } from "./filters-modal"
import { supabase } from "@/lib/supabase/client"
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const supabase = createClient()

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
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null)
  })

  return () => {
    subscription.unsubscribe()
  }
}, [supabase])



  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:rotate-3">
              <span className="text-primary-foreground font-bold text-lg">I</span>
            </div>
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Index
            </h1>
            <Sparkles className="h-4 w-4 text-accent animate-pulse hidden sm:block" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1 ml-4">
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

          <div className="flex-1 max-w-md lg:max-w-2xl mx-2 md:mx-4">
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

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <FiltersModal
              selectedPricing={selectedPricing}
              selectedRating={selectedRating}
              onPricingChange={onPricingChange}
              onRatingChange={onRatingChange}
              onClearFilters={onClearFilters}
            />

            <SubmitToolDialog />

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
                      <DropdownMenuItem asChild>
                        <Link href="/community">
                          <Users className="mr-2 h-4 w-4" />
                          <span>Community</span>
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

          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-4">
                  <div className="flex flex-col space-y-2">
                    <Button variant="ghost" size="sm" asChild className="justify-start">
                      <Link href="/" onClick={closeMobileMenu}>
                        Tools
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild className="justify-start">
                      <Link href="/community" onClick={closeMobileMenu} className="gap-2">
                        <Users className="h-4 w-4" />
                        Community
                      </Link>
                    </Button>
                  </div>

                  <div className="border-t pt-4">
                    <div className="mb-4">
                      <FiltersModal
                        selectedPricing={selectedPricing}
                        selectedRating={selectedRating}
                        onPricingChange={onPricingChange}
                        onRatingChange={onRatingChange}
                        onClearFilters={onClearFilters}
                      />
                    </div>

                    <div className="mb-4">
                      <SubmitToolDialog />
                    </div>

                    {!loading && (
                      <>
                        {user ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{user.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <p className="text-sm font-medium leading-none">{user.email}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" asChild className="justify-start w-full">
                              <Link href="/profile" onClick={closeMobileMenu}>
                                <Settings className="mr-2 h-4 w-4" />
                                Profile Settings
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild className="justify-start w-full">
                              <Link href="/community" onClick={closeMobileMenu}>
                                <Users className="mr-2 h-4 w-4" />
                                Community
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                handleSignOut()
                                closeMobileMenu()
                              }}
                              className="justify-start w-full"
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              Log out
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm" asChild className="justify-start w-full">
                            <a href="/auth/login" onClick={closeMobileMenu}>
                              <User className="h-4 w-4 mr-2" />
                              Sign In
                            </a>
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
