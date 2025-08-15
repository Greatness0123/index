"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface AdvancedFiltersProps {
  selectedPricing: string | null
  selectedRating: string | null
  onPricingChange: (pricing: string | null) => void
  onRatingChange: (rating: string | null) => void
  onClearFilters: () => void
}

export function AdvancedFilters({
  selectedPricing,
  selectedRating,
  onPricingChange,
  onRatingChange,
  onClearFilters,
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const hasActiveFilters = selectedPricing || selectedRating

  return (
    <div className="border-b bg-background">
      <div className="container mx-auto px-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between py-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-sm">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Advanced Filters</span>
                <span className="sm:hidden">Filters</span>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                    {[selectedPricing, selectedRating].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
            </CollapsibleTrigger>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onClearFilters} className="gap-1 text-sm">
                <X className="h-3 w-3" />
                <span className="hidden sm:inline">Clear Filters</span>
                <span className="sm:hidden">Clear</span>
              </Button>
            )}
          </div>

          <CollapsibleContent className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="text-sm font-medium whitespace-nowrap">Pricing:</label>
                <Select
                  value={selectedPricing || "any"}
                  onValueChange={(value) => onPricingChange(value === "any" ? null : value)}
                >
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="freemium">Freemium</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="text-sm font-medium whitespace-nowrap">Rating:</label>
                <Select
                  value={selectedRating || "any"}
                  onValueChange={(value) => onRatingChange(value === "any" ? null : value)}
                >
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="4.0">4.0+ Stars</SelectItem>
                    <SelectItem value="3.5">3.5+ Stars</SelectItem>
                    <SelectItem value="3.0">3.0+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}
