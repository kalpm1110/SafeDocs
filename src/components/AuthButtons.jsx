"use client"

import { LoginLink, LogoutLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs"

function AuthButtons({isAuthenticated}) {
  return (
    <div>
        {isAuthenticated?(
            <LogoutLink>Logout</LogoutLink>
        ):(
            <>
            <LoginLink>Login</LoginLink>
            <RegisterLink>SignUp</RegisterLink>
            </>
        )}
    </div>
  )
}

export default AuthButtons;
