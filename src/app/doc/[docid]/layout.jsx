import { supabaseBrowser } from "@/lib/supabase";
import ClientDocLayout from "@/components/docs/ClientDocLayout";// New client component

export default async function DocLayout({ children, params }) {
  const { docid } = params; // No await needed, params is an object

  const { data, error } = await supabaseBrowser
    .from("documents")
    .select("*")
    .eq("id", docid)
    .single();
  console.log(data);

  if (!data) return <div>Document not found</div>;

  return (
    <ClientDocLayout data={data}>
      {children}
    </ClientDocLayout>
  );
}