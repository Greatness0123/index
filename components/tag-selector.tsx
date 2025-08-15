"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { supabase } from "@/lib/supabase/client"

interface Tag {
  id: string
  name: string
  slug: string
}

interface TagSelectorProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}

export function TagSelector({ selectedTags, onTagsChange }: TagSelectorProps) {
  const [tags, setTags] = useState<Tag[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    async function fetchTags() {
      const { data, error } = await supabase.from("tags").select("*").order("name")

      if (error) {
        console.error("Error fetching tags:", error)
        return
      }

      setTags(data || [])
    }

    fetchTags()
  }, [])

  const selectedTagObjects = tags.filter((tag) => selectedTags.includes(tag.id))

  const handleTagSelect = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter((id) => id !== tagId))
    } else {
      onTagsChange([...selectedTags, tagId])
    }
  }

  const handleTagRemove = (tagId: string) => {
    onTagsChange(selectedTags.filter((id) => id !== tagId))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedTagObjects.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="gap-1">
            {tag.name}
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-muted-foreground hover:text-foreground"
              onClick={() => handleTagRemove(tag.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            Add Tags
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandList>
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup>
                {tags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    onSelect={() => handleTagSelect(tag.id)}
                    className="flex items-center justify-between"
                  >
                    <span>{tag.name}</span>
                    {selectedTags.includes(tag.id) && (
                      <Badge variant="secondary" className="ml-2">
                        Selected
                      </Badge>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
