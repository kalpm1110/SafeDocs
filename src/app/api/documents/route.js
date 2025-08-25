

import { encrpytText } from "@/lib/crypto";
import redis from "@/lib/redis";
import { supabaseServer } from "@/lib/supabase";

export async function POST(request) {
    try {
        const docData = await request.json();
        const encrpteddata =encrpytText(docData.content);

        const { data, error } = await supabaseServer.from('documents').insert({
            ownerId: docData.ownerId,
            title: docData.title,
            content: encrpteddata,
            allowed_emails: docData.allowedEmails,
            public_access: docData.publicAccess,
            expiry: docData.expiry ? new Date(docData.expiry).toISOString() : null,
            access_type: docData.accessType,
        }).select('id').single();


        if (error) throw new Error(error.message);

        const docId = data.id;
        // const redis = await Redisclient();
        const cache = {
            content: encrpteddata,
            allowed_emails: docData.allowedEmails,
            publicAccess: docData.publicAccess,
            accessType: docData.accessType,
        }
        const cacheKey = `doc:${docId}`;
        const cacheVal = JSON.stringify(cache);

        let ttlsec = null;
        if (docData.expiry) {
            const expiryData = new Date(docData.expiry);
            ttlsec = Math.max(0, Math.floor((expiryData.getTime() - Date.now()) / 1000));
        } else ttlsec = 86400;

        if (ttlsec > 0) {
            await redis.set(cacheKey, cacheVal, { EX: ttlsec });
        } else {
            await redis.set(cacheKey, cacheVal); // No TTL if expired
        }

        // redirect(`/doc/${docId}`);


        return new Response(JSON.stringify({ id: docId, message: 'Document created and cached' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.log("Error", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}