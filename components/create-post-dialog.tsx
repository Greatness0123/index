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

  // Function to generate YouTube embed URL
  const getEmbedUrl = (url: string) => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`
    }
    
    // Vimeo
    const vimeoMatch = url.match(/(?:vimeo\.com\/)([0-9]+)/)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }
    
    return url // Return original URL for direct video files
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setError("")

    // Add all image URLs to form data as a comma-separated string
    const validImageUrls = imageUrls.filter(url => url.trim() !== "")
    if (validImageUrls.length > 0) {
      formData.append("imageUrls", validImageUrls.join(","))
    }

    // Add all video URLs to form data as a comma-separated string
    const validVideoUrls = videoUrls.filter(url => url.trim() !== "")
    if (validVideoUrls.length > 0) {
      // Validate video URLs before submitting
      const invalidVideos = validVideoUrls.filter(url => !isValidVideoUrl(url))
      if (invalidVideos.length > 0) {
        setError("Please enter valid video URLs (YouTube, Vimeo, or direct video file links)")
        setIsSubmitting(false)
        return
      }
      formData.append("videoUrls", validVideoUrls.join(","))
    }

    const result = await createCommunityPost(formData)

    if (result.error) {
      setError(result.error)
    } else {
      onSuccess()
      router.refresh()
    }

    setIsSubmitting(false)
  }

  const hasMedia = imageUrls.some(url => url.trim() !== "") || videoUrls.some(url => url.trim() !== "")

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" name="title" placeholder="What's your post about?" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="postType">Post Type</Label>
        <Select name="postType" defaultValue="discussion">
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
          name="content"
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
                <p className="text-sm text-muted-foreground">Add image URLs to your post</p>
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
                          className="h-10 w-10 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {/* Image Preview */}
                    {url.trim() && (
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
                          className="h-10 w-10 text-muted-foreground hover:text-destructive"
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
          <Input id="externalUrl" name="externalUrl" placeholder="https://your-project.com" className="pl-10" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input id="tags" name="tags" placeholder="productivity, ai, design" />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="showAuthor" name="showAuthor" defaultChecked />
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
