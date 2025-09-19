// components/delete-post-button.tsx
"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteCommunityPost } from "@/lib/actions"

export function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      const result = await deleteCommunityPost(postId)
      
      if (result.success) {
        router.refresh()
      } else {
        alert(result.error || "Failed to delete post")
      }
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDelete}>
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
