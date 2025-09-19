"use client"

import { useState, useEffect } from "react"
import { Heart, MessageCircle, ExternalLink, Pin, Calendar, User, X, ChevronLeft, ChevronRight, Play } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  external_url: string | null
  tags: string[]
  is_pinned: boolean
  like_count: number
  comment_count: number
  view_count: number
  created_at: string
  user_has_liked?: boolean
  author_profile_picture?: string
  image_urls?: string | string[] | null
  video_urls?: string | string[] | null
  images?: string[]
  videos?: string[]
}

interface CommunityPostCardProps {
  post: CommunityPost
  isAuthenticated?: boolean
}

// Function to check if URL is YouTube
const isYouTubeUrl = (url: string) => {
  return /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/.test(url)
}

// Function to check if URL is Vimeo
const isVimeoUrl = (url: string) => {
  return /(?:vimeo\.com\/)([0-9]+)/.test(url)
}

// Function to generate embed URL
const getEmbedUrl = (url: string) => {
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0`
  }
  
  // Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/)([0-9]+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }
  
  return url
}

// Function to get video thumbnail
const getVideoThumbnail = (url: string) => {
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`
  }
  return null
}

export function CommunityPostCard({ post, isAuthenticated }: CommunityPostCardProps) {
  const [liked, setLiked] = useState(post.user_has_liked || false)
  const [likeCount, setLikeCount] = useState(post.like_count)
  const [isLiking, setIsLiking] = useState(false)
  const [showAuthorModal, setShowAuthorModal] = useState(false)
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null)
  const [activeMediaTab, setActiveMediaTab] = useState<'images' | 'videos'>('images')

  // Parse media URLs from the database
  let images: string[] = []
  let videos: string[] = []

  // Handle different possible formats of media URLs
  if (post.images && Array.isArray(post.images)) {
    images = post.images
  } else if (post.image_urls) {
    try {
      if (typeof post.image_urls === 'string') {
        images = JSON.parse(post.image_urls)
      } else if (Array.isArray(post.image_urls)) {
        images = post.image_urls
      }
    } catch {
      images = []
    }
  }

  if (post.videos && Array.isArray(post.videos)) {
    videos = post.videos
  } else if (post.video_urls) {
    try {
      if (typeof post.video_urls === 'string') {
        videos = JSON.parse(post.video_urls)
      } else if (Array.isArray(post.video_urls)) {
        videos = post.video_urls
      }
    } catch {
      videos = []
    }
  }

  // Combine all media for modal navigation
  const allMedia = [
    ...images.map(url => ({ url, type: 'image' as const })),
    ...videos.map(url => ({ url, type: 'video' as const }))
  ]
  
  const hasMedia = images.length > 0 || videos.length > 0

  const handleLike = async () => {
    if (!isAuthenticated) {
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

  const openMediaModal = (index: number) => {
    setSelectedMediaIndex(index)
  }

  const closeMediaModal = () => {
    setSelectedMediaIndex(null)
  }

  const goToNextMedia = () => {
    if (selectedMediaIndex !== null && allMedia.length > 0) {
      setSelectedMediaIndex((selectedMediaIndex + 1) % allMedia.length)
    }
  }

  const goToPrevMedia = () => {
    if (selectedMediaIndex !== null && allMedia.length > 0) {
      setSelectedMediaIndex((selectedMediaIndex - 1 + allMedia.length) % allMedia.length)
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

  // Set initial active tab based on available media
  useEffect(() => {
    if (images.length > 0 && videos.length === 0) {
      setActiveMediaTab('images')
    } else if (videos.length > 0 && images.length === 0) {
      setActiveMediaTab('videos')
    } else if (images.length > 0) {
      setActiveMediaTab('images')
    }
  }, [images.length, videos.length])

  return (
    <>
      <Link href={`/community/${post.id}`} className="block">
        <Card className="hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer">
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

            <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>

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
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleAuthorClick()
                }}
              >
                {post.show_author && post.author_name ? post.author_name : "Anonymous"}
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Content and Media Layout */}
            <div className={cn(
              "flex flex-col gap-4 mb-4",
              hasMedia && "md:flex-row md:gap-6"
            )}>
              {/* Text content */}
              <div className={cn(
                "flex-1 min-w-0",
                hasMedia && "md:flex-[3]"
              )}>
                <p className="text-muted-foreground leading-relaxed">{post.content}</p>
              </div>
              
              {/* Media Gallery - Only show if there's media */}
              {hasMedia && (
                <div 
                  className={cn(
                    "flex-shrink-0",
                    hasMedia && "md:flex-[2] md:max-w-md"
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <Tabs value={activeMediaTab} onValueChange={(value) => setActiveMediaTab(value as 'images' | 'videos')} className="w-full">
                    {/* Only show tabs if both images and videos exist */}
                    {images.length > 0 && videos.length > 0 && (
                      <TabsList className="grid w-full grid-cols-2 mb-3">
                        <TabsTrigger value="images" className="text-xs">
                          Images ({images.length})
                        </TabsTrigger>
                        <TabsTrigger value="videos" className="text-xs">
                          Videos ({videos.length})
                        </TabsTrigger>
                      </TabsList>
                    )}
                    
                    {/* Images Tab */}
                    <TabsContent value="images" className={images.length === 0 ? "hidden" : "m-0"}>
                      {images.length > 0 && (
                        <div className={cn(
                          "grid gap-3",
                          images.length === 1 
                            ? "grid-cols-1" 
                            : images.length === 2 
                              ? "grid-cols-2 md:grid-cols-1" 
                              : images.length === 3
                                ? "grid-cols-2 md:grid-cols-2"
                                : "grid-cols-2"
                        )}>
                          {images.map((imageUrl, index) => (
                            <div
                              key={index}
                              className={cn(
                                "cursor-pointer overflow-hidden rounded-xl border-2 border-gray-200 bg-muted transition-all hover:scale-105 hover:shadow-xl hover:border-gray-300",
                                images.length === 1 
                                  ? "aspect-video md:min-h-[200px]" 
                                  : images.length === 2
                                    ? "aspect-square md:aspect-video md:min-h-[150px]"
                                    : "aspect-square md:min-h-[120px]",
                                "w-full"
                              )}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                openMediaModal(index)
                              }}
                            >
                              <img
                                src={imageUrl || "/placeholder.svg"}
                                alt={`Post image ${index + 1}`}
                                className="h-full w-full object-cover transition-transform duration-300"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg"
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                    
                    {/* Videos Tab */}
                    <TabsContent value="videos" className={videos.length === 0 ? "hidden" : "m-0"}>
                      {videos.length > 0 && (
                        <div className={cn(
                          "grid gap-3",
                          videos.length === 1 
                            ? "grid-cols-1" 
                            : videos.length === 2 
                              ? "grid-cols-2 md:grid-cols-1" 
                              : "grid-cols-2"
                        )}>
                          {videos.map((videoUrl, index) => (
                            <div
                              key={index}
                              className={cn(
                                "cursor-pointer overflow-hidden rounded-xl border-2 border-gray-200 bg-muted transition-all hover:scale-105 hover:shadow-xl hover:border-gray-300 relative group",
                                videos.length === 1 
                                  ? "aspect-video md:min-h-[200px]" 
                                  : "aspect-video md:min-h-[150px]",
                                "w-full"
                              )}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                openMediaModal(images.length + index)
                              }}
                            >
                              {/* Video Thumbnail */}
                              {isYouTubeUrl(videoUrl) ? (
                                <div className="relative h-full w-full">
                                  <img
                                    src={getVideoThumbnail(videoUrl) || "/placeholder.svg"}
                                    alt={`Video ${index + 1}`}
                                    className="h-full w-full object-cover transition-transform duration-300"
                                    loading="lazy"
                                    onError={(e) => {
                                      e.currentTarget.src = "/placeholder.svg"
                                    }}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                                    <div className="bg-red-600 text-white rounded-full p-3">
                                      <Play className="h-6 w-6 fill-current" />
                                    </div>
                                  </div>
                                </div>
                              ) : isVimeoUrl(videoUrl) ? (
                                <div className="relative h-full w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                  <div className="bg-white/20 backdrop-blur-sm text-white rounded-full p-3">
                                    <Play className="h-6 w-6 fill-current" />
                                  </div>
                                  <div className="absolute bottom-2 right-2 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                                    Vimeo
                                  </div>
                                </div>
                              ) : (
                                <div className="relative h-full w-full">
                                  <video
                                    src={videoUrl}
                                    className="h-full w-full object-cover"
                                    preload="metadata"
                                    muted
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                                    <div className="bg-white/20 backdrop-blur-sm text-white rounded-full p-3">
                                      <Play className="h-6 w-6 fill-current" />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {post.tags.slice(0, 4).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
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
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleLike()
                  }}
                  disabled={isLiking}
                  className={`gap-2 ${liked ? "text-red-500" : "text-muted-foreground"}`}
                >
                  <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                  {likeCount}
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-muted-foreground"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // This will just navigate to the same page since the whole card is already a link
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  {post.comment_count}
                </Button>
              </div>

              {post.external_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(post.external_url!, "_blank")
                  }}
                  className="gap-2"
                >
                  <ExternalLink className="h-3 w-3" />
                  Visit
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Media Modal */}
      <Dialog open={selectedMediaIndex !== null} onOpenChange={(open) => !open && closeMediaModal()}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          {selectedMediaIndex !== null && allMedia[selectedMediaIndex] && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70"
                onClick={closeMediaModal}
              >
                <X className="h-6 w-6" />
              </Button>
              
              {allMedia.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 z-50 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 -translate-y-1/2"
                    onClick={goToPrevMedia}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 z-50 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 -translate-y-1/2"
                    onClick={goToNextMedia}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
              
              <div className="flex items-center justify-center h-[80vh]">
                {allMedia[selectedMediaIndex].type === 'image' ? (
                  <img
                    src={allMedia[selectedMediaIndex].url || "/placeholder.svg"}
                    alt={`Post media ${selectedMediaIndex + 1}`}
                    className="max-h-full max-w-full object-contain rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {isYouTubeUrl(allMedia[selectedMediaIndex].url) || isVimeoUrl(allMedia[selectedMediaIndex].url) ? (
                      <iframe
                        src={getEmbedUrl(allMedia[selectedMediaIndex].url)}
                        className="w-full h-full max-w-4xl max-h-[80vh] rounded-lg"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={allMedia[selectedMediaIndex].url}
                        className="max-h-full max-w-full object-contain rounded-lg"
                        controls
                        autoPlay
                      />
                    )}
                  </div>
                )}
              </div>
              
              {allMedia.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {allMedia.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full ${
                        index === selectedMediaIndex ? "bg-white" : "bg-white/50"
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
