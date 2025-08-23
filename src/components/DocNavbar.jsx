
"use client"

import { Check, LogOut, Share, Share2, Users } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";


export default function DocNavbar({ doc }) {
  const { user } = useKindeAuth();
  const router = useRouter();
  const userId = user?.id;
  const docid = doc?.id;


  const [members, setmembers] = useState([]);
  const [copied, setcopied] = useState(false)

  useEffect(() => {
    async function joinDoc() {
      const res1 = await fetch("/api/presence/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ docid, userId, username: user?.given_name }),
      })
      console.log("Joined", res1);

      const res2 = await fetch(`/api/presence/online?docid=${docid}`);
      const data = await res2.json();
      console.log("Online", data);

      setmembers(data.members || []);
    }
    joinDoc();
    return () => {
      fetch("/api/presence/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          docid,
          userId,
          username: user?.given_name,
        }),
      });


    }
  }, [doc.id, userId])


  const handleLeave = async () => {
    const res = await fetch("/api/presence/leave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docid,
        userId,
        username: user?.given_name,
      }),
    });


    console.log(await res);
    const msg = await res;
    if (msg.ok) router.push("/dashboard");

  }

  const handleShare = async (e) => {
    try {
      const url = `${window?.location?.origin}/doc/${doc.id}`;
      await navigator.clipboard.writeText(url);
      setcopied(true);
      setTimeout(() => setcopied(false), 2000);
    } catch (error) {
      console.log(error);
    }

  }
  return (
    <header className="w-full border-b bg-white shadow-sm">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-gray-900">{doc.title}</h1>
          <Badge
            variant="secondary"
            className="capitalize text-xs font-medium"
          >
            {doc.access_type}
          </Badge>
        </div>

        {/* Center: Members (dummy for now, later Redis presence) */}
        <div className="flex items-center gap-2">
          <Users size={18} className="text-gray-500" />
          <div className="flex -space-x-2">
            {/* Example avatars (later real users) */}
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=A`}
              alt="user"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=B`}
              alt="user"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleShare}>
            {copied ? <Check size={16}></Check> : <Share2 size={16} />}
            {copied ? "Copied!" : "Share"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleLeave}
          >
            <LogOut size={16} />
            Leave
          </Button>
        </div>
      </div>
    </header>
  )
}
