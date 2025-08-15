"use client"

import { useState, useEffect } from "react"
import { Star, MessageCircle, ThumbsUp, ThumbsDown, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase/client"
import { submitComment, voteOnComment } from "@/lib/actions"

interface Comment {
  id: string
  content: string
  rating: number | null
  created_at: string
  helpful_count: number
  total_votes: number
  user: {
    email: string
    full_name?: string
  }
  user_vote?: {
    is_helpful: boolean
  } | null
}

interface CommentSectionProps {
  toolId: string
  user: any
}

export function CommentSection({ toolId, user }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [newRating, setNewRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "helpful">("newest")

  useEffect(() => {
    fetchComments()
  }, [toolId, sortBy])

  const fetchComments = async () => {
    let query = supabase
      .from("comments")
      .select(`
        id, content, rating, created_at, helpful_count, total_votes,
        user:users(email, full_name)
      `)
      .eq("tool_id", toolId)
      .eq("is_approved", true)

    // Add user vote information if user is logged in
    if (user) {
      query = supabase
        .from("comments")
        .select(`
          id, content, rating, created_at, helpful_count, total_votes,
          user:users(email, full_name),
          user_vote:comment_votes!comment_votes_comment_id_fkey(is_helpful)
        `)
        .eq("tool_id", toolId)
        .eq("is_approved", true)
        .eq("comment_votes.user_id", user.id)
    }

    // Apply sorting
    switch (sortBy) {
      case "oldest":
        query = query.order("created_at", { ascending: true })
        break
      case "helpful":
        query = query.order("helpful_count", { ascending: false }).order("created_at", { ascending: false })
        break
      default:
        query = query.order("created_at", { ascending: false })
    }

    const { data, error } = await query

    if (!error && data) {
      setComments(data)
    }
    setLoading(false)
  }

  const handleSubmitComment = async () => {
    if (!user) {
      window.location.href = "/auth/login"
      return
    }

    if (!newComment.trim()) return

    setSubmitting(true)

    const result = await submitComment(toolId, newComment, newRating || null)

    if (result.success) {
      setNewComment("")
      setNewRating(0)
      fetchComments()
    }

    setSubmitting(false)
  }

  const handleVote = async (commentId: string, isHelpful: boolean) => {
    if (!user) {
      window.location.href = "/auth/login"
      return
    }

    const result = await voteOnComment(commentId, isHelpful)
    if (result.success) {
      fetchComments()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getHelpfulPercentage = (helpful: number, total: number) => {
    if (total === 0) return 0
    return Math.round((helpful / total) * 100)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      {user ? (
        <Card>
          <CardHeader>
            <h4 className="font-semibold">Leave a Review</h4>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating (Optional)</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        star <= (hoveredRating || newRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground hover:text-yellow-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {newRating > 0 && (
                <p className="text-sm text-muted-foreground">
                  You rated this {newRating} star{newRating > 1 ? "s" : ""}
                </p>
              )}
            </div>

            <Textarea
              placeholder="Share your thoughts about this tool..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              className="resize-none"
            />

            <Button onClick={handleSubmitComment} disabled={submitting || !newComment.trim()}>
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Sign in to leave a review</p>
            <Button asChild>
              <a href="/auth/login">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Comments Header with Sorting */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">Reviews ({comments.length})</h4>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border rounded px-2 py-1 bg-background"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      <Separator />

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4" />
            <p>No reviews yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {comment.user.full_name?.charAt(0) || comment.user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{comment.user.full_name || comment.user.email.split("@")[0]}</span>
                      <span className="text-sm text-muted-foreground">{formatDate(comment.created_at)}</span>
                      {comment.rating && (
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < comment.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{comment.rating}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-muted-foreground leading-relaxed">{comment.content}</p>

                    {/* Comment Actions */}
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(comment.id, true)}
                          className={`gap-1 ${
                            comment.user_vote?.is_helpful === true ? "text-green-600 bg-green-50" : ""
                          }`}
                          disabled={!user}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span className="text-xs">{comment.helpful_count}</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(comment.id, false)}
                          className={`gap-1 ${comment.user_vote?.is_helpful === false ? "text-red-600 bg-red-50" : ""}`}
                          disabled={!user}
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </Button>

                        {comment.total_votes > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {getHelpfulPercentage(comment.helpful_count, comment.total_votes)}% helpful
                          </Badge>
                        )}
                      </div>

                      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" disabled={!user}>
                        <Flag className="h-4 w-4" />
                        <span className="text-xs">Report</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
