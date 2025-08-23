import redis from "@/lib/redis";



export async function POST(request) {

    try {
        const { docid, userId, username } = await request.json();
        console.log(username, docid);
        await redis.sAdd(`doc:${docid}:online`, userId);

        const message = JSON.stringify({ event: "join", username });
        // console.log("Publishing", `doc:${docid}:presence`, message);
        await redis.publish(`doc:${docid}:presence`, message);


        return Response.json({ success: true });
    } catch (error) {
        console.log(error);
        return Response.json({ success: false }, { status: 500 });
    }

}