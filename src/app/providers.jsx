
"use client"

import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs"

export function Providers({ children }) {
  return <KindeProvider>{children}</KindeProvider>
}
