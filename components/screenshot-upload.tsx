"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { uploadScreenshots } from "@/lib/storage"

interface ScreenshotUploadProps {
  onScreenshotsUploaded: (urls: string[]) => void
  currentScreenshots?: string[]
  maxFiles?: number
}

export function ScreenshotUpload({
  onScreenshotsUploaded,
  currentScreenshots = [],
  maxFiles = 5,
}: ScreenshotUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [screenshots, setScreenshots] = useState<string[]>(currentScreenshots)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFilesSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    if (screenshots.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} screenshots allowed`)
      return
    }

    setError(null)
    setUploading(true)

    const results = await uploadScreenshots(files)
    const successfulUploads = results.filter((result) => result.success && result.url).map((result) => result.url!)

    const newScreenshots = [...screenshots, ...successfulUploads]
    setScreenshots(newScreenshots)
    onScreenshotsUploaded(newScreenshots)

    const failedUploads = results.filter((result) => !result.success)
    if (failedUploads.length > 0) {
      setError(`${failedUploads.length} screenshots failed to upload`)
    }

    setUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemove = (index: number) => {
    const newScreenshots = screenshots.filter((_, i) => i !== index)
    setScreenshots(newScreenshots)
    onScreenshotsUploaded(newScreenshots)
  }

  return (
    <div className="space-y-2">
      <Label>Screenshots (Optional)</Label>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {screenshots.map((screenshot, index) => (
          <div key={index} className="relative group">
            <img
              src={screenshot || "/placeholder.svg"}
              alt={`Screenshot ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemove(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}

        {screenshots.length < maxFiles && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center hover:border-primary transition-colors"
          >
            <Plus className="h-6 w-6 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">{uploading ? "Uploading..." : "Add"}</span>
          </button>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <p className="text-xs text-muted-foreground">Upload up to {maxFiles} screenshots to showcase your tool</p>

      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFilesSelect} className="hidden" />
    </div>
  )
}
