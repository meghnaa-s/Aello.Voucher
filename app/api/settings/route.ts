import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSettings, updateSettings } from "@/lib/store";
import { ADMIN_COOKIE, isValidSessionToken } from "@/lib/auth";
import { SiteSettings, VoucherPackage } from "@/lib/types";

export async function GET() {
  return NextResponse.json({ settings: getSettings() });
}

export async function PUT(req: NextRequest) {
  const jar = await cookies();
  const isAdmin = isValidSessionToken(jar.get(ADMIN_COOKIE)?.value);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as Partial<SiteSettings> | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const partial: Partial<SiteSettings> = {};

  if (Array.isArray(body.packages)) {
    const packages = body.packages
      .filter(
        (p): p is VoucherPackage =>
          typeof p?.classes === "number" &&
          typeof p?.price === "number" &&
          typeof p?.label === "string"
      )
      .map((p) => ({
        id: p.id || `pkg-${p.classes}`,
        classes: Math.max(1, Math.round(p.classes)),
        price: Math.max(0, p.price),
        label: p.label.slice(0, 40),
      }));
    if (packages.length > 0) partial.packages = packages;
  }

  if (typeof body.currency === "string") partial.currency = body.currency.slice(0, 6);
  if (typeof body.intuUrl === "string") partial.intuUrl = body.intuUrl.slice(0, 300);
  if (typeof body.locationUrl === "string") partial.locationUrl = body.locationUrl.slice(0, 300);
  if (typeof body.instagramUrl === "string") partial.instagramUrl = body.instagramUrl.slice(0, 300);
  if (typeof body.contactEmail === "string") partial.contactEmail = body.contactEmail.slice(0, 120);
  if (typeof body.defaultValidityMonths === "number") {
    partial.defaultValidityMonths = Math.min(36, Math.max(1, Math.round(body.defaultValidityMonths)));
  }
  if (body.studioImageUrl === null || typeof body.studioImageUrl === "string") {
    partial.studioImageUrl = body.studioImageUrl;
  }

  const settings = updateSettings(partial);
  return NextResponse.json({ settings });
}
