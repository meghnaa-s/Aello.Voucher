export type Occasion =
  | "Happy Birthday"
  | "With Love"
  | "Congratulations"
  | "Just For You"
  | "A Little Self-Care"
  | "Happy Anniversary";

export const OCCASIONS: Occasion[] = [
  "Happy Birthday",
  "With Love",
  "Congratulations",
  "Just For You",
  "A Little Self-Care",
  "Happy Anniversary",
];

export interface VoucherPackage {
  id: string;
  classes: number;
  price: number;
  label: string;
}

export interface SiteSettings {
  packages: VoucherPackage[];
  currency: string;
  intuUrl: string;
  locationUrl: string;
  instagramUrl: string;
  contactEmail: string;
  studioImageUrl: string | null;
  defaultValidityMonths: number;
}

export type VoucherStatus =
  | "ACTIVE"
  | "PARTIALLY REDEEMED"
  | "REDEEMED"
  | "EXPIRED";

export interface Voucher {
  id: string;
  code: string;
  recipientName: string;
  senderName: string;
  occasion: Occasion | string;
  message: string;
  totalClasses: number;
  remainingClasses: number;
  price: number;
  currency: string;
  issueDate: string;
  expiryDate: string;
  redemptions: { date: string; note?: string }[];
}

export function computeStatus(v: Voucher): VoucherStatus {
  const now = Date.now();
  const expired = new Date(v.expiryDate).getTime() < now;
  if (v.remainingClasses <= 0) return "REDEEMED";
  if (expired) return "EXPIRED";
  if (v.remainingClasses < v.totalClasses) return "PARTIALLY REDEEMED";
  return "ACTIVE";
}
