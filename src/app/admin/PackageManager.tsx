"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import type { SafariPackage } from "@/lib/types";
import { deletePackage, savePackage } from "./actions";

type Row = { key: string; label: string; price: string; price_to: string; unit: string };

const input =
  "w-full rounded-xl border border-brand/20 bg-white px-3 py-2 text-sm text-forest outline-none focus:border-brand focus:ring-4 focus:ring-brand/10";
const uid = () => Math.random().toString(36).slice(2);

export function PackageManager({ packages }: { packages: SafariPackage[] }) {
  const [adding, setAdding] = useState(false);
  const nextOrder = packages.reduce((m, p) => Math.max(m, p.sort_order), 0) + 1;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-forest">Safari packages</h1>
        {!adding && (
          <button onClick={() => setAdding(true)} className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-cream hover:bg-brand-dark">
            <Plus size={16} /> New package
          </button>
        )}
      </div>

      {adding && <Editor key="new" pkg={null} nextOrder={nextOrder} defaultOpen onDone={() => setAdding(false)} />}
      {packages.map((p) => (
        <Editor key={p.id} pkg={p} nextOrder={nextOrder} />
      ))}
      {packages.length === 0 && !adding && (
        <p className="rounded-2xl bg-cream p-8 text-center text-forest/70">No packages yet. Click &ldquo;New package&rdquo; to add one.</p>
      )}
    </div>
  );
}

function Editor({ pkg, nextOrder, defaultOpen = false, onDone }: { pkg: SafariPackage | null; nextOrder: number; defaultOpen?: boolean; onDone?: () => void }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(defaultOpen);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [name, setName] = useState(pkg?.name ?? "");
  const [duration, setDuration] = useState(pkg?.duration ?? "");
  const [schedule, setSchedule] = useState(pkg?.schedule ?? "");
  const [description, setDescription] = useState(pkg?.description ?? "");
  const [inclusions, setInclusions] = useState((pkg?.inclusions ?? []).join("\n"));
  const [order, setOrder] = useState(String(pkg?.sort_order ?? nextOrder));
  const [active, setActive] = useState(pkg?.is_active ?? true);
  const [rows, setRows] = useState<Row[]>(
    (pkg?.package_prices ?? []).map((p) => ({
      key: uid(), label: p.label, price: String(p.price), price_to: p.price_to == null ? "" : String(p.price_to), unit: p.unit,
    })),
  );

  const setRow = (key: string, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  function save() {
    setMsg(null);
    start(async () => {
      const res = await savePackage({
        id: pkg?.id,
        name, duration, schedule, description,
        inclusions: inclusions.split("\n"),
        sort_order: order,
        is_active: active,
        prices: rows.map((r) => ({ label: r.label, price: r.price, price_to: r.price_to === "" ? null : r.price_to, unit: r.unit })),
      });
      if (res.ok) {
        setMsg({ ok: true, text: "Saved. The website is updated." });
        router.refresh();
        onDone?.();
      } else {
        setMsg({ ok: false, text: res.error });
      }
    });
  }

  function remove() {
    if (!pkg) return onDone?.();
    start(async () => {
      const res = await deletePackage(pkg.id);
      if (res.ok) router.refresh();
      else setMsg({ ok: false, text: res.error ?? "Could not delete." });
    });
  }

  return (
    <section className="overflow-hidden rounded-3xl bg-cream shadow-sm">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left" aria-expanded={open}>
        <span>
          <span className="font-display text-xl text-forest">{name || "New package"}</span>
          <span className="ml-3 text-sm text-forest/60">
            {rows.length} price{rows.length === 1 ? "" : "s"}
            {!active && " - hidden from website"}
          </span>
        </span>
        <ChevronDown className={`shrink-0 text-forest transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="space-y-5 border-t border-brand/10 px-6 pb-6 pt-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-forest">Package name
              <input className={`${input} mt-1`} value={name} onChange={(e) => setName(e.target.value)} placeholder="Half Day Safari" />
            </label>
            <label className="text-sm font-medium text-forest">Duration
              <input className={`${input} mt-1`} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="4.5 hours" />
            </label>
            <label className="text-sm font-medium text-forest sm:col-span-2">Schedule
              <input className={`${input} mt-1`} value={schedule} onChange={(e) => setSchedule(e.target.value)} placeholder="Morning 6:00am - 10:30am | Evening 1:30pm - 6:00pm" />
            </label>
            <label className="text-sm font-medium text-forest sm:col-span-2">Description
              <textarea className={`${input} mt-1`} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <label className="text-sm font-medium text-forest sm:col-span-2">What&apos;s included <span className="font-normal text-forest/60">(one per line)</span>
              <textarea className={`${input} mt-1`} rows={6} value={inclusions} onChange={(e) => setInclusions(e.target.value)} />
            </label>
          </div>

          <div>
            <p className="text-sm font-medium text-forest">Prices (USD)</p>
            <p className="text-xs text-forest/60">Use &ldquo;To&rdquo; only when the price is a range, e.g. $70 - $60.</p>
            <div className="mt-3 space-y-2">
              {rows.length > 0 && (
                <div className="hidden grid-cols-[1.6fr_1fr_1fr_1.2fr_auto] gap-2 px-1 text-xs font-medium text-forest/60 sm:grid">
                  <span>Group / label</span><span>Price</span><span>To (optional)</span><span>Unit</span><span className="w-9" />
                </div>
              )}
              {rows.map((r) => (
                <div key={r.key} className="grid grid-cols-2 gap-2 rounded-2xl bg-white/60 p-2 sm:grid-cols-[1.6fr_1fr_1fr_1.2fr_auto] sm:bg-transparent sm:p-0">
                  <input aria-label="Label" className={`${input} col-span-2 sm:col-span-1`} value={r.label} onChange={(e) => setRow(r.key, { label: e.target.value })} placeholder="2-3 persons" />
                  <input aria-label="Price" className={input} inputMode="decimal" value={r.price} onChange={(e) => setRow(r.key, { price: e.target.value })} placeholder="70" />
                  <input aria-label="Price to" className={input} inputMode="decimal" value={r.price_to} onChange={(e) => setRow(r.key, { price_to: e.target.value })} placeholder="60" />
                  <input aria-label="Unit" className={input} value={r.unit} onChange={(e) => setRow(r.key, { unit: e.target.value })} placeholder="per person" />
                  <button type="button" aria-label="Remove price" onClick={() => setRows((rs) => rs.filter((x) => x.key !== r.key))} className="grid size-9 place-items-center justify-self-end rounded-xl text-red-700 hover:bg-red-50"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setRows((rs) => [...rs, { key: uid(), label: "", price: "", price_to: "", unit: "per person" }])} className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
              <Plus size={15} /> Add price
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-forest">
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="size-4 accent-[#005828]" /> Show on website
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-forest">Order
              <input className={`${input} w-20`} inputMode="numeric" value={order} onChange={(e) => setOrder(e.target.value)} />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand/10 pt-5">
            <div className="flex items-center gap-3">
              <button type="button" onClick={save} disabled={pending} className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-cream hover:bg-brand-dark disabled:opacity-60">
                {pending ? "Saving..." : pkg ? "Save changes" : "Create package"}
              </button>
              {msg && <span role="status" className={`text-sm font-medium ${msg.ok ? "text-brand" : "text-red-700"}`}>{msg.text}</span>}
            </div>
            {confirmDelete ? (
              <span className="flex items-center gap-2 text-sm">
                Delete this package and its prices?
                <button type="button" onClick={remove} disabled={pending} className="rounded-full bg-red-700 px-4 py-2 font-semibold text-white">Yes, delete</button>
                <button type="button" onClick={() => setConfirmDelete(false)} className="rounded-full px-3 py-2 text-forest hover:bg-sand">Cancel</button>
              </span>
            ) : (
              <button type="button" onClick={() => (pkg ? setConfirmDelete(true) : onDone?.())} className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50">
                <Trash2 size={15} /> {pkg ? "Delete package" : "Discard"}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
