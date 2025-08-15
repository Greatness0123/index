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
import { updateUserProfile } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

interface ProfileSettingsProps {
  user: User
  profile: any
}

export function ProfileSettings({ user, profile }: ProfileSettingsProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    display_name: profile?.display_name || profile?.full_name || "",
    full_name: profile?.full_name || "",
    bio: profile?.bio || "",
    website_url: profile?.website_url || "",
    twitter_handle: profile?.twitter_handle || "",
    github_handle: profile?.github_handle || "",
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
