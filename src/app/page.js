
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
export default async function Home() {

  const {isAuthenticated,getUser}=getKindeServerSession();
  const isloggedin=await isAuthenticated();
  if(isloggedin) redirect("/dashboard");

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1> Heyy Next Js!</h1>
    </div>

  );
}

