"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { CategoryFilter } from "@/components/category-filter"
import { ToolsGrid } from "@/components/tools-grid"
import { FloatingActionButton } from "@/components/floating-action-button"
import { DailyFeatures } from "@/components/daily-features"
import { useDebounce } from "@/hooks/use-debounce"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPricing, setSelectedPricing] = useState<string | null>(null)
  const [selectedRating, setSelectedRating] = useState<string | null>(null)

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const handleClearFilters = () => {
    setSelectedCategory(null)
    setSearchQuery("")
    setSelectedPricing(null)
    setSelectedRating(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPricing={selectedPricing}
        selectedRating={selectedRating}
        onPricingChange={setSelectedPricing}
        onRatingChange={setSelectedRating}
        onClearFilters={handleClearFilters}
      />

      <DailyFeatures />

      <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

      <main className="container mx-auto">
        <ToolsGrid
          selectedCategory={selectedCategory}
          searchQuery={debouncedSearchQuery}
          selectedPricing={selectedPricing}
          selectedRating={selectedRating}
        />
      </main>

      <FloatingActionButton />
    </div>
  )
}
