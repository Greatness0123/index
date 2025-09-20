"use client"

import { useState, useEffect } from "react"
import { Star, MessageCircle, ThumbsUp, ThumbsDown, Flag, Trash2, Copy, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { VerificationBadge } from "@/components/verification-badge"
import { supabase } from "@/lib/supabase/client"
import { submitComment, voteOnComment, deleteComment, getComments } from "@/lib/actions"
import { toast } from "@/hooks/use-toast"

interface Comment {
  id: string
  content: string
  rating: number | null
  created_at: string
  helpful_count: number
  total_votes: number
  user_id: string
  user: {
    id: string
    email: string
    full_name?: string
    display_name?: string
    profile_image?: string
    is_verified?: boolean
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
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [toolId, sortBy, user])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const result = await getComments(toolId, user?.id)
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else if (result.comments) {
        setComments(result.comments)
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!user) {
      window.location.href = "/auth/login"
      return
    }

    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Please write a comment before submitting",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const result = await submitComment(toolId, newComment, newRating || null)

      if (result.success) {
        setNewComment("")
        setNewRating(0)
        // Refresh comments immediately after submission
        await fetchComments()
        toast({
          title: "Success",
          description: "Your comment has been posted!",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit comment",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting comment:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleVote = async (commentId: string, isHelpful: boolean) => {
    if (!user) {
      window.location.href = "/auth/login"
      return
    }

    try {
      const result = await voteOnComment(commentId, isHelpful)
      if (result.success) {
        // Refresh the comments to get updated vote counts
        fetchComments()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to vote on comment",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error voting on comment:", error)
      toast({
        title: "Error",
        description: "Failed to vote on comment",
        variant: "destructive",
      })
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return

    try {
      const result = await deleteComment(commentId)
      if (result.success) {
        fetchComments()
        toast({
          title: "Success",
          description: "Comment deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete comment",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      })
    }
  }

  const handleCopyComment = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast({
        title: "Copied!",
        description: "Comment copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy comment",
        variant: "destructive",
      })
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchComments()
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

  const getDisplayName = (commentUser: Comment["user"]) => {
    if (!commentUser) return "Anonymous"
    return commentUser.display_name || commentUser.full_name || commentUser.email?.split("@")[0] || "Anonymous"
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
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
        <div className="flex items-center gap-2">
          <h4 className="text-lg font-semibold">Reviews ({comments.length})</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
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
                    <AvatarImage src={comment.user?.profile_image || "/placeholder.svg"} />
                    <AvatarFallback>{getInitials(getDisplayName(comment.user))}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{getDisplayName(comment.user)}</span>
                        <VerificationBadge isVerified={comment.user?.is_verified || false} size="sm" />
                      </div>
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

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyComment(comment.content)}
                        className="gap-1 text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="h-4 w-4" />
                        <span className="text-xs">Copy</span>
                      </Button>

                      {user && user.id === comment.user_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="text-xs">Delete</span>
                        </Button>
                      )}

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
