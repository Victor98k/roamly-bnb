import * as Jose from "jose";
import { JWTPayload } from "jose";

export type JWTUserPayload = {
  userId: string;
  [key: string]: any;
};

// Ensure the environment variable is available
const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET environment variable is not set");
}

// Convert the secret into a Uint8Array
const encodedSecret = new TextEncoder().encode(secret);

export async function signJWT(payload: JWTUserPayload): Promise<string> {
  return await new Jose.SignJWT(payload)
    // jwt.io för att byta krypterings algorithm.
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(encodedSecret);
}

export async function verifyJWT(token: string): Promise<JWTUserPayload | null> {
  try {
    const { payload } = await Jose.jwtVerify(token, encodedSecret);
    return payload as JWTUserPayload;
  } catch (e) {
    console.error("JWT verification failed");
    return null;
  }
}
