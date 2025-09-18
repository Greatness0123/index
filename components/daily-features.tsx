"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Sparkles, RefreshCw, ExternalLink, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

interface Tool {
  id: string
  name: string
  description: string
  url: string
  image_url: string | null
  pricing: string | null
  rating: number
  rating_count: number
  is_featured: boolean
}

export function DailyFeatures() {
  const [featuredTools, setFeaturedTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

const fetchDailyFeatures = async () =>
  { const { data: tools, error } = await supabase .from("tools")
    .select(
      id,
      name,
      description,
      url, 
      image_url, 
      pricing, 
      rating, 
      rating_count, 
      is_featured 
    ) 
    .eq("is_approved", true) 
    .gte("rating", 4.0) 
    .order("rating", { ascending: false }) 
    .limit(20)

    if (error) {
      console.error("Error fetching daily features:", error)
      return
    }

    // Randomly select 4 tools from the top-rated ones
    const shuffled = tools?.sort(() => 0.5 - Math.random()) || []
    const selected = shuffled.slice(0, 4)

    setFeaturedTools(selected)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDailyFeatures()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchDailyFeatures().finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-b border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Daily Features</h2>
              <p className="text-muted-foreground">Discover amazing tools handpicked for today</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="gap-2 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredTools.map((tool) => (
            <Card key={tool.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {tool.image_url ? (
                    <Image
                      src={tool.image_url || "/placeholder.svg"}
                      alt={`${tool.name} logo`}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary">{tool.name.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-sm text-foreground truncate flex-1">{tool.name}</h3>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/tools/${tool.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-2 text-xs bg-transparent">
                    <Eye className="h-3 w-3" />
                    View Details
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="p-2" onClick={() => window.open(tool.url, "_blank")}>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
