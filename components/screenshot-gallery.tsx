"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface Screenshot {
  image_url: string
  alt_text?: string
  is_primary: boolean
  display_order: number
}

interface ScreenshotGalleryProps {
  screenshots: Screenshot[]
  toolName: string
}

export function ScreenshotGallery({ screenshots, toolName }: ScreenshotGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const sortedScreenshots = screenshots.sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1
    if (!a.is_primary && b.is_primary) return 1
    return a.display_order - b.display_order
  })

  const openLightbox = (index: number) => {
    setSelectedIndex(index)
  }

  const closeLightbox = () => {
    setSelectedIndex(null)
  }

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : sortedScreenshots.length - 1)
    }
  }

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex < sortedScreenshots.length - 1 ? selectedIndex + 1 : 0)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedScreenshots.map((screenshot, index) => (
          <div
            key={index}
            className="relative group cursor-pointer rounded-lg overflow-hidden border hover:shadow-lg transition-all"
            onClick={() => openLightbox(index)}
          >
            <img
              src={screenshot.image_url || "/placeholder.svg"}
              alt={screenshot.alt_text || `${toolName} screenshot ${index + 1}`}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
            />
            {screenshot.is_primary && (
              <div className="absolute top-2 left-2">
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">Primary</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black/90">
          {selectedIndex !== null && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                onClick={closeLightbox}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="flex items-center justify-center min-h-[60vh]">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 text-white hover:bg-white/20"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <img
                  src={sortedScreenshots[selectedIndex].image_url || "/placeholder.svg"}
                  alt={sortedScreenshots[selectedIndex].alt_text || `${toolName} screenshot`}
                  className="max-w-full max-h-[80vh] object-contain"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 text-white hover:bg-white/20"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                {selectedIndex + 1} of {sortedScreenshots.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
