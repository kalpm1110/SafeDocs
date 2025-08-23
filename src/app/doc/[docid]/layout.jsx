import DocNavbar from "@/components/DocNavbar";
import { supabaseBrowser } from "@/lib/supabase";

export default async function DocLayout({ children, params }) {
  const { docid } = await params; 
  
  const { data, error } = await supabaseBrowser
    .from("documents")
    .select("*")
    .eq("id", docid)
    .single();
    console.log(data);

  if (!data) return <div>Document not found</div>;

  return (
    <div className="flex flex-col h-screen">
      <DocNavbar doc={data} />
      <main className="flex-1">{children}</main>
      <footer />
    </div>
  );
}
