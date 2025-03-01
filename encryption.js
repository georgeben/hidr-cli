const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";

function encrypt(content) {
  const encryptionKey = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);

  // Create cipher and encrypt the content
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.concat([encryptionKey, encryptionKey]),
    iv
  );
  let encryptedContent = cipher.update(content, "utf8", "hex");
  encryptedContent += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  // Combine IV, encrypted content and auth tag into final payload
  const payload = {
    iv: iv.toString("hex"),
    content: encryptedContent,
    tag: authTag,
    key: encryptionKey.toString("hex"),
  };

  return payload;
}

function decrypt(payload) {
  const { iv, content, tag, key } = payload;

  const encryptionKey = Buffer.from(key, "hex");
  const fullKey = Buffer.concat([encryptionKey, encryptionKey]);
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    fullKey,
    Buffer.from(iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(tag, "hex"));
  let decryptedContent = decipher.update(content, "hex", "utf8");
  decryptedContent += decipher.final("utf8");

  return decryptedContent;
}

module.exports = {
  encrypt,
  decrypt,
};
