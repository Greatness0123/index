"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteComment, deleteCommunityComment } from "@/lib/actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface DeleteCommentButtonProps {
  commentId: string
  commentType: "tool" | "community"
  onSuccess?: () => void
}

export function DeleteCommentButton({ commentId, commentType, onSuccess }: DeleteCommentButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const result = commentType === "tool" ? await deleteComment(commentId) : await deleteCommunityComment(commentId)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(result.success || "Comment deleted successfully")
        onSuccess?.()
      }
    } catch (error) {
      toast.error("Failed to delete comment")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
          disabled={isDeleting}
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Comment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this comment? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
