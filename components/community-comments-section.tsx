"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CommunityComment } from "@/components/community-comment"
import { createCommunityComment } from "@/lib/actions"
import { createClient } from "@/lib/supabase/client"

interface Comment {
  id: string
  content: string
  author_name: string | null
  show_author: boolean
  like_count: number
  created_at: string
  parent_id: string | null
  user_has_liked?: boolean
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [commentCount, setCommentCount] = useState(initialCommentCount)

  const fetchComments = async () => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("community_comments")
      .select("*")
      .eq("post_id", postId)
      .eq("is_approved", true)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching comments:", error)
      return
    }

    setComments(data || [])
    setLoading(false)
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

  useEffect(() => {
    fetchComments()
  }, [postId])

  // Organize comments into a tree structure
  const organizeComments = (comments: Comment[]) => {
    const commentMap = new Map()
    const rootComments: any[] = []

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
            <div className="space-y-1">
              {organizedComments.map((comment) => (
                <CommunityComment
                  key={comment.id}
                  comment={comment}
                  postId={postId}
                  isAuthenticated={isAuthenticated}
                />
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
