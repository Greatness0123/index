"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Send, Heart, ThumbsUp, Reply } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VerificationBadge } from "@/components/verification-badge"
import { createCommunityComment, likeCommunityComment } from "@/lib/actions"
import { createClient } from "@/lib/supabase/client"

interface Comment {
  id: string
  content: string
  author_name: string | null
  author_id: string | null
  show_author: boolean
  like_count: number
  created_at: string
  parent_id: string | null
  user_has_liked?: boolean
  author_profile_image?: string | null
  author_is_verified?: boolean
  replies?: Comment[]
}

interface CommunityCommentsSectionProps {
  postId: string
  initialCommentCount: number
  isAuthenticated?: boolean
}

export function CommunityCommentsSection({
  postId,
  initialCommentCount,
  isAuthenticated,
}: CommunityCommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  const [commentCount, setCommentCount] = useState(initialCommentCount)

  const supabase = createClient()

 const fetchComments = async () => {
  try {
    setLoading(true)
    
    const { data: commentsData, error } = await supabase
      .from("community_comments")
      .select(`
        *,
        users!community_comments_author_id_fkey(
          id,
          display_name,
          full_name,
          profile_image,
          is_verified
        )
      `)
      .eq("post_id", postId)
      .eq("is_approved", true)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching comments:", error)
      return
    }

    console.log("Fetched comments:", commentsData) // Debug log

    // Transform the data to match the expected interface
    const transformedComments = (commentsData || []).map(comment => ({
      id: comment.id,
      content: comment.content,
      author_name: comment.show_author 
        ? (comment.users?.display_name || comment.users?.full_name || "Anonymous")
        : null,
      author_id: comment.author_id,
      show_author: comment.show_author,
      like_count: comment.like_count || 0,
      created_at: comment.created_at,
      parent_id: comment.parent_id,
      author_profile_image: comment.users?.profile_image || null,
      author_is_verified: comment.users?.is_verified || false
    }))

    setComments(transformedComments)
  } catch (error) {
    console.error("Error in fetchComments:", error)
  } finally {
    setLoading(false)
  }
}

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    const result = await createCommunityComment(postId, newComment)

    if (result.success) {
      setNewComment("")
      setCommentCount((prev) => prev + 1)
      // Refresh comments
      await fetchComments()
    }

    setIsSubmitting(false)
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return

    setIsSubmittingReply(true)
    const result = await createCommunityComment(postId, replyContent, parentId)

    if (result.success) {
      setReplyContent("")
      setReplyingTo(null)
      setCommentCount((prev) => prev + 1)
      // Refresh comments
      await fetchComments()
    }

    setIsSubmittingReply(false)
  }

  const handleLikeComment = async (commentId: string) => {
    if (!isAuthenticated) return

    const result = await likeCommunityComment(commentId)
    if (result.success) {
      // Update the comment in the local state
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            like_count: result.liked ? comment.like_count + 1 : comment.like_count - 1,
            user_has_liked: result.liked
          }
        }
        // Also check replies
        if (comment.replies) {
          const updatedReplies = comment.replies.map(reply => {
            if (reply.id === commentId) {
              return {
                ...reply,
                like_count: result.liked ? reply.like_count + 1 : reply.like_count - 1,
                user_has_liked: result.liked
              }
            }
            return reply
          })
          return { ...comment, replies: updatedReplies }
        }
        return comment
      }))
    }
  }

  const handleCancelReply = () => {
    setReplyingTo(null)
    setReplyContent("")
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  // Organize comments into a tree structure
  const organizeComments = (comments: Comment[]) => {
    const commentMap = new Map()
    const rootComments: Comment[] = []

    // First pass: create comment objects with empty replies arrays
    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] })
    })

    // Second pass: organize into tree structure
    comments.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment.id)
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id)
        if (parent) {
          parent.replies.push(commentWithReplies)
        }
      } else {
        rootComments.push(commentWithReplies)
      }
    })

    return rootComments
  }

  const organizedComments = organizeComments(comments)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`space-y-3 ${isReply ? "ml-8 border-l border-border pl-4" : ""}`}>
      <div className="flex items-start gap-3">
        <Avatar className={isReply ? "h-6 w-6" : "h-8 w-8"}>
          <AvatarImage src={comment.author_profile_image || "/placeholder.svg"} />
          <AvatarFallback className={isReply ? "text-xs" : "text-sm"}>
            {comment.show_author && comment.author_name
              ? getInitials(comment.author_name)
              : "A"
            }
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className={`font-medium ${isReply ? "text-xs" : "text-sm"}`}>
                {comment.show_author && comment.author_name
                  ? comment.author_name
                  : "Anonymous"
                }
              </span>
              <VerificationBadge isVerified={comment.author_is_verified || false} size="sm" />
            </div>
            <span className={`text-muted-foreground ${isReply ? "text-xs" : "text-xs"}`}>
              {formatDate(comment.created_at)}
            </span>
          </div>
          
          <p className={`text-muted-foreground leading-relaxed ${isReply ? "text-xs" : "text-sm"}`}>
            {comment.content}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLikeComment(comment.id)}
              disabled={!isAuthenticated}
              className={`p-0 h-auto font-normal gap-1 hover:text-red-500 ${
                comment.user_has_liked ? "text-red-500" : ""
              }`}
            >
              <Heart className={`h-3 w-3 ${comment.user_has_liked ? "fill-current" : ""}`} />
              {comment.like_count}
            </Button>
            
            {!isReply && isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(comment.id)}
                className="p-0 h-auto font-normal gap-1 hover:text-foreground"
              >
                <Reply className="h-3 w-3" />
                Reply
              </Button>
            )}
          </div>

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="space-y-3 pt-3">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={isSubmittingReply || !replyContent.trim()}
                >
                  {isSubmittingReply ? "Posting..." : "Post Reply"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelReply}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4 pt-2">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments ({commentCount})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAuthenticated ? (
          <div className="space-y-3">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmitComment} disabled={isSubmitting || !newComment.trim()} className="gap-2">
                <Send className="h-4 w-4" />
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>Please sign in to join the conversation</p>
          </div>
        )}

        <div className="border-t pt-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : organizedComments.length > 0 ? (
            <div className="space-y-6">
              {organizedComments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
