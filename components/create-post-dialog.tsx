"use client"

import { useState } from "react"
import { Plus, ImageIcon, LinkIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createCommunityPost } from "@/lib/actions"
import { useRouter } from "next/navigation"

export function CreatePostDialog() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setError("")

    const result = await createCommunityPost(formData)

    if (result.error) {
      setError(result.error)
    } else {
      setOpen(false)
      router.refresh()
    }

    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
        </DialogHeader>

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
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="imageUrl" name="imageUrl" placeholder="https://example.com/image.jpg" className="pl-10" />
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
