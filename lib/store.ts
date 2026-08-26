import fs from "node:fs";
import path from "node:path";
import { SiteSettings, Voucher } from "./types";
import { DEFAULT_SETTINGS } from "./settings-defaults";

interface Db {
  vouchers: Voucher[];
  settings: SiteSettings;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "store.json");

const DEMO_VOUCHER: Voucher = {
  id: "demo",
  code: "AELLO-DEMO-001",
  recipientName: "Sara",
  senderName: "Maya",
  occasion: "Happy Birthday",
  message:
    "Wishing you a beautiful birthday filled with movement, energy and a little time just for you.",
  totalClasses: 5,
  remainingClasses: 5,
  price: 50,
  currency: "OMR",
  issueDate: new Date().toISOString(),
  expiryDate: "2026-12-31T20:00:00.000Z",
  redemptions: [],
};

function seedDb(): Db {
  return {
    vouchers: [DEMO_VOUCHER],
    settings: DEFAULT_SETTINGS,
  };
}

function ensureDb(): Db {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    const seeded = seedDb();
    fs.writeFileSync(DB_PATH, JSON.stringify(seeded, null, 2));
    return seeded;
  }
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  try {
    const parsed = JSON.parse(raw) as Db;
    if (!parsed.settings) parsed.settings = DEFAULT_SETTINGS;
    if (!parsed.vouchers) parsed.vouchers = [DEMO_VOUCHER];
    return parsed;
  } catch {
    const seeded = seedDb();
    fs.writeFileSync(DB_PATH, JSON.stringify(seeded, null, 2));
    return seeded;
  }
}

function writeDb(db: Db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function getSettings(): SiteSettings {
  return ensureDb().settings;
}

export function updateSettings(partial: Partial<SiteSettings>): SiteSettings {
  const db = ensureDb();
  db.settings = { ...db.settings, ...partial };
  writeDb(db);
  return db.settings;
}

export function listVouchers(): Voucher[] {
  return ensureDb().vouchers.slice().sort((a, b) => (a.issueDate < b.issueDate ? 1 : -1));
}

export function getVoucherByCode(code: string): Voucher | null {
  const db = ensureDb();
  return db.vouchers.find((v) => v.code.toLowerCase() === code.toLowerCase()) ?? null;
}

function randomSegment(length: number): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export function generateVoucherCode(existing: Voucher[]): string {
  let code = "";
  do {
    code = `AELLO-${randomSegment(4)}-${randomSegment(3)}`;
  } while (existing.some((v) => v.code === code));
  return code;
}

export interface CreateVoucherInput {
  recipientName: string;
  senderName: string;
  occasion: string;
  message: string;
  totalClasses: number;
  price: number;
  expiryDate: string;
}

export function createVoucher(input: CreateVoucherInput): Voucher {
  const db = ensureDb();
  const code = generateVoucherCode(db.vouchers);
  const voucher: Voucher = {
    id: `v_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    code,
    recipientName: input.recipientName.trim(),
    senderName: input.senderName.trim(),
    occasion: input.occasion,
    message: input.message.trim(),
    totalClasses: input.totalClasses,
    remainingClasses: input.totalClasses,
    price: input.price,
    currency: db.settings.currency,
    issueDate: new Date().toISOString(),
    expiryDate: input.expiryDate,
    redemptions: [],
  };
  db.vouchers.push(voucher);
  writeDb(db);
  return voucher;
}

export function redeemClass(code: string, note?: string): Voucher | null {
  const db = ensureDb();
  const voucher = db.vouchers.find((v) => v.code.toLowerCase() === code.toLowerCase());
  if (!voucher) return null;
  if (voucher.remainingClasses <= 0) return voucher;
  voucher.remainingClasses -= 1;
  voucher.redemptions.push({ date: new Date().toISOString(), note });
  writeDb(db);
  return voucher;
}
