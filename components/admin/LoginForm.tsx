"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Incorrect password.");
      return;
    }
    router.refresh();
  }

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
      <Image src="/brand/wordmark-black.png" alt="Aello" width={90} height={33} className="opacity-90" />
      <p className="mt-6 font-sans text-[0.65rem] tracking-luxe uppercase text-umber">
        Voucher Administration
      </p>

      <form onSubmit={handleSubmit} className="mt-10 w-full max-w-xs">
        <label className="block">
          <span className="mb-2 block font-sans text-[0.6rem] tracking-luxe-sm uppercase text-umber">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-[2px] border border-espresso/20 bg-paper px-4 py-3 font-sans text-sm text-ink outline-none focus:border-espresso"
            autoFocus
          />
        </label>
        {error && <p className="mt-3 font-sans text-xs text-clay">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-espresso py-3.5 font-sans text-xs tracking-luxe uppercase text-paper transition-colors hover:bg-ink disabled:opacity-60"
        >
          {loading ? "Checking…" : "Enter"}
        </button>
      </form>
    </main>
  );
}
