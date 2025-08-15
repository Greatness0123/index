"use client"

import { useState } from "react"
import { ArrowLeft, ExternalLink, Heart, Share2, Eye, MessageCircle, User, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CommentSection } from "./comment-section"
import { RatingDisplay } from "./rating-display"
import { ScreenshotGallery } from "./screenshot-gallery"
import { toggleFavorite, trackToolClick, deleteTool } from "@/lib/actions"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ToolDetailViewProps {
  tool: any
  user: any
  isFavorited: boolean
  similarTools: any[]
}

export function ToolDetailView({ tool, user, isFavorited: initialFavorited, similarTools }: ToolDetailViewProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [favoriteCount, setFavoriteCount] = useState(tool.stats?.favorite_count || 0)
  const [shareMessage, setShareMessage] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const isOwner = user && tool.submitted_by === user.id

  const handleFavoriteToggle = async () => {
    if (!user) {
      // Redirect to login or show login modal
      window.location.href = "/auth/login"
      return
    }

    const result = await toggleFavorite(tool.id)
    if (result.success) {
      setIsFavorited(!isFavorited)
      setFavoriteCount((prev) => (isFavorited ? prev - 1 : prev + 1))
    }
  }

  const handleVisitTool = async () => {
    await trackToolClick(tool.id)
    window.open(tool.url, "_blank")
  }

  const handleDeleteTool = async () => {
    if (!confirm("Are you sure you want to delete this tool? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    const result = await deleteTool(tool.id)

    if (result.success) {
      router.push("/")
    } else {
      alert(result.error || "Failed to delete tool")
      setIsDeleting(false)
    }
  }

  const handleShare = async () => {
    try {
      // Check if Web Share API is supported and available
      if (navigator.share && navigator.canShare) {
        const shareData = {
          title: tool.name,
          text: tool.description,
          url: window.location.href,
        }

        // Check if the data can be shared
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData)
          return
        }
      }

      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href)
      setShareMessage("Link copied to clipboard!")

      // Clear message after 3 seconds
      setTimeout(() => setShareMessage(""), 3000)
    } catch (error) {
      console.log("[v0] Share failed, falling back to clipboard:", error)

      // Final fallback - try clipboard again or show manual copy option
      try {
        await navigator.clipboard.writeText(window.location.href)
        setShareMessage("Link copied to clipboard!")
        setTimeout(() => setShareMessage(""), 3000)
      } catch (clipboardError) {
        // If clipboard also fails, show the URL for manual copying
        setShareMessage(`Copy this link: ${window.location.href}`)
        setTimeout(() => setShareMessage(""), 5000)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tools
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tool Header */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center overflow-hidden shrink-0">
                {tool.image_url ? (
                  <img
                    src={tool.image_url || "/placeholder.svg"}
                    alt={`${tool.name} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-muted-foreground">{tool.name.charAt(0)}</span>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold">{tool.name}</h1>
                    {tool.is_featured && <Badge className="bg-accent text-accent-foreground">Featured</Badge>}
                    {isOwner && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteTool}
                        disabled={isDeleting}
                        className="ml-auto text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {isDeleting ? "Deleting..." : "Delete"}
                      </Button>
                    )}
                  </div>

                  {tool.category && (
                    <Badge variant="secondary" className="mb-3">
                      {tool.category.name}
                    </Badge>
                  )}

                  <p className="text-lg text-muted-foreground">{tool.description}</p>

                  {tool.show_author && tool.submitter && tool.submitter.id !== user?.id && (
                    <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>
                        Uploaded by{" "}
                        <span className="font-medium text-foreground">
                          {tool.submitter.display_name || tool.submitter.full_name || "Anonymous"}
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <RatingDisplay rating={tool.rating} ratingCount={tool.rating_count} />

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    {tool.stats?.view_count || 0} views
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    {tool.stats?.comment_count || 0} comments
                  </div>

                  {tool.pricing && <Badge variant="outline">{tool.pricing}</Badge>}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleVisitTool} className="bg-primary hover:bg-primary/90">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Tool
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleFavoriteToggle}
                    className={isFavorited ? "text-red-500 border-red-500" : ""}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isFavorited ? "fill-current" : ""}`} />
                    {isFavorited ? "Favorited" : "Add to Favorites"} ({favoriteCount})
                  </Button>

                  <div className="relative">
                    <Button variant="outline" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    {shareMessage && (
                      <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-md border z-10 whitespace-nowrap">
                        {shareMessage}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {tool.tags && tool.tags.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tagRelation: any) => (
                    <Badge key={tagRelation.tag.slug} variant="outline">
                      {tagRelation.tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Screenshots */}
            {tool.screenshots && tool.screenshots.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Screenshots</h3>
                <ScreenshotGallery screenshots={tool.screenshots} toolName={tool.name} />
              </div>
            )}

            {/* Comments Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Reviews & Comments</h3>
              <CommentSection toolId={tool.id} user={user} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tool Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Views</span>
                  <span className="font-medium">{tool.stats?.view_count || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Favorites</span>
                  <span className="font-medium">{favoriteCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Comments</span>
                  <span className="font-medium">{tool.stats?.comment_count || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Clicks</span>
                  <span className="font-medium">{tool.stats?.click_count || 0}</span>
                </div>
              </CardContent>
            </Card>

            {/* Similar Tools */}
            {similarTools.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Similar Tools</h3>
                <div className="space-y-4">
                  {similarTools.map((similarTool) => (
                    <div key={similarTool.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center overflow-hidden">
                          {similarTool.image_url ? (
                            <img
                              src={similarTool.image_url || "/placeholder.svg"}
                              alt={similarTool.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-bold">{similarTool.name.charAt(0)}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <Link href={`/tools/${similarTool.id}`} className="font-medium hover:text-primary">
                            {similarTool.name}
                          </Link>
                          {similarTool.category && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {similarTool.category.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{similarTool.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
