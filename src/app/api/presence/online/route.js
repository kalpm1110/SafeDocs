import redis from "@/lib/redis";



export async function GET(request) {
    const {searchParams}=new URL(request.url);
    const docid=searchParams.get("docid");
    console.log("afaf",docid);

    if (!docid) return Response.json({ error: "docId required" }, { status: 400 });

  const members = await redis.sMembers(`doc:${docid}:online`);
  return Response.json({"members":members});
}