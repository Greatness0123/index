"use client"

import { ExternalLink, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState } from "react"

interface ToolCardProps {
  tool: {
    id: string
    name: string
    description: string
    url: string
    image_url: string | null
    pricing: string | null
    rating: number
    rating_count: number
    is_featured: boolean
    category?: {
      name: string
      color: string
    }
    tags?: Array<{
      name: string
      slug: string
    }>
  }
}

export function ToolCard({ tool }: ToolCardProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const getImageSrc = () => {
    if (!tool.image_url || imageError) {
      return `/placeholder.svg?height=32&width=32&query=${encodeURIComponent(tool.name + " tool icon")}`
    }
    return tool.image_url
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-card border-border h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={getImageSrc() || "/placeholder.svg"}
                alt={`${tool.name} logo`}
                className={`w-full h-full object-cover transition-opacity duration-200 ${
                  imageLoaded && !imageError ? "opacity-100" : "opacity-0"
                }`}
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
              <span
                className={`absolute text-sm font-bold text-muted-foreground transition-opacity duration-200 ${
                  imageError || !imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              >
                {tool.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <Link href={`/tools/${tool.id}`}>
                <CardTitle className="text-base sm:text-lg font-bold text-card-foreground group-hover:text-accent transition-colors line-clamp-2 cursor-pointer">
                  {tool.name}
                </CardTitle>
              </Link>
              {tool.category && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  {tool.category.name}
                </Badge>
              )}
            </div>
          </div>
          {tool.is_featured && <Badge className="bg-accent text-accent-foreground shrink-0 ml-2">Featured</Badge>}
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-1 flex flex-col">
        <CardDescription className="text-muted-foreground mb-4 line-clamp-3 text-sm flex-1">
          {tool.description}
        </CardDescription>

        {tool.tags && tool.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tool.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.slug} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
            {tool.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tool.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            {tool.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{tool.rating}</span>
                <span className="text-xs text-muted-foreground">({tool.rating_count})</span>
              </div>
            )}
            {tool.pricing && (
              <Badge variant="outline" className="text-xs">
                {tool.pricing}
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Link href={`/tools/${tool.id}`}>
              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                View Details
              </Button>
            </Link>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
              onClick={() => window.open(tool.url, "_blank")}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Visit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
