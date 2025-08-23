import redis from "@/lib/redis";



export async function POST(request) {

    try {
        const { docid, userId, username } = await request.json();
        console.log("jkbkb", docid);
        await redis.sRem(`doc:${docid}:online`, userId);

        await redis.publish(`doc:${docid}:presence`, JSON.stringify({ event: "leave", username }))

        return Response.json({ success: true });
    } catch (error) {
        console.log(error);
        return Response.json({ success: false }, { status: 500 });
    }

}