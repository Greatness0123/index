"use client"

import { useState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { Plus, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { TagSelector } from "./tag-selector"
import { supabase } from "@/lib/supabase/client"
import { createClient } from "@/lib/supabase/client"
import { submitTool } from "@/lib/actions"
import { useMobile } from "@/hooks/use-mobile"
import { ImageUpload } from "./image-upload"
import { ScreenshotUpload } from "./screenshot-upload"
import { Badge } from "@/components/ui/badge"

interface Category {
  id: string
  name: string
  slug: string
}

function SubmitButton({ isFormValid }: { isFormValid: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending || !isFormValid} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        "Submit Tool"
      )}
    </Button>
  )
}

function SubmitForm({ onSuccess }: { onSuccess: () => void }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [logoUrl, setLogoUrl] = useState<string>("")
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [logoUrlInput, setLogoUrlInput] = useState<string>("")
  const [showAuthor, setShowAuthor] = useState<boolean>(true)
  const [urls, setUrls] = useState<string[]>([""])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricing: "",
  })

  const isFormValid = formData.name.trim() !== "" && formData.description.trim() !== "" && urls[0].trim() !== ""

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addUrl = () => {
    setUrls([...urls, ""])
  }

  const removeUrl = (index: number) => {
    if (urls.length > 1) {
      setUrls(urls.filter((_, i) => i !== index))
    }
  }

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls]
    newUrls[index] = value
    setUrls(newUrls)
  }

  const addCategory = (categoryId: string) => {
    if (!selectedCategories.includes(categoryId)) {
      setSelectedCategories([...selectedCategories, categoryId])
    }
  }

  const removeCategory = (categoryId: string) => {
    setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
  }

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase().from("categories").select("id, name, slug").order("name")

      if (error) {
        console.error("Error fetching categories:", error)
        return
      }

      setCategories(data || [])
    }

    fetchCategories()
  }, [])

  async function handleSubmit(formData: FormData) {
    formData.append("selectedTags", selectedTags.join(","))
    formData.append("logoUrl", logoUrl || logoUrlInput)
    formData.append("screenshots", screenshots.join(","))
    formData.append("showAuthor", showAuthor.toString())
    formData.append("url", urls[0]) // Primary URL
    formData.append(
      "additionalUrls",
      urls
        .slice(1)
        .filter((url) => url.trim())
        .join(","),
    )
    formData.append("categoryId", selectedCategories[0] || "") // Primary category
    formData.append("additionalCategories", selectedCategories.slice(1).join(","))

    const result = await submitTool(formData)

    if (result.error) {
      setMessage({ type: "error", text: result.error })
    } else if (result.success) {
      setMessage({ type: "success", text: result.success })
      setTimeout(() => {
        onSuccess()
        setMessage(null)
        setSelectedTags([])
        setLogoUrl("")
        setScreenshots([])
        setLogoUrlInput("")
        setShowAuthor(true)
        setUrls([""])
        setSelectedCategories([])
        setFormData({
          name: "",
          description: "",
          pricing: "",
        })
      }, 2000)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Tool Name *</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g., ChatGPT, Figma, GitHub"
          required
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe what this tool does and why it's useful..."
          rows={3}
          required
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Website URLs *</Label>
        {urls.map((url, index) => (
          <div key={index} className="flex gap-2">
            <Input
              type="url"
              placeholder={index === 0 ? "https://example.com (Primary URL)" : "https://example.com (Additional URL)"}
              required={index === 0}
              value={url}
              onChange={(e) => updateUrl(index, e.target.value)}
            />
            {index > 0 && (
              <Button type="button" variant="outline" size="sm" onClick={() => removeUrl(index)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addUrl} className="w-full bg-transparent">
          <Plus className="h-4 w-4 mr-2" />
          Add Another URL
        </Button>
      </div>

      <ImageUpload label="Tool Logo/Icon" onImageUploaded={setLogoUrl} currentImage={logoUrl} bucket="tool-images" />

      <div className="space-y-2">
        <Label htmlFor="logoUrlInput">Or Logo URL (optional)</Label>
        <Input
          id="logoUrlInput"
          name="logoUrlInput"
          type="url"
          placeholder="https://example.com/logo.png"
          value={logoUrlInput}
          onChange={(e) => setLogoUrlInput(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          If you don't have a logo file, you can provide a direct link to the tool's logo image
        </p>
      </div>

      <ScreenshotUpload onScreenshotsUploaded={setScreenshots} currentScreenshots={screenshots} maxFiles={5} />

      <div className="space-y-2">
        <Label>Categories</Label>
        <Select onValueChange={addCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select categories" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px] overflow-y-auto">
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id} disabled={selectedCategories.includes(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedCategories.map((categoryId) => {
              const category = categories.find((c) => c.id === categoryId)
              return category ? (
                <Badge key={categoryId} variant="secondary" className="flex items-center gap-1">
                  {category.name}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeCategory(categoryId)} />
                </Badge>
              ) : null
            })}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="pricing">Pricing Model</Label>
        <Select name="pricing" value={formData.pricing} onValueChange={(value) => handleInputChange("pricing", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select pricing model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="freemium">Freemium</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="subscription">Subscription</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <TagSelector selectedTags={selectedTags} onTagsChange={setSelectedTags} />
      </div>

      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-0.5">
          <Label htmlFor="show-author" className="text-sm font-medium">
            Show my name as submitter
          </Label>
          <p className="text-xs text-muted-foreground">
            Your name will appear as "Uploaded by [Your Name]" on the tool page
          </p>
        </div>
        <Switch id="show-author" checked={showAuthor} onCheckedChange={setShowAuthor} />
      </div>

      {message && (
        <div
          className={`p-3 rounded-md text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {!isFormValid && (
        <p className="text-sm text-muted-foreground text-center">
          Please fill in all required fields (marked with *) to submit
        </p>
      )}

      <SubmitButton isFormValid={isFormValid} />
    </form>
  )
}

export function SubmitToolDialog() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const isMobile = useMobile()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [supabase.auth])

  const handleSuccess = () => {
    setOpen(false)
  }

  const handleOpenDialog = () => {
    if (!user) {
      window.location.href = "/auth/login?redirect=/submit-tool"
      return
    }
    setOpen(true)
  }

  if (loading) {
    return (
      <Button disabled className="bg-accent hover:bg-accent/90 text-accent-foreground">
        <Plus className="h-4 w-4 mr-2" />
        Submit Tool
      </Button>
    )
  }

  const TriggerButton = (
    <Button className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm" onClick={handleOpenDialog}>
      <Plus className="h-4 w-4 mr-1" />
      <span className="hidden xs:inline">Submit Tool</span>
      <span className="xs:hidden">Submit</span>
    </Button>
  )

  if (!user) {
    return TriggerButton
  }

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Submit a New Tool</DrawerTitle>
            <DrawerDescription>
              Share an amazing tool with the community. All submissions are reviewed before being published.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto scrollbar-hide">
            <SubmitForm onSuccess={handleSuccess} />
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
          <DialogTitle>Submit a New Tool</DialogTitle>
          <DialogDescription>
            Share an amazing tool with the community. All submissions are reviewed before being published.
          </DialogDescription>
        </DialogHeader>
        <SubmitForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
