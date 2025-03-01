#!/usr/bin/env node

const crypto = require("crypto");
const fs = require("fs");
const { Command } = require("commander");
const ms = require("ms");
const packageJson = require("./package.json");
const { readFileContent } = require("./file");
const { encrypt, decrypt } = require("./encryption");

const API_BASE_URL = "https://secrets-backend.msdcconnect.workers.dev";

const program = new Command();

program
  .name("secret-cli")
  .description("A CLI tool for securely sharing secrets")
  .version(packageJson.version);

program
  .command("share [secret]")
  .description("Share a secret or a text file")
  .option("-f, --file <path>", "Path to a text file containing the secret")
  .option("-t, --ttl <ttl>", "Time-to-live (e.g. 1m, 2h, 1d)")
  .option(
    "-l, --limit <count>",
    "Number of times the secret can be read",
    parseInt
  )
  .action(async (secret, options) => {
    if (!secret && !options.file) {
      console.error("Error: Provide a secret text or a file.");
      process.exit(1);
    }

    let ttl = undefined;

    if (options.ttl) {
      const milliseconds = ms(options.ttl);

      if (!milliseconds) {
        console.error("Error: Invalid TTL. Please provide a valid time duration (e.g. 1m, 2h, 1d)");
        process.exit(1);
      }

      ttl = milliseconds / 1000;
      if (ttl < 60) {
        console.error("Error: Invalid TTL. TTL must be at least 1 minute");
        process.exit(1);
      }
    }

    let content = secret;

    if (options.file) {
      content = readFileContent(options.file);
    }

    const encrypted = encrypt(content);

    const id = crypto.randomBytes(8).toString("hex");

    const payload = {
      id,
      content: encrypted.content,
      iv: encrypted.iv,
      tag: encrypted.tag,
      ...(options.limit && { reads: options.limit }),
      ...(options.ttl && { ttl }),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const secretId = Buffer.from(encrypted.key + id, "hex").toString(
        "base64url"
      );

      console.log("\nTo view this secret, run:");
      console.log(`npx hidr view ${secretId}`);
    } catch (error) {
      console.error("Failed to store secret:", error);
      process.exit(1);
    }
  });

program
  .command("view <secret-id>")
  .description("Retrieve a shared secret")
  .option("-o, --output <file>", "Save output to a file")
  .action(async (secretId, options) => {
    try {
      const buffer = Buffer.from(secretId, "base64url");
      const hexString = buffer.toString("hex");

      const key = hexString.slice(0, 32);
      const id = hexString.slice(32);

      const response = await fetch(`${API_BASE_URL}/retrieve/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json();

      const decryptPayload = {
        content: data.content,
        iv: data.iv,
        tag: data.tag,
        key: key,
      };
      const decryptedContent = decrypt(decryptPayload);

      if (options.output) {

        fs.writeFileSync(options.output, decryptedContent);
        console.log(`Successfully saved secret to: ${options.output}`);
      } else {
        console.log(decryptedContent);
      }

      if (data.remainingReads !== null) {
        console.log(`\nRemaining reads: ${data.remainingReads}`);
      }
    } catch (error) {

      console.error("Failed to retrieve secret:", error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
