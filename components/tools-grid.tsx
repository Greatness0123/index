"use client"

import { useState, useEffect } from "react"
import { ToolCard } from "./tool-card"
import { ToolCardSkeleton } from "./loading-skeleton"
import { supabase } from "@/lib/supabase/client"

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
  categories?: {
    name: string
    color: string
  }
  tags?: Array<{
    name: string
    slug: string
  }>
}

interface ToolsGridProps {
  selectedCategory: string | null
  searchQuery: string
  selectedPricing: string | null
  selectedRating: string | null
}

export function ToolsGrid({ selectedCategory, searchQuery, selectedPricing, selectedRating }: ToolsGridProps) {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTools() {
      setLoading(true)

      let query = supabase
        .from("tools")
        .select(`
          *,
          categories (
            name,
            color
          ),
          tool_tags (
            tags (
              name,
              slug
            )
          )
        `)
        .eq("is_approved", true)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })

      if (selectedCategory) {
        query = query.eq("category_id", selectedCategory)
      }

      if (searchQuery.trim()) {
        query = query.or(`name.ilike.%${searchQuery.trim()}%,description.ilike.%${searchQuery.trim()}%`)
      }

      if (selectedPricing) {
        query = query.eq("pricing", selectedPricing)
      }

      if (selectedRating) {
        const minRating = Number.parseFloat(selectedRating)
        query = query.gte("rating", minRating)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching tools:", error)
        setLoading(false)
        return
      }

      const transformedTools = (data || []).map((tool) => ({
        ...tool,
        tags: tool.tool_tags?.map((tt: any) => tt.tags).filter(Boolean) || [],
      }))

      setTools(transformedTools)
      setLoading(false)
    }

    fetchTools()
  }, [selectedCategory, searchQuery, selectedPricing, selectedRating])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ToolCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
          <span className="text-4xl">🔍</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">No tools found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  )
}
