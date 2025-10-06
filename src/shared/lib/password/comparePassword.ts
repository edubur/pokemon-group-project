import { scrypt } from "crypto";
import { promisify } from "util";

// Convert scrypt to return a Promise so can use async/await
const scryptAsync = promisify(scrypt);

// Compares supplied password with saved hash and salt
export default async function comparePassword(
  savedHash: string,
  savedSalt: string,
  suppliedPassword: string
) {
  // Hash supplied password using stored salt
  const suppliedHashBuffer = (await scryptAsync(
    suppliedPassword,
    savedSalt,
    64 // Output length in bytes
  )) as Buffer;

  // Convert Buffer to hex string and compare with stored hash
  return suppliedHashBuffer.toString("hex") === savedHash;
}
