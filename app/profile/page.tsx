import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileSettings } from "@/components/profile-settings"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ProfileSettings user={user} profile={profile} />
          </div>

          <div>
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
        </div>
      </div>
    </div>
  )
}
