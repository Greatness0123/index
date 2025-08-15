import { supabase } from "@/lib/supabase/client" // Declare the supabase variable

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

// Upload image to Supabase storage
export async function uploadImage(file: File, bucket = "tool-images"): Promise<UploadResult> {
  try {
    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "You must be logged in to upload images" }
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Please upload an image file" }
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "Image must be less than 5MB" }
    }

    // Generate unique filename with user ID prefix
    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Upload to Supabase storage
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Storage upload error:", error)
      return { success: false, error: `Failed to upload image: ${error.message}` }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return { success: true, url: publicUrl }
  } catch (error) {
    console.error("Upload error:", error)
    return { success: false, error: "Failed to upload image" }
  }
}

// Upload multiple screenshots
export async function uploadScreenshots(files: File[]): Promise<UploadResult[]> {
  const results = await Promise.all(files.map((file) => uploadImage(file, "tool-screenshots")))
  return results
}

// Delete image from storage
export async function deleteImage(url: string, bucket = "tool-images"): Promise<boolean> {
  try {
    // Extract filename from URL
    const urlParts = url.split("/")
    const fileName = urlParts[urlParts.length - 1]

    const { error } = await supabase.storage.from(bucket).remove([fileName])

    if (error) {
      console.error("Storage delete error:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Delete error:", error)
    return false
  }
}
