import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getVoucherByCode, redeemClass } from "@/lib/store";
import { computeStatus } from "@/lib/types";
import { ADMIN_COOKIE, isValidSessionToken } from "@/lib/auth";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/vouchers/[code]">) {
  const { code } = await ctx.params;
  const voucher = getVoucherByCode(code);
  if (!voucher) {
    return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
  }
  return NextResponse.json({ voucher, status: computeStatus(voucher) });
}

export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/vouchers/[code]">) {
  const jar = await cookies();
  const isAdmin = isValidSessionToken(jar.get(ADMIN_COOKIE)?.value);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const note = typeof body?.note === "string" ? body.note.slice(0, 200) : undefined;

  const voucher = redeemClass(code, note);
  if (!voucher) {
    return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
  }
  return NextResponse.json({ voucher, status: computeStatus(voucher) });
}
