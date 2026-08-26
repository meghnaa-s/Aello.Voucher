"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import { computeStatus, SiteSettings, Voucher, VoucherStatus } from "@/lib/types";
import { formatVoucherDate } from "@/lib/format";

const STATUS_STYLES: Record<VoucherStatus, string> = {
  ACTIVE: "bg-umber/15 text-umber",
  "PARTIALLY REDEEMED": "bg-mocha/20 text-espresso",
  REDEEMED: "bg-espresso/10 text-espresso/70",
  EXPIRED: "bg-clay/15 text-clay",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<"vouchers" | "settings">("vouchers");
  const [vouchers, setVouchers] = useState<Voucher[] | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  async function loadVouchers() {
    try {
      const res = await fetch("/api/vouchers");
      if (res.status === 401) {
        router.refresh();
        return;
      }
      const data = await res.json();
      setVouchers(data.vouchers);
    } catch {
      setLoadError("Could not load vouchers.");
    }
  }

  async function loadSettings() {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data.settings);
    } catch {
      setLoadError("Could not load settings.");
    }
  }

  useEffect(() => {
    const t = setTimeout(() => {
      loadVouchers();
      loadSettings();
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleRedeem(code: string) {
    await fetch(`/api/vouchers/${code}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: "Redeemed via admin" }),
    });
    loadVouchers();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <main className="min-h-[100dvh] px-5 py-10 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <Image src="/brand/wordmark-black.png" alt="Aello" width={64} height={24} />
          <button
            type="button"
            onClick={handleLogout}
            className="font-sans text-[0.6rem] tracking-luxe-sm uppercase text-umber hover:text-espresso"
          >
            Log Out
          </button>
        </div>

        <h1 className="font-serif-display mt-8 text-3xl font-light text-espresso">
          Voucher Administration
        </h1>

        <div className="mt-8 flex gap-6 border-b border-espresso/10">
          {(["vouchers", "settings"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                "pb-3 font-sans text-xs tracking-luxe-sm uppercase transition-colors",
                tab === t ? "border-b-2 border-espresso text-espresso" : "text-umber"
              )}
            >
              {t === "vouchers" ? "Vouchers" : "Settings"}
            </button>
          ))}
        </div>

        {loadError && <p className="mt-6 font-sans text-xs text-clay">{loadError}</p>}

        {tab === "vouchers" && (
          <VoucherTable vouchers={vouchers} onRedeem={handleRedeem} />
        )}
        {tab === "settings" && settings && (
          <SettingsEditor settings={settings} onSaved={setSettings} />
        )}
      </div>
    </main>
  );
}

function VoucherTable({
  vouchers,
  onRedeem,
}: {
  vouchers: Voucher[] | null;
  onRedeem: (code: string) => void;
}) {
  if (!vouchers) {
    return <p className="mt-10 font-sans text-sm text-umber">Loading…</p>;
  }
  if (vouchers.length === 0) {
    return <p className="mt-10 font-sans text-sm text-umber">No vouchers yet.</p>;
  }

  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full min-w-[820px] border-collapse font-sans text-sm">
        <thead>
          <tr className="border-b border-espresso/15 text-left text-[0.6rem] tracking-luxe-sm uppercase text-umber">
            <th className="py-3 pr-4">Code</th>
            <th className="py-3 pr-4">Recipient</th>
            <th className="py-3 pr-4">Sender</th>
            <th className="py-3 pr-4">Occasion</th>
            <th className="py-3 pr-4">Classes</th>
            <th className="py-3 pr-4">Expiry</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 pr-4" />
          </tr>
        </thead>
        <tbody>
          {vouchers.map((v) => {
            const status = computeStatus(v);
            return (
              <tr key={v.id} className="border-b border-espresso/8 text-espresso">
                <td className="py-3 pr-4 font-medium tracking-wide">{v.code}</td>
                <td className="py-3 pr-4">{v.recipientName}</td>
                <td className="py-3 pr-4">{v.senderName}</td>
                <td className="py-3 pr-4">{v.occasion}</td>
                <td className="py-3 pr-4 tabular-nums">
                  {v.remainingClasses} / {v.totalClasses}
                </td>
                <td className="py-3 pr-4">{formatVoucherDate(v.expiryDate)}</td>
                <td className="py-3 pr-4">
                  <span
                    className={clsx(
                      "rounded-full px-2.5 py-1 text-[0.6rem] tracking-luxe-sm uppercase",
                      STATUS_STYLES[status]
                    )}
                  >
                    {status}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <button
                    type="button"
                    disabled={v.remainingClasses <= 0}
                    onClick={() => onRedeem(v.code)}
                    className="whitespace-nowrap rounded-full border border-espresso/25 px-3 py-1.5 text-[0.6rem] tracking-luxe-sm uppercase text-espresso transition-colors hover:border-espresso disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Redeem Class
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SettingsEditor({
  settings,
  onSaved,
}: {
  settings: SiteSettings;
  onSaved: (s: SiteSettings) => void;
}) {
  const [form, setForm] = useState<SiteSettings>(settings);
  const [syncedSettings, setSyncedSettings] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (settings !== syncedSettings) {
    setSyncedSettings(settings);
    setForm(settings);
  }

  function updatePackage(id: string, field: "price" | "label", value: string) {
    setForm((f) => ({
      ...f,
      packages: f.packages.map((p) =>
        p.id === id
          ? { ...p, [field]: field === "price" ? Number(value) || 0 : value }
          : p
      ),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      onSaved(data.settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  async function handleUpload(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    if (!res.ok) return;
    const data = await res.json();
    setForm((f) => ({ ...f, studioImageUrl: data.url }));
  }

  return (
    <div className="mt-8 max-w-2xl space-y-10">
      <section>
        <h2 className="font-sans text-[0.65rem] tracking-luxe uppercase text-umber">
          Packages
        </h2>
        <div className="mt-4 space-y-3">
          {form.packages.map((p) => (
            <div key={p.id} className="flex items-center gap-3">
              <span className="w-20 font-sans text-sm text-espresso">{p.classes} cl.</span>
              <input
                value={p.label}
                onChange={(e) => updatePackage(p.id, "label", e.target.value)}
                className="flex-1 rounded-[2px] border border-espresso/20 bg-paper px-3 py-2 font-sans text-sm text-ink outline-none focus:border-espresso"
              />
              <div className="flex items-center gap-1">
                <span className="font-sans text-xs text-umber">{form.currency}</span>
                <input
                  type="number"
                  step="0.001"
                  value={p.price}
                  onChange={(e) => updatePackage(p.id, "price", e.target.value)}
                  className="w-24 rounded-[2px] border border-espresso/20 bg-paper px-3 py-2 font-sans text-sm text-ink outline-none focus:border-espresso"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-sans text-[0.65rem] tracking-luxe uppercase text-umber">
          Links
        </h2>
        <div className="mt-4 space-y-3">
          <LabeledInput
            label="Intu Booking URL"
            value={form.intuUrl}
            onChange={(v) => setForm((f) => ({ ...f, intuUrl: v }))}
          />
          <LabeledInput
            label="Location URL"
            value={form.locationUrl}
            onChange={(v) => setForm((f) => ({ ...f, locationUrl: v }))}
          />
          <LabeledInput
            label="Instagram URL"
            value={form.instagramUrl}
            onChange={(v) => setForm((f) => ({ ...f, instagramUrl: v }))}
          />
          <LabeledInput
            label="Contact Email"
            value={form.contactEmail}
            onChange={(v) => setForm((f) => ({ ...f, contactEmail: v }))}
          />
        </div>
      </section>

      <section>
        <h2 className="font-sans text-[0.65rem] tracking-luxe uppercase text-umber">
          Default Validity (months)
        </h2>
        <input
          type="number"
          min={1}
          max={36}
          value={form.defaultValidityMonths}
          onChange={(e) =>
            setForm((f) => ({ ...f, defaultValidityMonths: Number(e.target.value) || 1 }))
          }
          className="mt-3 w-28 rounded-[2px] border border-espresso/20 bg-paper px-3 py-2 font-sans text-sm text-ink outline-none focus:border-espresso"
        />
      </section>

      <section>
        <h2 className="font-sans text-[0.65rem] tracking-luxe uppercase text-umber">
          Studio Photograph
        </h2>
        <div className="mt-4 flex items-center gap-5">
          <div className="h-24 w-20 overflow-hidden rounded-[2px] border border-espresso/15 bg-cream">
            {form.studioImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.studioImageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center font-sans text-[0.55rem] uppercase text-umber/60">
                Default
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer rounded-full border border-espresso/25 px-4 py-2 text-center font-sans text-[0.6rem] tracking-luxe-sm uppercase text-espresso hover:border-espresso">
              {uploading ? "Uploading…" : "Upload Photo"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              />
            </label>
            {form.studioImageUrl && (
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, studioImageUrl: null }))}
                className="font-sans text-[0.6rem] tracking-luxe-sm uppercase text-umber hover:text-espresso"
              >
                Reset to default
              </button>
            )}
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="rounded-full bg-espresso px-8 py-3.5 font-sans text-xs tracking-luxe uppercase text-paper transition-colors hover:bg-ink disabled:opacity-60"
      >
        {saving ? "Saving…" : saved ? "Saved" : "Save Settings"}
      </button>
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-sans text-[0.6rem] tracking-luxe-sm uppercase text-umber">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[2px] border border-espresso/20 bg-paper px-3 py-2 font-sans text-sm text-ink outline-none focus:border-espresso"
      />
    </label>
  );
}
