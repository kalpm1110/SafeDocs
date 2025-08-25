import { randomBytes, createDecipheriv, createCipheriv } from "crypto";

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "base64"); // 32 bytes for AES-256

export async function encryptText(data) {
    const iv = randomBytes(12); // 96-bit nonce for GCM
    const cipher = createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);

    let encrypted = cipher.update(data, "utf8", "base64");
    encrypted += cipher.final("base64");

    const authTag = cipher.getAuthTag();

    // final format = iv + encrypted + authTag
    return Buffer.concat([
        iv,
        Buffer.from(encrypted, "base64"),
        authTag,
    ]).toString("base64");
}


export async function decryptText(encryptedData) {
    const encryptedBuffer = Buffer.from(encryptedData, "base64");

    // split into parts: [iv | ciphertext | authTag]
    const iv = encryptedBuffer.subarray(0, 12);
    const authTag = encryptedBuffer.subarray(encryptedBuffer.length - 16);
    const ciphertext = encryptedBuffer.subarray(12, encryptedBuffer.length - 16);

    const decipher = createDecipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext, "base64", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
} 