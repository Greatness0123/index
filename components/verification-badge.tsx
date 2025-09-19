"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface VerificationBadgeProps {
  isVerified: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function VerificationBadge({ isVerified, size = "md", className }: VerificationBadgeProps) {
  if (!isVerified) return null

  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4", 
    lg: "w-5 h-5"
  }

  const iconSizes = {
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3"
  }

  return (
    <div className={cn(
      "rounded-full bg-blue-500 flex items-center justify-center shrink-0",
      sizeClasses[size],
      className
    )}>
      <Check className={cn("text-white", iconSizes[size])} />
    </div>
  )
}
