import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import type { Profile } from "../types"

export function useSupabaseUser() {
  const [user, setUser] = useState<Profile | null>(null)

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser({
          id: user.id,
          email: user.email ?? "",
          full_name: user.user_metadata.full_name,
          avatar_url: user.user_metadata.avatar_url,
        })
      }
    }

    loadUser()

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email ?? "",
            full_name: session.user.user_metadata.full_name,
            avatar_url: session.user.user_metadata.avatar_url,
          })
        } else {
          setUser(null)
        }
      }
    )

    return () => {
      subscription.subscription.unsubscribe()
    }
  }, [])

  return user
}

