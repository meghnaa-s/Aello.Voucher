import { SiteSettings } from "./types";

export const DEFAULT_SETTINGS: SiteSettings = {
  currency: "OMR",
  packages: [
    { id: "pkg-1", classes: 1, price: 12, label: "1 Class" },
    { id: "pkg-3", classes: 3, price: 33, label: "3 Classes" },
    { id: "pkg-5", classes: 5, price: 50, label: "5 Classes" },
    { id: "pkg-10", classes: 10, price: 90, label: "10 Classes" },
  ],
  intuUrl: "https://intu.app/aello-pilates",
  locationUrl: "https://maps.google.com/?q=Aello+Pilates+Al+Ansab+Muscat+Oman",
  instagramUrl: "https://instagram.com/aello.pilates",
  contactEmail: "hello@aellopilates.com",
  studioImageUrl: null,
  defaultValidityMonths: 6,
};
