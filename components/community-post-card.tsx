"use client"

import { useState } from "react"
import { Heart, MessageCircle, ExternalLink, Pin, Calendar, User, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { AuthorProfileModal } from "./author-profile-modal"
import { likeCommunityPost } from "@/lib/actions"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface CommunityPost {
  id: string
  title: string
  content: string
  post_type: string
  author_id?: string
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
  author_profile_picture?: string
}

interface CommunityPostCardProps {
  post: CommunityPost
  isAuthenticated?: boolean
}

export function CommunityPostCard({ post, isAuthenticated }: CommunityPostCardProps) {
  const [liked, setLiked] = useState(post.user_has_liked || false)
  const [likeCount, setLikeCount] = useState(post.like_count)
  const [isLiking, setIsLiking] = useState(false)
  const [showAuthorModal, setShowAuthorModal] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  // If image_url is a string, convert it to an array
  const images = post.image_url 
    ? (Array.isArray(post.image_url) ? post.image_url : [post.image_url])
    : []

  const handleLike = async () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return
    }

    setIsLiking(true)
    const result = await likeCommunityPost(post.id)

    if (result.success) {
      setLiked(result.liked)
      setLikeCount((prev) => (result.liked ? prev + 1 : prev - 1))
    }

    setIsLiking(false)
  }

  const handleAuthorClick = () => {
    if (post.show_author && post.author_id && post.author_name) {
      setShowAuthorModal(true)
    }
  }

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index)
  }

  const closeImageModal = () => {
    setSelectedImageIndex(null)
  }

  const goToNextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % images.length)
    }
  }

  const goToPrevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length)
    }
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
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              {post.is_pinned && <Pin className="h-4 w-4 text-primary shrink-0" />}
              <Badge variant="outline" className={`text-xs ${getPostTypeColor(post.post_type)}`}>
                {post.post_type.charAt(0).toUpperCase() + post.post_type.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {formatDate(post.created_at)}
            </div>
          </div>

          <Link href={`/community/${post.id}`}>
            <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors cursor-pointer line-clamp-2">
              {post.title}
            </h3>
          </Link>

          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.author_profile_picture || "/placeholder.svg"} />
              <AvatarFallback className="text-xs">
                {post.show_author && post.author_name ? (
                  post.author_name.charAt(0).toUpperCase()
                ) : (
                  <User className="h-3 w-3" />
                )}
              </AvatarFallback>
            </Avatar>
            <span
              className={`text-sm ${
                post.show_author && post.author_name && post.author_id
                  ? "text-primary hover:text-primary/80 cursor-pointer font-medium"
                  : "text-muted-foreground"
              }`}
              onClick={handleAuthorClick}
            >
              {post.show_author && post.author_name ? post.author_name : "Anonymous"}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Content with image gallery */}
          <div className={cn(
            "flex flex-col lg:flex-row gap-4 mb-4",
            images.length > 0 && "items-start"
          )}>
            {/* Text content */}
            <div className={cn(
              "flex-1",
              images.length > 0 && "lg:min-w-0"
            )}>
              <p className="text-muted-foreground">{post.content}</p>
            </div>
            
            {/* Image gallery - appears beside text on large screens, below on small screens */}
            {images.length > 0 && (
              <div className="lg:w-48 flex-shrink-0">
                <div className="grid grid-cols-2 gap-2">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square cursor-pointer overflow-hidden rounded-lg border bg-muted transition-transform hover:scale-105"
                      onClick={() => openImageModal(index)}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Post image ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {post.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {post.tags.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{post.tags.length - 4}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLiking}
                className={`gap-2 ${liked ? "text-red-500" : "text-muted-foreground"}`}
              >
                <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                {likeCount}
              </Button>

              <Link href={`/community/${post.id}`}>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  {post.comment_count}
                </Button>
              </Link>
            </div>

            {post.external_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(post.external_url!, "_blank")}
                className="gap-2"
              >
                <ExternalLink className="h-3 w-3" />
                Visit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Modal */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={(open) => !open && closeImageModal()}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          {selectedImageIndex !== null && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70"
                onClick={closeImageModal}
              >
                <X className="h-6 w-6" />
              </Button>
              
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 z-50 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 -translate-y-1/2"
                    onClick={goToPrevImage}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 z-50 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 -translate-y-1/2"
                    onClick={goToNextImage}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
              
              <div className="flex items-center justify-center h-[80vh]">
                <img
                  src={images[selectedImageIndex] || "/placeholder.svg"}
                  alt={`Post image ${selectedImageIndex + 1}`}
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
              </div>
              
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full ${
                        index === selectedImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {post.author_id && post.author_name && (
        <AuthorProfileModal
          authorId={post.author_id}
          authorName={post.author_name}
          isOpen={showAuthorModal}
          onClose={() => setShowAuthorModal(false)}
        />
      )}
    </>
  )
}
