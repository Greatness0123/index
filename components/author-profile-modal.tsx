"use client"

import { useState, useEffect } from "react"
import { Globe, Github, Twitter, Calendar, Star, MessageCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"

interface AuthorProfileModalProps {
  authorId: string
  authorName: string
  isOpen: boolean
  onClose: () => void
}

interface AuthorProfile {
  id: string
  display_name: string
  full_name: string
  bio: string
  website_url: string
  twitter_handle: string
  github_handle: string
  profile_picture_url: string
  created_at: string
  tool_count: number
  post_count: number
  total_likes: number
}

export function AuthorProfileModal({ authorId, authorName, isOpen, onClose }: AuthorProfileModalProps) {
  const [profile, setProfile] = useState<AuthorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [recentTools, setRecentTools] = useState<any[]>([])
  const [recentPosts, setRecentPosts] = useState<any[]>([])

  const supabase = createClient()

  useEffect(() => {
    if (isOpen && authorId) {
      fetchAuthorProfile()
    }
  }, [isOpen, authorId])

  const fetchAuthorProfile = async () => {
    setLoading(true)

    try {
      // Fetch user profile
      const { data: userProfile } = await supabase.from("users").select("*").eq("id", authorId).single()

      // Fetch user's tools count
      const { count: toolCount } = await supabase
        .from("tools")
        .select("*", { count: "exact", head: true })
        .eq("submitted_by", authorId)
        .eq("is_approved", true)

      // Fetch user's posts count
      const { count: postCount } = await supabase
        .from("community_posts")
        .select("*", { count: "exact", head: true })
        .eq("author_id", authorId)
        .eq("is_approved", true)

      // Fetch recent tools
      const { data: tools } = await supabase
        .from("tools")
        .select("id, name, description, image_url, rating, rating_count")
        .eq("submitted_by", authorId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(3)

      // Fetch recent posts
      const { data: posts } = await supabase
        .from("community_posts")
        .select("id, title, content, post_type, like_count, comment_count, created_at")
        .eq("author_id", authorId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(3)

      if (userProfile) {
        setProfile({
          ...userProfile,
          tool_count: toolCount || 0,
          post_count: postCount || 0,
          total_likes: 0, // We can calculate this later if needed
        })
      }

      setRecentTools(tools || [])
      setRecentPosts(posts || [])
    } catch (error) {
      console.error("Error fetching author profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  const getDisplayName = () => {
    if (!profile) return authorName
    return profile.display_name || profile.full_name || authorName
  }

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto scrollbar-hide">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle>Author Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.profile_picture_url || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">{getDisplayName().charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <h2 className="text-xl font-semibold">{getDisplayName()}</h2>
              {profile?.bio && <p className="text-muted-foreground">{profile.bio}</p>}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Joined {formatDate(profile?.created_at || "")}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-2">
                {profile?.website_url && (
                  <Button variant="outline" size="sm" onClick={() => window.open(profile.website_url, "_blank")}>
                    <Globe className="h-4 w-4 mr-1" />
                    Website
                  </Button>
                )}
                {profile?.github_handle && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://github.com/${profile.github_handle}`, "_blank")}
                  >
                    <Github className="h-4 w-4 mr-1" />
                    GitHub
                  </Button>
                )}
                {profile?.twitter_handle && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://twitter.com/${profile.twitter_handle}`, "_blank")}
                  >
                    <Twitter className="h-4 w-4 mr-1" />
                    Twitter
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{profile?.tool_count || 0}</div>
              <div className="text-sm text-muted-foreground">Tools Submitted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{profile?.post_count || 0}</div>
              <div className="text-sm text-muted-foreground">Community Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{profile?.total_likes || 0}</div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </div>
          </div>

          <Separator />

          {/* Recent Tools */}
          {recentTools.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Recent Tools</h3>
              <div className="space-y-2">
                {recentTools.map((tool) => (
                  <Card key={tool.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        {tool.image_url && (
                          <img
                            src={tool.image_url || "/placeholder.svg"}
                            alt={tool.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{tool.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-1">{tool.description}</p>
                        </div>
                        {tool.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{tool.rating}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Recent Posts */}
          {recentPosts.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Recent Posts</h3>
              <div className="space-y-2">
                {recentPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {post.post_type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{formatDate(post.created_at)}</span>
                        </div>
                        <h4 className="font-medium text-sm line-clamp-1">{post.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">{post.content}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {post.comment_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {post.like_count}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
