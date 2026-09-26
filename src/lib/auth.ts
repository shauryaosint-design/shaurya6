import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-me"
);

export type SessionUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  collegeId?: string | null;
  campusId?: string | null;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createToken(user: SessionUser) {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("mpgi_session")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) return null;
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const session: SessionUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    collegeId: user.collegeId,
    campusId: user.campusId,
  };

  const token = await createToken(session);
  return { user: session, token };
}

export async function requireAuth(roles?: string[]) {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  if (roles && !roles.includes(session.role) && session.role !== "SUPER_ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return session;
}
