"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, User, ExternalLink, Heart, MessageCircle, Eye, Play, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VerificationBadge } from "@/components/verification-badge"
import { CommunityCommentsSection } from "@/components/community-comments-section"
import { AuthorProfileModal } from "@/components/author-profile-modal"
import { createClient } from "@/lib/supabase/client"
import { likeCommunityPost } from "@/lib/actions"
import { cn } from "@/lib/utils"
import Link from "next/link"

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
  author_is_verified?: boolean
  image_urls?: string | string[] | null
  video_urls?: string | string[] | null
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

// Helper function to safely parse media URLs
const parseMediaUrls = (mediaData: string | string[] | null): string[] => {
  if (!mediaData) return []
  
  try {
    if (typeof mediaData === 'string') {
      // Try parsing as JSON first
      if (mediaData.trim().startsWith('[') || mediaData.trim().startsWith('{')) {
        return JSON.parse(mediaData)
      }
      // If it's a comma-separated string
      if (mediaData.includes(',')) {
        return mediaData.split(',').map(url => url.trim()).filter(url => url.length > 0)
      }
      // Single URL
      return mediaData.trim() ? [mediaData.trim()] : []
    } else if (Array.isArray(mediaData)) {
      return mediaData.filter(url => url && url.trim().length > 0)
    }
  } catch (error) {
    console.error('Error parsing media URLs:', error)
  }
  
  return []
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
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null)
  const [activeMediaTab, setActiveMediaTab] = useState<'images' | 'videos'>('images')
  const [authorProfileImage, setAuthorProfileImage] = useState<string>("")
  const [authorIsVerified, setAuthorIsVerified] = useState<boolean>(false)
  const [showAuthorModal, setShowAuthorModal] = useState(false)

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
        .single()

      if (error) {
        console.error("Error fetching post:", error)
        router.push("/community")
        return
      }

      setPost(data)
      setLiked(data.user_has_liked || false)
      setLikeCount(data.like_count)

      // Fetch author's profile data if author exists and shows their identity
      if (data.author_id && data.show_author) {
        const { data: authorProfile } = await supabase
          .from("users")
          .select("profile_image, is_verified")
          .eq("id", data.author_id)
          .single()
        
        if (authorProfile) {
          setAuthorProfileImage(authorProfile.profile_image || "")
          setAuthorIsVerified(authorProfile.is_verified || false)
        }
      }

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

  const handleAuthorClick = () => {
    if (post?.show_author && post?.author_id && post?.author_name) {
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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Parse media URLs from the database using the helper function
  const images = post ? parseMediaUrls(post.image_urls) : []
  const videos = post ? parseMediaUrls(post.video_urls) : []

  // Combine all media for modal navigation
  const allMedia = [
    ...images.map(url => ({ url, type: 'image' as const })),
    ...videos.map(url => ({ url, type: 'video' as const }))
  ]
  
  const hasMedia = images.length > 0 || videos.length > 0

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
    <>
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
                  <AvatarImage src={authorProfileImage || "/placeholder.svg"} />
                  <AvatarFallback>
                    {post.show_author && post.author_name ? (
                      getInitials(post.author_name)
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <span 
                    className={`font-medium ${
                      post.show_author && post.author_name && post.author_id
                        ? "text-primary hover:text-primary/80 cursor-pointer"
                        : ""
                    }`}
                    onClick={handleAuthorClick}
                  >
                    {post.show_author && post.author_name ? post.author_name : "Anonymous"}
                  </span>
                  <VerificationBadge isVerified={authorIsVerified} size="sm" />
                </div>
              </div>
            </header>

            {/* Post Content */}
            <div className="prose prose-gray max-w-none">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed mb-6">{post.content}</div>

              {/* Media Gallery */}
              {hasMedia && (
                <div className="my-8">
                  <Tabs value={activeMediaTab} onValueChange={(value) => setActiveMediaTab(value as 'images' | 'videos')} className="w-full">
                    {/* Only show tabs if both images and videos exist */}
                    {images.length > 0 && videos.length > 0 && (
                      <TabsList className="grid w-full grid-cols-2 mb-6 max-w-md">
                        <TabsTrigger value="images" type="button" className="text-sm">
                          Images ({images.length})
                        </TabsTrigger>
                        <TabsTrigger value="videos" type="button" className="text-sm">
                          Videos ({videos.length})
                        </TabsTrigger>
                      </TabsList>
                    )}
                    
                    {/* Images Tab */}
                    <TabsContent value="images" className={images.length === 0 ? "hidden" : "mt-0"}>
                      {images.length > 0 && (
                        <div className={cn(
                          "grid gap-4",
                          images.length === 1 
                            ? "grid-cols-1" 
                            : images.length === 2 
                              ? "grid-cols-1 md:grid-cols-2" 
                              : "grid-cols-2 lg:grid-cols-3"
                        )}>
                          {images.map((imageUrl, index) => (
                            <div
                              key={index}
                              className={cn(
                                "cursor-pointer overflow-hidden rounded-xl border-2 border-gray-200 bg-muted transition-all hover:scale-[1.02] hover:shadow-xl hover:border-gray-300",
                                images.length === 1 
                                  ? "aspect-video max-w-3xl mx-auto" 
                                  : "aspect-video",
                                "w-full"
                              )}
                              onClick={() => openMediaModal(index)}
                            >
                              <img
                                src={imageUrl}
                                alt={`Post image ${index + 1}`}
                                className="h-full w-full object-cover transition-transform duration-300"
                                loading="lazy"
                                onError={(e) => {
                                  console.error(`Failed to load image: ${imageUrl}`)
                                  e.currentTarget.src = "/placeholder.svg"
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                    
                    {/* Videos Tab */}
                    <TabsContent value="videos" className={videos.length === 0 ? "hidden" : "mt-0"}>
                      {videos.length > 0 && (
                        <div className={cn(
                          "grid gap-4",
                          videos.length === 1 
                            ? "grid-cols-1" 
                            : "grid-cols-1 md:grid-cols-2"
                        )}>
                          {videos.map((videoUrl, index) => (
                            <div
                              key={index}
                              className={cn(
                                "cursor-pointer overflow-hidden rounded-xl border-2 border-gray-200 bg-muted transition-all hover:scale-[1.02] hover:shadow-xl hover:border-gray-300 relative group",
                                videos.length === 1 
                                  ? "aspect-video max-w-3xl mx-auto" 
                                  : "aspect-video",
                                "w-full"
                              )}
                              onClick={() => openMediaModal(images.length + index)}
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
                                    <div className="bg-red-600 text-white rounded-full p-4">
                                      <Play className="h-8 w-8 fill-current" />
                                    </div>
                                  </div>
                                </div>
                              ) : isVimeoUrl(videoUrl) ? (
                                <div className="relative h-full w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                  <div className="bg-white/20 backdrop-blur-sm text-white rounded-full p-4">
                                    <Play className="h-8 w-8 fill-current" />
                                  </div>
                                  <div className="absolute bottom-3 right-3 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded">
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
                                    <div className="bg-white/20 backdrop-blur-sm text-white rounded-full p-4">
                                      <Play className="h-8 w-8 fill-current" />
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

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
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

      {/* Media Modal */}
      <Dialog open={selectedMediaIndex !== null} onOpenChange={(open) => !open && closeMediaModal()}>
        <DialogContent className="max-w-6xl p-0 bg-transparent border-none">
          {selectedMediaIndex !== null && allMedia[selectedMediaIndex] && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70"
                onClick={closeMediaModal}
              >
                <X className="h-6 w-6" />
              </Button>
              
              {allMedia.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 z-50 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70 -translate-y-1/2"
                    onClick={goToPrevMedia}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 z-50 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70 -translate-y-1/2"
                    onClick={goToNextMedia}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
              
              <div className="flex items-center justify-center h-[85vh]">
                {allMedia[selectedMediaIndex].type === 'image' ? (
                  <img
                    src={allMedia[selectedMediaIndex].url}
                    alt={`Post media ${selectedMediaIndex + 1}`}
                    className="max-h-full max-w-full object-contain rounded-lg"
                    onError={(e) => {
                      console.error(`Failed to load modal image: ${allMedia[selectedMediaIndex].url}`)
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center max-w-5xl">
                    {isYouTubeUrl(allMedia[selectedMediaIndex].url) || isVimeoUrl(allMedia[selectedMediaIndex].url) ? (
                      <iframe
                        src={getEmbedUrl(allMedia[selectedMediaIndex].url)}
                        className="w-full h-full max-w-5xl max-h-[80vh] rounded-lg"
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
                      className={`h-3 w-3 rounded-full ${
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

      {/* Author Profile Modal */}
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
