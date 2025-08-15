"use client"

import { useState } from "react"
import { Heart, Reply, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { likeCommunityComment, createCommunityComment } from "@/lib/actions"

interface CommunityComment {
  id: string
  content: string
  author_name: string | null
  show_author: boolean
  like_count: number
  created_at: string
  user_has_liked?: boolean
  replies?: CommunityComment[]
}

interface CommunityCommentProps {
  comment: CommunityComment
  postId: string
  isAuthenticated?: boolean
  depth?: number
}

export function CommunityComment({ comment, postId, isAuthenticated, depth = 0 }: CommunityCommentProps) {
  const [liked, setLiked] = useState(comment.user_has_liked || false)
  const [likeCount, setLikeCount] = useState(comment.like_count)
  const [isLiking, setIsLiking] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [isReplying, setIsReplying] = useState(false)

  const handleLike = async () => {
    if (!isAuthenticated) return

    setIsLiking(true)
    const result = await likeCommunityComment(comment.id)

    if (result.success) {
      setLiked(result.liked)
      setLikeCount((prev) => (result.liked ? prev + 1 : prev - 1))
    }

    setIsLiking(false)
  }

  const handleReply = async () => {
    if (!replyContent.trim()) return

    setIsReplying(true)
    const result = await createCommunityComment(postId, replyContent, comment.id)

    if (result.success) {
      setReplyContent("")
      setShowReplyForm(false)
      // Refresh the page to show the new reply
      window.location.reload()
    }

    setIsReplying(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const maxDepth = 3 // Limit nesting depth

  return (
    <div className={`${depth > 0 ? "ml-6 border-l-2 border-border pl-4" : ""}`}>
      <div className="flex gap-3 py-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="text-xs">
            {comment.show_author && comment.author_name ? (
              comment.author_name.charAt(0).toUpperCase()
            ) : (
              <User className="h-3 w-3" />
            )}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">
              {comment.show_author && comment.author_name ? comment.author_name : "Anonymous"}
            </span>
            <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
          </div>

          <p className="text-sm text-foreground mb-2 whitespace-pre-wrap">{comment.content}</p>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLiking || !isAuthenticated}
              className={`h-7 px-2 gap-1 text-xs ${liked ? "text-red-500" : "text-muted-foreground"}`}
            >
              <Heart className={`h-3 w-3 ${liked ? "fill-current" : ""}`} />
              {likeCount > 0 && likeCount}
            </Button>

            {depth < maxDepth && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                disabled={!isAuthenticated}
                className="h-7 px-2 gap-1 text-xs text-muted-foreground"
              >
                <Reply className="h-3 w-3" />
                Reply
              </Button>
            )}
          </div>

          {showReplyForm && (
            <div className="mt-3 space-y-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                rows={3}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleReply} disabled={isReplying || !replyContent.trim()}>
                  {isReplying ? "Replying..." : "Reply"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowReplyForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map((reply) => (
                <CommunityComment
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  isAuthenticated={isAuthenticated}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
