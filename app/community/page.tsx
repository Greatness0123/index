"use client"

import { useState, useEffect } from "react"
import { Users, Filter, TrendingUp, Clock, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CommunityPostCard } from "@/components/community-post-card"
import { CreatePostDialog } from "@/components/create-post-dialog"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface CommunityPost {
  id: string
  title: string
  content: string
  post_type: string
  author_name: string | null
  show_author: boolean
  image_url: string | null
  external_url: string | null
  tags: string[]
  is_pinned: boolean
  like_count: number
  comment_count: number
  view_count: number
  created_at: string
  user_has_liked?: boolean
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("recent")
  const [filterType, setFilterType] = useState("all")
  const [user, setUser] = useState<any>(null)

  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)

    let query = supabase.from("community_posts").select("*").eq("is_approved", true)

    // Apply filters
    if (filterType !== "all") {
      query = query.eq("post_type", filterType)
    }

    // Apply sorting
    switch (sortBy) {
      case "popular":
        query = query.order("like_count", { ascending: false })
        break
      case "discussed":
        query = query.order("comment_count", { ascending: false })
        break
      case "recent":
      default:
        query = query.order("is_pinned", { ascending: false }).order("created_at", { ascending: false })
        break
    }

    const { data, error } = await query.limit(50)

    if (error) {
      console.error("Error fetching community posts:", error)
      return
    }

    setPosts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
  }, [sortBy, filterType])

  const postTypes = [
    { value: "all", label: "All Posts", count: posts.length },
    { value: "discussion", label: "Discussions", count: posts.filter((p) => p.post_type === "discussion").length },
    { value: "question", label: "Questions", count: posts.filter((p) => p.post_type === "question").length },
    { value: "showcase", label: "Showcases", count: posts.filter((p) => p.post_type === "showcase").length },
    { value: "advertisement", label: "Ads", count: posts.filter((p) => p.post_type === "advertisement").length },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Community</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with fellow tool enthusiasts, share discoveries, ask questions, and showcase your projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CreatePostDialog />
              <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                <TrendingUp className="h-4 w-4" />
                Trending Topics
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Sort by</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Most Recent
                    </div>
                  </SelectItem>
                  <SelectItem value="popular">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Most Popular
                    </div>
                  </SelectItem>
                  <SelectItem value="discussed">Most Discussed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Post Type</label>
              <div className="flex flex-wrap gap-2">
                {postTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFilterType(type.value)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-2 ${
                      filterType === type.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{type.label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {type.count}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main>
          {loading ? (
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-4 w-20 bg-muted rounded" />
                    <div className="h-4 w-32 bg-muted rounded" />
                  </div>
                  <div className="h-6 w-3/4 bg-muted rounded mb-3" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-2/3 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <CommunityPostCard key={post.id} post={post} isAuthenticated={!!user} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-6">Be the first to start a conversation in the community!</p>
              <CreatePostDialog />
            </div>
          )}
        </main>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Community Guidelines
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li>• Be respectful and constructive in all interactions</li>
                <li>• Share relevant tools and helpful resources</li>
              </ul>
              <ul className="space-y-2">
                <li>• Help others discover great tools and solutions</li>
                <li>• Keep discussions on-topic and valuable</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
