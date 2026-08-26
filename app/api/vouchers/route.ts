import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createVoucher, getSettings, listVouchers } from "@/lib/store";
import { ADMIN_COOKIE, isValidSessionToken } from "@/lib/auth";

export async function GET() {
  const jar = await cookies();
  const isAdmin = isValidSessionToken(jar.get(ADMIN_COOKIE)?.value);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ vouchers: listVouchers() });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { recipientName, senderName, occasion, message, classes, expiryDate } = body as {
    recipientName?: string;
    senderName?: string;
    occasion?: string;
    message?: string;
    classes?: number;
    expiryDate?: string;
  };

  if (!recipientName?.trim() || !senderName?.trim() || !occasion || !message?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const settings = getSettings();
  const pkg = settings.packages.find((p) => p.classes === classes);
  if (!pkg) {
    return NextResponse.json({ error: "Invalid package selected" }, { status: 400 });
  }

  const expiry = expiryDate ? new Date(expiryDate) : null;
  const fallbackExpiry = new Date();
  fallbackExpiry.setMonth(fallbackExpiry.getMonth() + settings.defaultValidityMonths);

  const finalExpiry = expiry && !isNaN(expiry.getTime()) ? expiry : fallbackExpiry;
  if (finalExpiry.getTime() < Date.now()) {
    return NextResponse.json(
      { error: "Expiry date must be in the future" },
      { status: 400 }
    );
  }

  const voucher = createVoucher({
    recipientName: recipientName.slice(0, 80),
    senderName: senderName.slice(0, 80),
    occasion,
    message: message.slice(0, 400),
    totalClasses: pkg.classes,
    price: pkg.price,
    expiryDate: finalExpiry.toISOString(),
  });

  return NextResponse.json({ voucher }, { status: 201 });
}
