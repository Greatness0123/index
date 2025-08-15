"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  ChevronDown,
  ChevronUp,
  Bot,
  Palette,
  Code,
  TrendingUp,
  Zap,
  BarChart,
  MessageCircle,
  DollarSign,
  GraduationCap,
  ShoppingCart,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { supabase } from "@/lib/supabase/client"

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  color: string
}

interface CategoryFilterProps {
  selectedCategory: string | null
  onCategoryChange: (categoryId: string | null) => void
}

const getIconComponent = (iconName: string | null) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Bot: Bot,
    Palette: Palette,
    Code: Code,
    TrendingUp: TrendingUp,
    Zap: Zap,
    BarChart: BarChart,
    MessageCircle: MessageCircle,
    DollarSign: DollarSign,
    GraduationCap: GraduationCap,
    ShoppingCart: ShoppingCart,
  }

  return iconName ? iconMap[iconName] : null
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from("categories").select("*").order("name")

      if (error) {
        console.error("Error fetching categories:", error)
        return
      }

      setCategories(data || [])
    }

    fetchCategories()
  }, [])

  const selectedCategoryName = categories.find((cat) => cat.id === selectedCategory)?.name

  return (
    <div className="border-b bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Desktop: Always visible horizontal scroll */}
        <div className="hidden md:flex flex-wrap gap-2 py-4">
          <Badge
            variant={selectedCategory === null ? "default" : "secondary"}
            className="cursor-pointer hover:bg-primary/80 text-sm"
            onClick={() => onCategoryChange(null)}
          >
            All Tools
          </Badge>
          {categories.map((category) => {
            const IconComponent = getIconComponent(category.icon)
            return (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "secondary"}
                className="cursor-pointer hover:bg-primary/80 text-sm flex items-center gap-1"
                onClick={() => onCategoryChange(category.id)}
              >
                {IconComponent && <IconComponent className="h-3 w-3" />}
                {category.name}
              </Badge>
            )
          })}
        </div>

        {/* Mobile: Collapsible */}
        <div className="md:hidden">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between py-4 h-auto">
                <span className="text-sm font-medium">
                  {selectedCategoryName ? `Category: ${selectedCategoryName}` : "All Categories"}
                </span>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pb-4">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === null ? "default" : "secondary"}
                  className="cursor-pointer hover:bg-primary/80 text-sm"
                  onClick={() => {
                    onCategoryChange(null)
                    setIsOpen(false)
                  }}
                >
                  All Tools
                </Badge>
                {categories.map((category) => {
                  const IconComponent = getIconComponent(category.icon)
                  return (
                    <Badge
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "secondary"}
                      className="cursor-pointer hover:bg-primary/80 text-sm flex items-center gap-1"
                      onClick={() => {
                        onCategoryChange(category.id)
                        setIsOpen(false)
                      }}
                    >
                      {IconComponent && <IconComponent className="h-3 w-3" />}
                      {category.name}
                    </Badge>
                  )
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  )
}
