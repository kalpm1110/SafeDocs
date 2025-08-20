// import { KindeProvider, useKindeAuth } from "@kinde-oss/kinde-auth-nextjs"
import ControlButton from "@/components/Buttons/ControlButton";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import Link from "next/link";
export default async function dashboard() {
    // Server Side
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    console.log(user);

    return (
        <main className="w-full flex justify-center">
            {user ? (
                <div className="">
                    <h1>Welcome, {user.given_name}</h1>
                    <ControlButton></ControlButton>
                </div>
            ) : (
                <a href="/api/auth/login">Login</a>
            )}
        </main>
    )

}