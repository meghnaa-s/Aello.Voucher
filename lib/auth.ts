import crypto from "node:crypto";

const SECRET = process.env.ADMIN_SESSION_SECRET || "aello-quiet-luxury-secret";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "aello-admin";
}

export function tokenForPassword(password: string): string {
  return crypto.createHmac("sha256", SECRET).update(password).digest("hex");
}

export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  return token === tokenForPassword(getAdminPassword());
}

export const ADMIN_COOKIE = "aello_admin_session";
