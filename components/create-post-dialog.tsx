"use client"

import { useState } from "react"
import { Plus, ImageIcon, LinkIcon, Trash2, Video, Upload } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createCommunityPost } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

function CreatePostForm({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [imageUrls, setImageUrls] = useState([""]) // Start with one empty image URL field
  const [videoUrls, setVideoUrls] = useState([""]) // Start with one empty video URL field
  const [activeMediaTab, setActiveMediaTab] = useState("images")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [postType, setPostType] = useState("discussion")
  const [externalUrl, setExternalUrl] = useState("")
  const [tags, setTags] = useState("")
  const [showAuthor, setShowAuthor] = useState(true)
  const router = useRouter()

  const addImageField = () => {
    setImageUrls([...imageUrls, ""])
  }

  const removeImageField = (index: number) => {
    if (imageUrls.length > 1) {
      setImageUrls(imageUrls.filter((_, i) => i !== index))
    }
  }

  const updateImageUrl = (index: number, value: string) => {
    const newImageUrls = [...imageUrls]
    newImageUrls[index] = value
    setImageUrls(newImageUrls)
  }

  const addVideoField = () => {
    setVideoUrls([...videoUrls, ""])
  }

  const removeVideoField = (index: number) => {
    if (videoUrls.length > 1) {
      setVideoUrls(videoUrls.filter((_, i) => i !== index))
    }
  }

  const updateVideoUrl = (index: number, value: string) => {
    const newVideoUrls = [...videoUrls]
    newVideoUrls[index] = value
    setVideoUrls(newVideoUrls)
  }

  // Function to check if URL is a valid video URL (YouTube, Vimeo, etc.)
  const isValidVideoUrl = (url: string) => {
    const videoPatterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
      /(?:vimeo\.com\/)([0-9]+)/,
      /\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)(\?.*)?$/i
    ]
    return videoPatterns.some(pattern => pattern.test(url))
  }

  // Function to validate if URL is a valid image URL
  const isValidImageUrl = (url: string) => {
    const imagePatterns = [
      /\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?.*)?$/i,
      /^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?.*)?$/i,
      // Allow common image hosting domains even without file extensions
      /^https?:\/\/(.*\.)?(imgur|cloudinary|unsplash|pexels|pixabay|freepik)\.com\/.+/i,
      // Allow data URLs for base64 images
      /^data:image\/.+;base64,.+/i
    ]
    return imagePatterns.some(pattern => pattern.test(url))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Validate required fields
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required")
      setIsSubmitting(false)
      return
    }

    // Filter and validate image URLs
    const validImageUrls = imageUrls
      .map(url => url.trim())
      .filter(url => url !== "")
    
    if (validImageUrls.length > 0) {
      const invalidImages = validImageUrls.filter(url => !isValidImageUrl(url))
      if (invalidImages.length > 0) {
        setError(`Please enter valid image URLs. Invalid URLs: ${invalidImages.slice(0, 2).join(", ")}${invalidImages.length > 2 ? "..." : ""}`)
        setIsSubmitting(false)
        return
      }
    }

    // Filter and validate video URLs
    const validVideoUrls = videoUrls
      .map(url => url.trim())
      .filter(url => url !== "")
    
    if (validVideoUrls.length > 0) {
      const invalidVideos = validVideoUrls.filter(url => !isValidVideoUrl(url))
      if (invalidVideos.length > 0) {
        setError("Please enter valid video URLs (YouTube, Vimeo, or direct video file links)")
        setIsSubmitting(false)
        return
      }
    }

    try {
      // Create FormData
      const formData = new FormData()
      formData.append("title", title.trim())
      formData.append("content", content.trim())
      formData.append("postType", postType)
      formData.append("externalUrl", externalUrl.trim())
      formData.append("tags", tags.trim())
      formData.append("showAuthor", showAuthor.toString())

      // Ensure data URLs are properly formatted before sending
      const cleanImageUrls = validImageUrls.map(url => {
        // Make sure data URLs don't have any extra characters
        if (url.startsWith('data:image/')) {
          return url.trim();
        }
        return url;
      });

      // Store URLs as JSON arrays instead of comma-separated strings
      if (cleanImageUrls.length > 0) {
        formData.append("imageUrls", JSON.stringify(cleanImageUrls))
      }

      if (validVideoUrls.length > 0) {
        formData.append("videoUrls", JSON.stringify(validVideoUrls))
      }

      console.log("Sending image URLs:", validImageUrls)
      console.log("Sending video URLs:", validVideoUrls)

      const result = await createCommunityPost(formData)

      if (result.error) {
        setError(result.error)
      } else {
        // Reset form
        setTitle("")
        setContent("")
        setPostType("discussion")
        setExternalUrl("")
        setTags("")
        setShowAuthor(true)
        setImageUrls([""])
        setVideoUrls([""])
        
        onSuccess()
        router.refresh()
      }
    } catch (error) {
      console.error("Error creating post:", error)
      setError("An unexpected error occurred. Please try again.")
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input 
          id="title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's your post about?" 
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="postType">Post Type</Label>
        <Select value={postType} onValueChange={setPostType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="discussion">Discussion</SelectItem>
            <SelectItem value="question">Question</SelectItem>
            <SelectItem value="showcase">Showcase</SelectItem>
            <SelectItem value="advertisement">Advertisement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts, ask a question, or showcase your work..."
          rows={4}
          required
        />
      </div>

      {/* Media Section with Tabs */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Media (Optional)</Label>
        <Tabs value={activeMediaTab} onValueChange={setActiveMediaTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="images" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Images
              {imageUrls.filter(url => url.trim()).length > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
                  {imageUrls.filter(url => url.trim()).length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Videos
              {videoUrls.filter(url => url.trim()).length > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
                  {videoUrls.filter(url => url.trim()).length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="images" className="mt-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Add image URLs to your post</p>
                  <p className="text-xs text-muted-foreground">
                    Supports JPG, PNG, GIF, WebP and popular image hosting sites
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addImageField} className="gap-1">
                  <Plus className="h-3 w-3" />
                  Add Image
                </Button>
              </div>
              
              <div className="space-y-2">
                {imageUrls.map((url, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={url}
                          onChange={(e) => updateImageUrl(index, e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="pl-10"
                        />
                      </div>
                      {imageUrls.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeImageField(index)}
                          className="h-10 w-10 text-muted-foreground hover:text-destructive shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {/* Image Preview */}
                    {url.trim() && isValidImageUrl(url) && (
                      <div className="ml-10 relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}

                    {url.trim() && !isValidImageUrl(url) && (
                      <div className="ml-10">
                        <p className="text-xs text-destructive">Please enter a valid image URL</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="videos" className="mt-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Add video URLs to your post</p>
                  <p className="text-xs text-muted-foreground">Supports YouTube, Vimeo, and direct video file links</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addVideoField} className="gap-1">
                  <Plus className="h-3 w-3" />
                  Add Video
                </Button>
              </div>
              
              <div className="space-y-2">
                {videoUrls.map((url, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Video className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={url}
                          onChange={(e) => updateVideoUrl(index, e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                          className="pl-10"
                        />
                      </div>
                      {videoUrls.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeVideoField(index)}
                          className="h-10 w-10 text-muted-foreground hover:text-destructive shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {/* Video Preview */}
                    {url.trim() && isValidVideoUrl(url) && (
                      <div className="ml-10">
                        <div className="w-32 h-20 bg-muted rounded-lg border flex items-center justify-center">
                          <Video className="h-6 w-6 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground ml-1">Video</span>
                        </div>
                      </div>
                    )}
                    
                    {url.trim() && !isValidVideoUrl(url) && (
                      <div className="ml-10">
                        <p className="text-xs text-destructive">Please enter a valid video URL</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-2">
        <Label htmlFor="externalUrl">External Link (optional)</Label>
        <div className="relative">
          <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            id="externalUrl" 
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            placeholder="https://your-project.com" 
            className="pl-10" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input 
          id="tags" 
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="productivity, ai, design" 
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="showAuthor" 
          checked={showAuthor}
          onCheckedChange={setShowAuthor}
        />
        <Label htmlFor="showAuthor">Show my name as the author</Label>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "Creating..." : "Create Post"}
        </Button>
      </div>
    </form>
  )
}

export function CreatePostDialog() {
  const [open, setOpen] = useState(false)
  const isMobile = useMobile()

  const handleSuccess = () => {
    setOpen(false)
  }

  const TriggerButton = (
    <Button className="gap-2">
      <Plus className="h-4 w-4" />
      Create Post
    </Button>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Create a New Post</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto scrollbar-hide">
            <CreatePostForm onSuccess={handleSuccess} />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
        </DialogHeader>
        <CreatePostForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
