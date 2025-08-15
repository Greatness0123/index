"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, User, ExternalLink, Heart, MessageCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CommunityCommentsSection } from "@/components/community-comments-section"
import { createClient } from "@/lib/supabase/client"
import { likeCommunityPost } from "@/lib/actions"
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

export default function CommunityPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<CommunityPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isLiking, setIsLiking] = useState(false)

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

  useEffect(() => {
    const fetchPost = async () => {
      if (!params.id) return

      const { data, error } = await supabase
        .from("community_posts")
        .select("*")
        .eq("id", params.id)
        .eq("is_approved", true)
        .single()

      if (error) {
        console.error("Error fetching post:", error)
        router.push("/community")
        return
      }

      setPost(data)
      setLiked(data.user_has_liked || false)
      setLikeCount(data.like_count)
      setLoading(false)

      // Increment view count
      await supabase
        .from("community_posts")
        .update({ view_count: data.view_count + 1 })
        .eq("id", params.id)
    }

    fetchPost()
  }, [params.id, router])

  const handleLike = async () => {
    if (!user || !post) return

    setIsLiking(true)
    const result = await likeCommunityPost(post.id)

    if (result.success) {
      setLiked(result.liked)
      setLikeCount((prev) => (result.liked ? prev + 1 : prev - 1))
    }

    setIsLiking(false)
  }

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case "announcement":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "showcase":
        return "bg-green-100 text-green-800 border-green-200"
      case "question":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "advertisement":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-32 bg-muted rounded" />
            <div className="h-12 w-3/4 bg-muted rounded" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-2/3 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Post not found</h1>
          <p className="text-muted-foreground mb-4">The post you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/community">Back to Community</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <article className="space-y-6">
          {/* Post Header */}
          <header className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className={`${getPostTypeColor(post.post_type)}`}>
                {post.post_type.charAt(0).toUpperCase() + post.post_type.slice(1)}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDate(post.created_at)}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                {post.view_count} views
              </div>
            </div>

            <h1 className="text-3xl font-bold text-foreground">{post.title}</h1>

            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {post.show_author && post.author_name ? (
                    post.author_name.charAt(0).toUpperCase()
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">
                {post.show_author && post.author_name ? post.author_name : "Anonymous"}
              </span>
            </div>
          </header>

          {/* Post Content */}
          <div className="prose prose-gray max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">{post.content}</div>

            {post.image_url && (
              <div className="my-6">
                <img
                  src={post.image_url || "/placeholder.svg"}
                  alt="Post image"
                  className="w-full max-w-2xl rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-b border-border py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleLike}
                disabled={isLiking || !user}
                className={`gap-2 ${liked ? "text-red-500" : "text-muted-foreground"}`}
              >
                <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                {likeCount}
              </Button>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-5 w-5" />
                {post.comment_count}
              </div>
            </div>

            {post.external_url && (
              <Button onClick={() => window.open(post.external_url!, "_blank")} className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Visit Link
              </Button>
            )}
          </div>

          {/* Comments */}
          <CommunityCommentsSection
            postId={post.id}
            initialCommentCount={post.comment_count}
            isAuthenticated={!!user}
          />
        </article>
      </div>
    </div>
  )
}
