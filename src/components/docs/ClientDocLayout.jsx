"use client";
import { DocContext } from "@/app/hooks/DocContext";
import DocNavbar from "@/components/DocNavbar";

export default function ClientDocLayout({ data, children }) {
  return (
    <DocContext.Provider value={data}>
      <div className="flex flex-col h-screen">
        <DocNavbar />
        <main className="flex-1">{children}</main>
        <footer />
      </div>
    </DocContext.Provider>
  );
}