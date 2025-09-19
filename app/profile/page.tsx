import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileSettings } from "@/components/profile-settings"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star, MessageCircle, Heart } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DeleteCommentButton } from "@/components/delete-comment-button"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  const { data: userTools } = await supabase
    .from("tools")
    .select(`
      id,
      name,
      description,
      url,
      image_url,
      pricing,
      rating,
      rating_count,
      is_approved,
      created_at,
      category:categories(name, color)
    `)
    .eq("submitted_by", user.id)
    .order("created_at", { ascending: false })

  const { data: toolComments } = await supabase
    .from("comments")
    .select(`
      id,
      content,
      rating,
      created_at,
      helpful_count,
      tool_id,
      tools!inner(id, name, image_url)
    `)
    .eq("user_id", user.id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })

  const { data: communityComments } = await supabase
    .from("community_comments")
    .select(`
      id,
      content,
      created_at,
      post_id,
      community_posts!inner(id, title)
    `)
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })

  const { data: favoriteTools } = await supabase
    .from("user_favorites")
    .select(`
      id,
      created_at,
      tools!inner(id, name, description, image_url, rating, rating_count)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const { data: likedPosts } = await supabase
    .from("community_post_likes")
    .select(`
      id,
      created_at,
      community_posts!inner(id, title, content, author_name, like_count)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Profile Settings */}
          <div className="lg:col-span-1">
            <ProfileSettings user={user} profile={profile} />
          </div>

          {/* Your Uploaded Tools */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Your Uploaded Tools</h2>
            {userTools && userTools.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {userTools.map((tool: any) => (
                  <div key={tool.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {tool.image_url && (
                          <img
                            src={tool.image_url || "/placeholder.svg"}
                            alt={tool.name}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium truncate">{tool.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">{tool.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            tool.is_approved
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                        >
                          {tool.is_approved ? "Approved" : "Pending"}
                        </span>
                        <Link href={`/tools/${tool.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>You haven't uploaded any tools yet.</p>
                <Link href="/">
                  <Button variant="outline" className="mt-2 bg-transparent">
                    Submit Your First Tool
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">All Your Comments</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* Tool Comments */}
              {toolComments &&
                toolComments.map((comment: any) => (
                  <Card key={`tool-${comment.id}`} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            Tool
                          </Badge>
                          <Link href={`/tools/${comment.tools.id}`} className="flex items-center gap-2 hover:underline">
                            {comment.tools.image_url && (
                              <img
                                src={comment.tools.image_url || "/placeholder.svg"}
                                alt={comment.tools.name}
                                className="w-6 h-6 rounded object-cover"
                              />
                            )}
                            <span className="font-medium text-sm">{comment.tools.name}</span>
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                          {comment.rating && (
                            <div className="flex items-center gap-1">
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < comment.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs font-medium">{comment.rating}</span>
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{comment.content}</p>

                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            {comment.helpful_count} helpful
                          </Badge>
                          <DeleteCommentButton commentId={comment.id} commentType="tool" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {/* Community Comments */}
              {communityComments &&
                communityComments.map((comment: any) => (
                  <Card key={`community-${comment.id}`} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                            Community
                          </Badge>
                          <Link href={`/community`} className="hover:underline">
                            <span className="font-medium text-sm">{comment.community_posts.title}</span>
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{comment.content}</p>

                        <div className="flex items-center gap-2">
                          <DeleteCommentButton commentId={comment.id} commentType="community" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {(!toolComments || toolComments.length === 0) &&
                (!communityComments || communityComments.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>You haven't left any comments yet.</p>
                    <Link href="/">
                      <Button variant="outline" className="mt-2 bg-transparent">
                        Explore Tools
                      </Button>
                    </Link>
                  </div>
                )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Favorite Tools */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Favorite Tools</h2>
                {favoriteTools && favoriteTools.length > 0 ? (
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {favoriteTools.map((favorite: any) => (
                      <div key={favorite.id} className="border rounded-lg p-3">
                        <Link
                          href={`/tools/${favorite.tools.id}`}
                          className="flex items-center gap-3 hover:bg-muted/50 rounded p-1"
                        >
                          {favorite.tools.image_url && (
                            <img
                              src={favorite.tools.image_url || "/placeholder.svg"}
                              alt={favorite.tools.name}
                              className="w-8 h-8 rounded object-cover flex-shrink-0"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-sm truncate">{favorite.tools.name}</h4>
                            <p className="text-xs text-muted-foreground truncate">{favorite.tools.description}</p>
                            {favorite.tools.rating > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{favorite.tools.rating}</span>
                              </div>
                            )}
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No favorite tools yet.</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Liked Posts */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Liked Posts</h2>
                {likedPosts && likedPosts.length > 0 ? (
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {likedPosts.map((like: any) => (
                      <div key={like.id} className="border rounded-lg p-3">
                        <Link href="/community" className="block hover:bg-muted/50 rounded p-1">
                          <h4 className="font-medium text-sm line-clamp-2">{like.community_posts.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {like.community_posts.content}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              <Heart className="h-3 w-3 mr-1" />
                              {like.community_posts.like_count}
                            </Badge>
                            {like.community_posts.author_name && (
                              <span className="text-xs text-muted-foreground">
                                by {like.community_posts.author_name}
                              </span>
                            )}
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No liked posts yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
