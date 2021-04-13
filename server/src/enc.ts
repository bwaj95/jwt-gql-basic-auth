// import crypto from "crypto";

// export const isEncryptDecrypt = (flag: string, text: string) => {
//   const algorithm = process.env.ENC_ALGO!;
//   const key = crypto.randomBytes(32);
//   const iv = crypto.randomBytes(16);

//   if (flag === "E") {

//     let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
//     let encrypted = cipher.update(text);
//     encrypted = Buffer.concat([encrypted, cipher.final()]);

//     //return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
//     return encrypted.toString("hex");

//   } else if (flag === "D") {
//     let iv = Buffer.from(text.iv, 'hex');
//     let encryptedText = Buffer.from(text.encryptedData, 'hex');
//     let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
//     let decrypted = decipher.update(encryptedText);
//     decrypted = Buffer.concat([decrypted, decipher.final()]);
//     return decrypted.toString();
//   } else {
//     throw new Error("No encryption flag set.");
//   }
// };
