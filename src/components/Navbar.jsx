
import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import AuthButtons from "./AuthButtons";
export default async function Navbar() {
    const {getUser}=getKindeServerSession();
    const user=await getUser();
    return (
        <nav className="flex justify-between items-center p-4 border-b">
            <Link href="/"  className="font-bold text-xl">SafeDocs</Link>
            <div className="flex gap-3 items-center">
                {user ? <span className="text-sm text">Hey {user?.given_name}</span> :<span className="text-sm">Hey User!</span>}
                <AuthButtons isAuthenticated={!!user} ></AuthButtons>
            </div>
        </nav>
    )

}