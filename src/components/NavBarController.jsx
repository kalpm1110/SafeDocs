"use client"

import { usePathname } from "next/navigation"
import Navbar from "./Navbar";

export default function NavbarController({user}){
    const pathname=usePathname();
    if(pathname.startsWith("/doc/")) return null;
    return <Navbar user={user}></Navbar>
}