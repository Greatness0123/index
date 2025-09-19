"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { revalidatePath } from "next/cache"

export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabaseClient = await createClient()

  try {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabaseClient = await createClient()

  try {
    const { error } = await supabaseClient.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { success: "Check your email to confirm your account." }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  const supabaseClient = await createClient()

  await supabaseClient.auth.signOut()
  redirect("/auth/login")
}

export async function submitTool(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const url = formData.get("url") as string
  const categoryId = formData.get("categoryId") as string
  const pricing = formData.get("pricing") as string
  const logoUrl = formData.get("logoUrl") as string
  const screenshots = formData.get("screenshots") as string
  const selectedTags = formData.get("selectedTags") as string
  const showAuthor = formData.get("showAuthor") === "true"

  // Basic validation
  if (!name || !description || !url) {
    return { error: "Name, description, and URL are required" }
  }

  // Validate URL format
  try {
    new URL(url)
  } catch {
    return { error: "Please enter a valid URL" }
  }

  try {
    const supabaseClient = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return { error: "You must be logged in to submit a tool" }
    }

    const { data: existingTool, error: duplicateError } = await supabaseClient
      .from("tools")
      .select("id, name")
      .eq("url", url.trim())
      .single()

    if (duplicateError && duplicateError.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is what we want
      console.error("Error checking for duplicates:", duplicateError)
      return { error: "Failed to check for duplicate tools. Please try again." }
    }

    if (existingTool) {
      return {
        error: `This tool URL is already in our database as "${existingTool.name}". Please check if it's already listed.`,
      }
    }

    // Insert the tool with user information
    const { data: toolData, error: toolError } = await supabaseClient
      .from("tools")
      .insert({
        name: name.trim(),
        description: description.trim(),
        url: url.trim(),
        category_id: categoryId || null,
        pricing: pricing || null,
        image_url: logoUrl || null,
        submitted_by: user.id,
        show_author: showAuthor,
        is_approved: false,
        is_featured: false,
        rating: 0,
        rating_count: 0,
      })
      .select()
      .single()

    if (toolError) {
      console.error("Error submitting tool:", toolError)
      return { error: "Failed to submit tool. Please try again." }
    }

    // Handle screenshots
    if (screenshots && toolData) {
      const screenshotUrls = screenshots.split(",").filter(Boolean)
      if (screenshotUrls.length > 0) {
        const screenshotData = screenshotUrls.map((url, index) => ({
          tool_id: toolData.id,
          image_url: url,
          is_primary: index === 0,
          display_order: index,
        }))

        const { error: screenshotError } = await supabaseClient.from("tool_screenshots").insert(screenshotData)

        if (screenshotError) {
          console.error("Error inserting screenshots:", screenshotError)
        }
      }
    }

    // Handle tags
    if (selectedTags && toolData) {
      const tagIds = selectedTags.split(",").filter(Boolean)

      if (tagIds.length > 0) {
        const tagAssociations = tagIds.map((tagId) => ({
          tool_id: toolData.id,
          tag_id: tagId,
        }))

        const { error: tagError } = await supabaseClient.from("tool_tags").insert(tagAssociations)

        if (tagError) {
          console.error("Error associating tags:", tagError)
        }
      }
    }

    revalidatePath("/")
    return { success: "Tool submitted successfully! It will be reviewed before appearing on the site." }
  } catch (error) {
    console.error("Error submitting tool:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function submitComment(toolId: string, content: string, rating: number | null) {
  try {
    const supabaseClient = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return { error: "You must be logged in to submit a comment" }
    }

    const { data, error } = await supabaseClient
      .from("comments")
      .insert({
        tool_id: toolId,
        user_id: user.id,
        content: content.trim(),
        rating,
        is_approved: true, // Set to false if you need moderation
      })
      .select(`
        id,
        content,
        rating,
        created_at,
        user_id,
        tool_id,
        users!inner(id, email, full_name, display_name)
      `)
      .single()

    if (error) {
      console.error("Error submitting comment:", error)
      return { error: "Failed to submit comment" }
    }

    try {
      const { error: statsError } = await supabaseClient.rpc("update_tool_statistics_safe", {
        target_tool_id: toolId,
      })

      if (statsError) {
        console.error("Error updating tool statistics:", statsError)
      }
    } catch (statsError) {
      console.error("Error updating tool statistics:", statsError)
    }

    // This is crucial for refreshing the page
    revalidatePath(`/tools/${toolId}`)
    
    return { success: "Comment submitted successfully!" }
  } catch (error) {
    console.error("Error submitting comment:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function voteOnComment(commentId: string, isHelpful: boolean) {
  try {
    const supabaseClient = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return { error: "You must be logged in to vote on comments" }
    }

    // Check if already liked
    const { data: existing } = await supabaseClient
      .from("comment_votes")
      .select("id")
      .eq("comment_id", commentId)
      .eq("user_id", user.id)
      .single()

    if (existing) {
      // Remove like
      const { error } = await supabaseClient
        .from("comment_votes")
        .delete()
        .eq("comment_id", commentId)
        .eq("user_id", user.id)

      if (error) throw error
      return { success: true, liked: false }
    } else {
      // Add like
      const { error } = await supabaseClient.from("comment_votes").insert({
        comment_id: commentId,
        user_id: user.id,
      })

      if (error) throw error
      return { success: true, liked: true }
    }
  } catch (error) {
    console.error("Error voting on comment:", error)
    return { error: "Failed to vote on comment" }
  }
}

export async function toggleFavorite(toolId: string) {
  try {
    const supabaseClient = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return { error: "You must be logged in to favorite tools" }
    }

    const { data: existing } = await supabaseClient
      .from("user_favorites")
      .select("id")
      .eq("tool_id", toolId)
      .eq("user_id", user.id)
      .single()

    if (existing) {
      // Remove favorite
      const { error } = await supabaseClient
        .from("user_favorites")
        .delete()
        .eq("tool_id", toolId)
        .eq("user_id", user.id)

      if (error) throw error
    } else {
      // Add favorite - use upsert to handle duplicate key constraint
      const { error } = await supabaseClient.from("user_favorites").upsert(
        {
          tool_id: toolId,
          user_id: user.id,
        },
        {
          onConflict: "user_id,tool_id",
        },
      )

      if (error) throw error
    }

    try {
      const { error: statsError } = await supabaseClient.rpc("update_tool_statistics_safe", {
        target_tool_id: toolId,
      })

      if (statsError) {
        console.error("Error updating tool statistics:", statsError)
      }
    } catch (statsError) {
      console.error("Error updating tool statistics:", statsError)
    }

    revalidatePath(`/tools/${toolId}`)
    return { success: true }
  } catch (error) {
    console.error("Error toggling favorite:", error)
    return { error: "Failed to update favorite" }
  }
}

// Add this function to your existing actions.ts
export async function getComments(toolId: string, userId?: string) {
  try {
    const supabaseClient = await createClient()

    // Base query for comments
    let query = supabaseClient
      .from("comments")
      .select(`
        id, 
        content, 
        rating, 
        created_at, 
        helpful_count, 
        user_id,
        users!inner(id, email, full_name, display_name)
      `)
      .eq("tool_id", toolId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false })

    const { data: commentsData, error: commentsError } = await query

    if (commentsError) {
      console.error("Error fetching comments:", commentsError)
      return { error: "Failed to fetch comments" }
    }

    // If user is logged in, fetch their votes
    let userVotes = {}
    if (userId) {
      const { data: votesData, error: votesError } = await supabaseClient
        .from("comment_votes")
        .select("comment_id, is_helpful")
        .eq("user_id", userId)
        .in("comment_id", commentsData?.map(c => c.id) || [])

      if (!votesError && votesData) {
        userVotes = votesData.reduce((acc, vote) => {
          acc[vote.comment_id] = vote
          return acc
        }, {})
      }
    }

    // Transform comments with user vote information
    const transformedComments = (commentsData || []).map(comment => ({
      ...comment,
      user_vote: userVotes[comment.id] || null,
      total_votes: comment.helpful_count // Adjust if you have a different way to track total votes
    }))

    return { comments: transformedComments }
  } catch (error) {
    console.error("Error in getComments:", error)
    return { error: "An unexpected error occurred" }
  }
}
export async function trackToolView(toolId: string, userId?: string) {
  try {
    const supabaseClient = await createClient()

    await supabaseClient.from("tool_views").insert({
      tool_id: toolId,
      user_id: userId || null,
    })

    // Update tool stats will be handled by database trigger
    return { success: true }
  } catch (error) {
    console.error("Error tracking view:", error)
    return { error: "Failed to track view" }
  }
}

export async function trackToolClick(toolId: string) {
  try {
    const supabaseClient = await createClient()

    const { error } = await supabaseClient.rpc("track_tool_click_safe", {
      p_tool_id: toolId,
      p_user_id: null,
      p_ip_address: null,
      p_user_agent: null,
    })

    if (error) {
      console.error("Error tracking click:", error)
      return { error: "Failed to track click" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error tracking click:", error)
    return { error: "Failed to track click" }
  }
}

export async function deleteTool(toolId: string) {
  try {
    const supabaseClient = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return { error: "You must be logged in to delete tools" }
    }

    // Check if user owns this tool
    const { data: tool, error: toolError } = await supabaseClient
      .from("tools")
      .select("id, name, submitted_by")
      .eq("id", toolId)
      .single()

    if (toolError || !tool) {
      return { error: "Tool not found" }
    }

    if (tool.submitted_by !== user.id) {
      return { error: "You can only delete tools you submitted" }
    }

    // Delete related data first (foreign key constraints)
    await Promise.all([
      supabaseClient.from("tool_screenshots").delete().eq("tool_id", toolId),
      supabaseClient.from("tool_tags").delete().eq("tool_id", toolId),
      supabaseClient.from("comments").delete().eq("tool_id", toolId),
      supabaseClient.from("user_favorites").delete().eq("tool_id", toolId),
      supabaseClient.from("tool_views").delete().eq("tool_id", toolId),
      supabaseClient.from("tool_clicks").delete().eq("tool_id", toolId),
      supabaseClient.from("tool_stats").delete().eq("tool_id", toolId),
    ])

    // Delete the tool
    const { error: deleteError } = await supabaseClient.from("tools").delete().eq("id", toolId)

    if (deleteError) {
      console.error("Error deleting tool:", deleteError)
      return { error: "Failed to delete tool" }
    }

    revalidatePath("/")
    return { success: "Tool deleted successfully" }
  } catch (error) {
    console.error("Error deleting tool:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function updateUserProfile(profileData: {
  display_name: string
  full_name: string
  bio: string
  website_url: string
  twitter_handle: string
  github_handle: string
  show_as_author: boolean
}) {
  try {
    const supabaseClient = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return { error: "You must be logged in to update your profile" }
    }

    const { error } = await supabaseClient.from("users").upsert({
      id: user.id,
      email: user.email,
      display_name: profileData.display_name.trim(),
      full_name: profileData.full_name.trim(),
      bio: profileData.bio.trim(),
      website_url: profileData.website_url.trim(),
      twitter_handle: profileData.twitter_handle.trim(),
      github_handle: profileData.github_handle.trim(),
      show_as_author: profileData.show_as_author,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error updating profile:", error)
      return { error: "Failed to update profile" }
    }

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function createCommunityPost(formData: FormData) {
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const postType = formData.get("postType") as string
  const imageUrl = formData.get("imageUrl") as string
  const externalUrl = formData.get("externalUrl") as string
  const tags = formData.get("tags") as string
  const showAuthor = formData.get("showAuthor") === "true"

  if (!title || !content) {
    return { error: "Title and content are required" }
  }

  try {
    const supabaseClient = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return { error: "You must be logged in to create a post" }
    }

    // Get user profile for display name
    const { data: userProfile } = await supabaseClient
      .from("users")
      .select("display_name, full_name")
      .eq("id", user.id)
      .single()
    
     const showAuthor = userProfile?.show_as_author !== false
    const authorName = showAuthor
      ? userProfile?.display_name || userProfile?.full_name || user.email?.split("@")[0] || "Anonymous"
      : null


    const tagsArray = tags
      ? tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : []

    const { data, error } = await supabaseClient
      .from("community_posts")
      .insert({
        title: title.trim(),
        content: content.trim(),
        post_type: postType || "discussion",
        author_id: user.id,
        author_name: authorName,
        show_author: showAuthor,
        image_url: imageUrl || null,
        external_url: externalUrl || null,
        tags: tagsArray,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating community post:", error)
      return { error: "Failed to create post" }
    }

    revalidatePath("/community")
    return { success: "Post created successfully!" }
  } catch (error) {
    console.error("Error creating community post:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function likeCommunityPost(postId: string) {
  try {
    const supabaseClient = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return { error: "You must be logged in to like posts" }
    }

    // Check if already liked
    const { data: existing } = await supabaseClient
      .from("community_post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .single()

    if (existing) {
      // Remove like
      const { error } = await supabaseClient
        .from("community_post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id)

      if (error) throw error
      return { success: true, liked: false }
    } else {
      // Add like
      const { error } = await supabaseClient.from("community_post_likes").insert({
        post_id: postId,
        user_id: user.id,
      })

      if (error) throw error
      return { success: true, liked: true }
    }
  } catch (error) {
    console.error("Error liking community post:", error)
    return { error: "Failed to like post" }
  }
}

export async function createCommunityComment(postId: string, content: string, parentId?: string) {
  try {
    const supabaseClient = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return { error: "You must be logged in to comment" }
    }

    // Get user profile for display name
    const { data: userProfile } = await supabaseClient
      .from("users")
      .select("display_name, full_name, show_as_author")
      .eq("id", user.id)
      .single()

    const showAuthor = userProfile?.show_as_author !== false
    const authorName = showAuthor
      ? userProfile?.display_name || userProfile?.full_name || user.email?.split("@")[0] || "Anonymous"
      : null

    const { data, error } = await supabaseClient
      .from("community_comments")
      .insert({
        post_id: postId,
        parent_id: parentId || null,
        content: content.trim(),
        author_id: user.id,
        author_name: authorName,
        show_author: showAuthor,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating community comment:", error)
      return { error: "Failed to create comment" }
    }

    revalidatePath("/community")
    return { success: "Comment posted successfully!" }
  } catch (error) {
    console.error("Error creating community comment:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function likeCommunityComment(commentId: string) {
  try {
    const supabaseClient = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return { error: "You must be logged in to like comments" }
    }

    // Check if already liked
    const { data: existing } = await supabaseClient
      .from("community_comment_likes")
      .select("id")
      .eq("comment_id", commentId)
      .eq("user_id", user.id)
      .single()

    if (existing) {
      // Remove like
      const { error } = await supabaseClient
        .from("community_comment_likes")
        .delete()
        .eq("comment_id", commentId)
        .eq("user_id", user.id)

      if (error) throw error
      return { success: true, liked: false }
    } else {
      // Add like
      const { error } = await supabaseClient.from("community_comment_likes").insert({
        comment_id: commentId,
        user_id: user.id,
      })

      if (error) throw error
      return { success: true, liked: true }
    }
  } catch (error) {
    console.error("Error liking community comment:", error)
    return { error: "Failed to like comment" }
  }
}

export async function deleteComment(commentId: string) {
  try {
    const supabaseClient = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return { error: "You must be logged in to delete comments" }
    }

    // Check if user owns this comment
    const { data: comment, error: commentError } = await supabaseClient
      .from("comments")
      .select("id, user_id, tool_id")
      .eq("id", commentId)
      .single()

    if (commentError || !comment) {
      return { error: "Comment not found" }
    }

    if (comment.user_id !== user.id) {
      return { error: "You can only delete your own comments" }
    }

    // Delete related votes first
    await supabaseClient.from("comment_votes").delete().eq("comment_id", commentId)

    // Delete the comment
    const { error: deleteError } = await supabaseClient.from("comments").delete().eq("id", commentId)

    if (deleteError) {
      console.error("Error deleting comment:", deleteError)
      return { error: "Failed to delete comment" }
    }

    // Update tool statistics
    try {
      const { error: statsError } = await supabaseClient.rpc("update_tool_statistics_safe", {
        target_tool_id: comment.tool_id,
      })

      if (statsError) {
        console.error("Error updating tool statistics:", statsError)
      }
    } catch (statsError) {
      console.error("Error updating tool statistics:", statsError)
    }

    revalidatePath(`/tools/${comment.tool_id}`)
    return { success: "Comment deleted successfully" }
  } catch (error) {
    console.error("Error deleting comment:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function deleteCommunityComment(commentId: string) {
  try {
    const supabaseClient = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return { error: "You must be logged in to delete comments" }
    }

    // Check if user owns this comment
    const { data: comment, error: commentError } = await supabaseClient
      .from("community_comments")
      .select("id, author_id, post_id")
      .eq("id", commentId)
      .single()

    if (commentError || !comment) {
      return { error: "Comment not found" }
    }

    if (comment.author_id !== user.id) {
      return { error: "You can only delete your own comments" }
    }

    // Delete related likes first
    await supabaseClient.from("community_comment_likes").delete().eq("comment_id", commentId)

    // Delete the comment
    const { error: deleteError } = await supabaseClient.from("community_comments").delete().eq("id", commentId)

    if (deleteError) {
      console.error("Error deleting community comment:", deleteError)
      return { error: "Failed to delete comment" }
    }

    revalidatePath("/community")
    return { success: "Comment deleted successfully" }
  } catch (error) {
    console.error("Error deleting community comment:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function copyCommentText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return { success: "Comment copied to clipboard!" }
  } catch (error) {
    console.error("Error copying comment:", error)
    return { error: "Failed to copy comment" }
  }
}

async function updateToolStatsSimple(toolId: string) {
  try {
    // Get comment count
    const { count: commentCount } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("tool_id", toolId)
      .eq("is_approved", true)

    // Get favorite count
    const { count: favoriteCount } = await supabase
      .from("user_favorites")
      .select("*", { count: "exact", head: true })
      .eq("tool_id", toolId)

    // Update or insert tool stats
    const { error: statsError } = await supabase.from("tool_stats").upsert({
      tool_id: toolId,
      comment_count: commentCount || 0,
      favorite_count: favoriteCount || 0,
      updated_at: new Date().toISOString(),
    })

    if (statsError) {
      console.error("Error updating tool stats:", statsError)
    }

    // Calculate and update average rating
    const { data: ratings } = await supabase
      .from("comments")
      .select("rating")
      .eq("tool_id", toolId)
      .eq("is_approved", true)
      .not("rating", "is", null)

    if (ratings && ratings.length > 0) {
      const validRatings = ratings.map((r) => r.rating).filter((r) => r !== null)
      if (validRatings.length > 0) {
        const averageRating = validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length

        const { error: toolUpdateError } = await supabase
          .from("tools")
          .update({
            rating: Math.round(averageRating * 10) / 10,
            rating_count: validRatings.length,
          })
          .eq("id", toolId)

        if (toolUpdateError) {
          console.error("Error updating tool rating:", toolUpdateError)
        }
      }
    }
  } catch (error) {
    console.error("Error updating tool stats:", error)
  }
}

async function updateToolStatsManually(toolId: string) {
  await updateToolStatsSimple(toolId)
}

async function updateToolStats(toolId: string) {
  await updateToolStatsSimple(toolId)
}
// Add this to your existing actions.ts file
export async function deleteCommunityPost(postId: string) {
  try {
    const supabaseClient = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return { error: "You must be logged in to delete posts" }
    }

    // Check if user owns this post
    const { data: post, error: postError } = await supabaseClient
      .from("community_posts")
      .select("id, author_id")
      .eq("id", postId)
      .single()

    if (postError || !post) {
      return { error: "Post not found" }
    }

    if (post.author_id !== user.id) {
      return { error: "You can only delete your own posts" }
    }

    // Delete related data first (foreign key constraints)
    await Promise.all([
      supabaseClient.from("community_comments").delete().eq("post_id", postId),
      supabaseClient.from("community_post_likes").delete().eq("post_id", postId),
      supabaseClient.from("community_comment_likes").delete().eq("post_id", postId),
    ])

    // Delete the post
    const { error: deleteError } = await supabaseClient.from("community_posts").delete().eq("id", postId)

    if (deleteError) {
      console.error("Error deleting post:", deleteError)
      return { error: "Failed to delete post" }
    }

    revalidatePath("/community")
    revalidatePath("/profile")
    return { success: "Post deleted successfully" }
  } catch (error) {
    console.error("Error deleting post:", error)
    return { error: "An unexpected error occurred" }
  }
}
