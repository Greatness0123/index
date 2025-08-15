"use client"

import { useState } from "react"
import { Filter, X, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { useMobile } from "@/hooks/use-mobile"

interface FiltersModalProps {
  selectedPricing: string | null
  selectedRating: string | null
  onPricingChange: (pricing: string | null) => void
  onRatingChange: (rating: string | null) => void
  onClearFilters: () => void
}

function FilterContent({
  selectedPricing,
  selectedRating,
  onPricingChange,
  onRatingChange,
  onClearFilters,
  onClose,
}: FiltersModalProps & { onClose: () => void }) {
  const hasActiveFilters = selectedPricing || selectedRating
  const activeFilterCount = [selectedPricing, selectedRating].filter(Boolean).length

  const handleApplyFilters = () => {
    onClose()
  }

  const handleClearAll = () => {
    onClearFilters()
    onClose()
  }

  return (
    <div className="space-y-6">
      {/* Filter Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <span className="font-medium">Filters</span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="h-6 px-2 text-xs">
              {activeFilterCount} active
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <Separator />

      {/* Pricing Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Pricing Model</label>
          {selectedPricing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPricingChange(null)}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          )}
        </div>
        <Select
          value={selectedPricing || "any"}
          onValueChange={(value) => onPricingChange(value === "any" ? null : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select pricing model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Pricing</SelectItem>
            <SelectItem value="free">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Free
              </div>
            </SelectItem>
            <SelectItem value="freemium">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Freemium
              </div>
            </SelectItem>
            <SelectItem value="paid">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                Paid
              </div>
            </SelectItem>
            <SelectItem value="subscription">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                Subscription
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Rating Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Minimum Rating</label>
          {selectedRating && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRatingChange(null)}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          )}
        </div>
        <Select
          value={selectedRating || "any"}
          onValueChange={(value) => onRatingChange(value === "any" ? null : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select minimum rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Rating</SelectItem>
            <SelectItem value="4.5">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`w-3 h-3 ${i < 4.5 ? "text-yellow-400" : "text-gray-300"}`}>
                      ★
                    </div>
                  ))}
                </div>
                4.5+ Stars
              </div>
            </SelectItem>
            <SelectItem value="4.0">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`w-3 h-3 ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}>
                      ★
                    </div>
                  ))}
                </div>
                4.0+ Stars
              </div>
            </SelectItem>
            <SelectItem value="3.5">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`w-3 h-3 ${i < 3.5 ? "text-yellow-400" : "text-gray-300"}`}>
                      ★
                    </div>
                  ))}
                </div>
                3.5+ Stars
              </div>
            </SelectItem>
            <SelectItem value="3.0">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`w-3 h-3 ${i < 3 ? "text-yellow-400" : "text-gray-300"}`}>
                      ★
                    </div>
                  ))}
                </div>
                3.0+ Stars
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <>
          <Separator />
          <div className="space-y-2">
            <label className="text-sm font-medium">Active Filters</label>
            <div className="flex flex-wrap gap-2">
              {selectedPricing && (
                <Badge variant="secondary" className="gap-1">
                  Pricing: {selectedPricing}
                  <button
                    onClick={() => onPricingChange(null)}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedRating && (
                <Badge variant="secondary" className="gap-1">
                  Rating: {selectedRating}+ ★
                  <button
                    onClick={() => onRatingChange(null)}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function FiltersModal({
  selectedPricing,
  selectedRating,
  onPricingChange,
  onRatingChange,
  onClearFilters,
}: FiltersModalProps) {
  const [open, setOpen] = useState(false)
  const isMobile = useMobile()
  const hasActiveFilters = selectedPricing || selectedRating
  const activeFilterCount = [selectedPricing, selectedRating].filter(Boolean).length

  const handleClose = () => {
    setOpen(false)
  }

  const TriggerButton = (
    <Button
      variant="outline"
      size="sm"
      className={`gap-2 relative ${hasActiveFilters ? "border-primary text-primary" : ""}`}
    >
      <Filter className="h-4 w-4" />
      <span className="hidden sm:inline">Filters</span>
      {hasActiveFilters && (
        <Badge
          variant="default"
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-primary text-primary-foreground"
        >
          {activeFilterCount}
        </Badge>
      )}
    </Button>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Filter Tools</DrawerTitle>
            <DrawerDescription>Refine your search with advanced filters</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">
            <FilterContent
              selectedPricing={selectedPricing}
              selectedRating={selectedRating}
              onPricingChange={onPricingChange}
              onRatingChange={onRatingChange}
              onClearFilters={onClearFilters}
              onClose={handleClose}
            />
          </div>
          <DrawerFooter>
            <Button onClick={handleClose} className="w-full">
              Apply Filters
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Tools</DialogTitle>
          <DialogDescription>Refine your search with advanced filters</DialogDescription>
        </DialogHeader>
        <FilterContent
          selectedPricing={selectedPricing}
          selectedRating={selectedRating}
          onPricingChange={onPricingChange}
          onRatingChange={onRatingChange}
          onClearFilters={onClearFilters}
          onClose={handleClose}
        />
        <DialogFooter>
          <Button onClick={handleClose} className="w-full sm:w-auto">
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
