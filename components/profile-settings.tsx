"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Camera, Upload, Link as LinkIcon, Crop, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import { updateUserProfile } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

interface ProfileSettingsProps {
  user: User
  profile: any
}

export function ProfileSettings({ user, profile }: ProfileSettingsProps) {
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [imagePreview, setImagePreview] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    display_name: profile?.display_name || profile?.full_name || "",
    full_name: profile?.full_name || "",
    bio: profile?.bio || "",
    website_url: profile?.website_url || "",
    twitter_handle: profile?.twitter_handle || "",
    github_handle: profile?.github_handle || "",
    profile_image: profile?.profile_image || "",
    show_as_author: profile?.show_as_author ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await updateUserProfile(formData)
      if (result.success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid image file",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUrlSubmit = () => {
    if (imageUrl.trim()) {
      setImagePreview(imageUrl.trim())
      setSelectedFile(null)
    }
  }

  const handleImageSave = async () => {
    if (!imagePreview) return

    setImageLoading(true)
    try {
      // Here you would typically upload the file to your storage service
      // For now, we'll just update the form data with the image URL/preview
      setFormData({ ...formData, profile_image: imagePreview })
      setShowImageDialog(false)
      toast({
        title: "Image updated",
        description: "Profile image has been updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile image",
        variant: "destructive",
      })
    } finally {
      setImageLoading(false)
    }
  }

  const resetImageDialog = () => {
    setImagePreview("")
    setImageUrl("")
    setSelectedFile(null)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Image Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Upload or add a link to your profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={formData.profile_image} />
              <AvatarFallback className="text-lg">
                {getInitials(formData.display_name || formData.full_name || user.email || "U")}
              </AvatarFallback>
            </Avatar>
            
            <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" onClick={() => setShowImageDialog(true)}>
                  <Camera className="w-4 h-4 mr-2" />
                  Change Picture
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Update Profile Picture</DialogTitle>
                </DialogHeader>
                
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload" type="button">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </TabsTrigger>
                    <TabsTrigger value="url" type="button">
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Image URL
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image-upload">Choose Image</Label>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="url" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image-url">Image URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="image-url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                        <Button type="button" onClick={handleImageUrlSubmit} variant="outline">
                          Load
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Avatar className="w-24 h-24 mx-auto">
                        <AvatarImage src={imagePreview} />
                        <AvatarFallback>Preview</AvatarFallback>
                      </Avatar>
                    </div>
                    
                    {/* Simple editing tools placeholder */}
                    <div className="flex justify-center gap-2">
                      <Button type="button" variant="outline" size="sm" disabled>
                        <Crop className="w-4 h-4" />
                      </Button>
                      <Button type="button" variant="outline" size="sm" disabled>
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      <Button type="button" variant="outline" size="sm" disabled>
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                      <Button type="button" variant="outline" size="sm" disabled>
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Advanced editing tools coming soon
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetImageDialog}
                    className="flex-1"
                  >
                    Reset
                  </Button>
                  <Button
                    type="button"
                    onClick={handleImageSave}
                    disabled={!imagePreview || imageLoading}
                    className="flex-1"
                  >
                    {imageLoading ? "Saving..." : "Save Image"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Update your basic profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} disabled />
            <p className="text-sm text-muted-foreground">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              placeholder="How you want to be displayed publicly"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>Add your social media profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="website_url">Website</Label>
            <Input
              id="website_url"
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter_handle">Twitter Handle</Label>
            <Input
              id="twitter_handle"
              value={formData.twitter_handle}
              onChange={(e) => setFormData({ ...formData, twitter_handle: e.target.value })}
              placeholder="@username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github_handle">GitHub Handle</Label>
            <Input
              id="github_handle"
              value={formData.github_handle}
              onChange={(e) => setFormData({ ...formData, github_handle: e.target.value })}
              placeholder="username"
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Control how your information is displayed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show_as_author">Show as author</Label>
              <p className="text-sm text-muted-foreground">Display your name when you submit tools</p>
            </div>
            <Switch
              id="show_as_author"
              checked={formData.show_as_author}
              onCheckedChange={(checked) => setFormData({ ...formData, show_as_author: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  )
}
