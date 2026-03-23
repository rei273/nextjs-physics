import "server-only";
//import { SignJWT, jwtVerify } from "jose"; //session management library
//import { SessionPayload } from "@/app/lib/definitions";
import { cookies } from "next/headers";
import { Lucia } from "lucia";
import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";
import { db } from "@vercel/postgres";
import { Google } from "arctic"; //Arctic is a light weight library that provides API for creating authorization URLs, validating callbacks, and refreshing access tokens.

//const secretKey = process.env.SESSION_SECRET;
//const encodedKey = new TextEncoder().encode(secretKey);
//const redirectURL = "http://localhost:3000/login/google/callback";

//can do process.env.GOOGLE_CLIENT_ID!
//The ! in TypeScript is called the non-null assertion operator. It tells the TypeScript compiler, "I know this value will not be null or undefined, trust me!"

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Google Client ID and Secret are required!");
}

// const redirectURL = process.env.NODE_ENV === 'production' ? 'https://nextjs-physics-seven.vercel.app/login/google/callback' : 'http://localhost:3000/login/google/callback'

const redirectURL = process.env.NODE_ENV === 'production' ? 'https://www.grokvectors.com/login/google/callback' : 'http://localhost:3000/login/google/callback'

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  redirectURL
);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: {
      email?: string;
      google_id?: string;
      name?: string;
      picture?: string;
    };
  }
}

const adapter = new NodePostgresAdapter(db, {
  user: "users",
  session: "user_sessions",
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },

  getSessionAttributes: (attributes) => {
    return {
      email: attributes.email,
      //google_sub: attributes.google_sub, //maybe we don't expose google sub id
      name: attributes.name,
      picture: attributes.picture,
    };
  },
});

//create cookie
export async function createAuthSession(userId: string, email: string) {
  const session = await lucia.createSession(userId, { email });
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}

/**
 * Verifies the authentication session from cookies.
 * @returns {Promise<{ user: any, session: any } | { user: null, session: null }>} 
 * Returns an object containing the user and session if valid, otherwise both are null.
 */
export async function verifyAuth() {
  const sessionCookie = cookies().get(lucia.sessionCookieName);

  //if there is no valid cookies
  if (!sessionCookie) {
    return {
      user: null,
      session: null,
    };
  }

  const sessionID = sessionCookie.value;

  //if there is no valid ssession
  if (!sessionID) {
    return {
      user: null,
      session: null,
    };
  }

  //if there is valid cookie and session, validate those cookie and session:
  const result = await lucia.validateSession(sessionID);

  try {
    //if session is valid and fresh
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    //if we don't find a valid session, we clear the existing session cookie because it contains invalid session cookie
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch (error) {
    console.error("invalid cookie session with error: ");
    console.error(error);
  }

  return result;
}

export async function getSessionData() {
  const sessionCookie = cookies().get(lucia.sessionCookieName);

  //if there is no valid cookies
  if (!sessionCookie) {
    return {
      user: null,
      session: null,
    };
  }

  const sessionID = sessionCookie.value;

  //if there is no valid ssession
  if (!sessionID) {
    return {
      user: null,
      session: null,
    };
  }
  return sessionID;
}

//destroy session if no valid cookie and session.
export async function destroySession() {
  const { session } = await verifyAuth();

  if (!session) {
    return {
      error: "Unauthorized!",
    };
  }

  //call invalidateSession to destroy session
  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}

// export async function encrypt(payload: SessionPayload) {
//   return new SignJWT(payload)
//     .setProtectedHeader({ alg: "HS256" })
//     .setIssuedAt()
//     .setExpirationTime("7d")
//     .sign(encodedKey);
// }

// export async function decrypt(session: string | undefined = "") {
//   try {
//     const { payload } = await jwtVerify(session, encodedKey, {
//       algorithms: ["HS256"],
//     });
//     return payload;
//   } catch (error) {
//     console.log("Failed to verify session");
//   }
// }

// export async function createCookieSession(userId: string) {
//   const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
//   const session = await encrypt({ userId, expiresAt });

//   cookies().set("session", session, {
//     httpOnly: true,
//     secure: true,
//     expires: expiresAt,
//     sameSite: "lax",
//     path: "/",
//   });
// }

// export async function createDBSession(id: number) {
//   const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

//   // 1. Create a session in the database
//   const data = await db
//     .insert(sessions)
//     .values({
//       userId: id,
//       expiresAt,
//     })
//     // Return the session ID
//     .returning({ id: sessions.id });

//   const sessionId = data[0].id;

//   // 2. Encrypt the session ID
//   const session = await encrypt({ sessionId, expiresAt });

//   // 3. Store the session in cookies for optimistic auth checks
//   cookies().set("session", session, {
//     httpOnly: true,
//     secure: true,
//     expires: expiresAt,
//     sameSite: "lax",
//     path: "/",
//   });
// }

// export async function updateSession() {
//   const session = cookies().get("session")?.value;
//   const payload = await decrypt(session);

//   if (!session || !payload) {
//     return null;
//   }

//   const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
//   cookies().set("session", session, {
//     httpOnly: true,
//     secure: true,
//     expires: expires,
//     sameSite: "lax",
//     path: "/",
//   });
// }

// export function deleteSession() {
//   cookies().delete("session");
// }
