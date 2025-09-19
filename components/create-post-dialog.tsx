"use client"

import { useState } from "react"
import { Plus, ImageIcon, LinkIcon, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createCommunityPost } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { useMobile } from "@/hooks/use-mobile"

function CreatePostForm({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [imageUrls, setImageUrls] = useState([""]) // Start with one empty image URL field
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

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setError("")

    // Add all image URLs to form data as a comma-separated string
    const validImageUrls = imageUrls.filter(url => url.trim() !== "")
    if (validImageUrls.length > 0) {
      formData.append("imageUrls", validImageUrls.join(","))
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

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Image URLs (optional)</Label>
          <Button type="button" variant="outline" size="sm" onClick={addImageField} className="gap-1">
            <Plus className="h-3 w-3" />
            Add Image
          </Button>
        </div>
        
        <div className="space-y-2">
          {imageUrls.map((url, index) => (
            <div key={index} className="flex items-center gap-2">
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
          ))}
        </div>
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

      {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
        </DialogHeader>
        <CreatePostForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
