import "server-only";
import { cookies } from "next/headers";
import { Lucia } from "lucia";
import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";
import { db } from "@vercel/postgres";
import { Google } from "arctic";

const redirectURL = process.env.NODE_ENV === 'production' ? 'https://www.grokvectors.com/login/google/callback' : 'http://localhost:3000/login/google/callback'
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const google =
  googleClientId && googleClientSecret
    ? new Google(googleClientId, googleClientSecret, redirectURL)
    : null;

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
      name: attributes.name,
      picture: attributes.picture,
    };
  },
});

export async function createAuthSession(userId: string, email: string) {
  const session = await lucia.createSession(userId, { email });
  const sessionCookie = lucia.createSessionCookie(session.id);
  const cookieStore = await cookies();
  cookieStore.set(
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
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(lucia.sessionCookieName);

  if (!sessionCookie) {
    return {
      user: null,
      session: null,
    };
  }

  const sessionID = sessionCookie.value;

  if (!sessionID) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionID);

  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookieStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookieStore.set(
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
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(lucia.sessionCookieName);

  if (!sessionCookie) {
    return {
      user: null,
      session: null,
    };
  }

  const sessionID = sessionCookie.value;

  if (!sessionID) {
    return {
      user: null,
      session: null,
    };
  }
  return sessionID;
}

export async function destroySession() {
  const { session } = await verifyAuth();

  if (!session) {
    return {
      error: "Unauthorized!",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  const cookieStore = await cookies();
  cookieStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}
