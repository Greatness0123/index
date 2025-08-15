import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ToolDetailView } from "@/components/tool-detail-view"
import { trackToolView } from "@/lib/actions"

interface ToolDetailPageProps {
  params: {
    id: string
  }
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const supabase = createClient()

  // Fetch tool with all related data
  const { data: tool, error } = await supabase
    .from("tools")
    .select(`
      *,
      category:categories(name, color, icon),
      tags:tool_tags(tag:tags(name, slug)),
      screenshots:tool_screenshots(image_url, alt_text, is_primary, display_order),
      stats:tool_stats(view_count, favorite_count, comment_count, click_count)
    `)
    .eq("id", params.id)
    .eq("is_approved", true)
    .single()

  if (error || !tool) {
    notFound()
  }

  // Get current user for favorites and comments
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user has favorited this tool
  let isFavorited = false
  if (user) {
    const { data: favorite } = await supabase
      .from("user_favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("tool_id", tool.id)
      .single()

    isFavorited = !!favorite
  }

  // Get similar tools
  const { data: similarTools } = await supabase
    .from("tools")
    .select(`
      id, name, description, image_url, rating, rating_count, pricing,
      category:categories(name, color)
    `)
    .eq("category_id", tool.category_id)
    .eq("is_approved", true)
    .neq("id", tool.id)
    .limit(4)

  // Track view (server action)
  await trackToolView(tool.id, user?.id)

  return <ToolDetailView tool={tool} user={user} isFavorited={isFavorited} similarTools={similarTools || []} />
}

export async function generateMetadata({ params }: ToolDetailPageProps) {
  const supabase = createClient()

  const { data: tool } = await supabase
    .from("tools")
    .select("name, description, image_url")
    .eq("id", params.id)
    .single()

  if (!tool) {
    return {
      title: "Tool Not Found",
    }
  }

  return {
    title: `${tool.name} - Index`,
    description: tool.description,
    openGraph: {
      title: tool.name,
      description: tool.description,
      images: tool.image_url ? [tool.image_url] : [],
    },
  }
}
