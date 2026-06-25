"use client";

import { useState, useEffect, useCallback } from "react";
import { PACKING_CATEGORIES } from "@/data/tripData";
import { supabase } from "@/lib/supabase";
import { Check, Plus, X, Zap, Loader2 } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type ChecklistItem = { id: string; text: string; checked: boolean; list_id: string };
type ChecklistList = { id: string; name: string; type: string; items: ChecklistItem[] };

// ── Known list IDs (seeded in schema.sql) ────────────────────────────────────

const LIST_IDS = {
  daily:   "10000000-0000-0000-0000-000000000001",
  docs:    "10000000-0000-0000-0000-000000000002",
  packing: "10000000-0000-0000-0000-000000000003",
} as const;

// ── Packing seed (inserts to Supabase if table is empty) ─────────────────────

function buildPackingInserts() {
  return PACKING_CATEGORIES.flatMap((cat) =>
    cat.items.map((text) => ({
      list_id: LIST_IDS.packing,
      text: `${cat.category}: ${text}`,
      checked: false,
    }))
  );
}

// ── Progress ring ────────────────────────────────────────────────────────────

function ProgressRing({ done, total, size = 52, stroke = 3 }: {
  done: number; total: number; size?: number; stroke?: number;
}) {
  const r    = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = total > 0 ? circ * (done / total) : 0;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#111" strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.3s ease" }}
      />
    </svg>
  );
}

// ── Blitz mode ───────────────────────────────────────────────────────────────

function BlitzMode({ items, onClose, onToggle }: {
  items: ChecklistItem[];
  onClose: () => void;
  onToggle: (id: string) => void;
}) {
  const unchecked = items.filter((i) => !i.checked);
  const [idx, setIdx] = useState(0);
  const current = unchecked[idx];

  if (!current) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center gap-6 px-8">
        <span className="text-5xl">✅</span>
        <p className="text-white text-xl font-medium text-center">All done!</p>
        <p className="text-gray-400 text-sm text-center">Everything on this list is checked off.</p>
        <button onClick={onClose} className="mt-4 px-6 py-3 rounded-full bg-white text-gray-900 text-sm font-medium">
          Back to list
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <span className="text-xs text-gray-500">{idx + 1} of {unchecked.length} remaining</span>
        <button onClick={onClose}><X size={18} strokeWidth={1.5} className="text-gray-500" /></button>
      </div>
      <div className="mx-5 h-1 bg-gray-800 rounded-full">
        <div className="h-1 bg-white rounded-full transition-all duration-300" style={{ width: `${(idx / unchecked.length) * 100}%` }} />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
        <p className="text-white text-2xl font-medium text-center leading-snug">{current.text}</p>
      </div>
      <div className="flex gap-4 px-5 pb-16">
        <button
          onClick={() => setIdx((i) => Math.min(i + 1, unchecked.length))}
          className="flex-1 py-4 rounded-2xl border border-gray-700 text-gray-400 text-sm font-medium"
        >
          Skip
        </button>
        <button
          onClick={() => { onToggle(current.id); }}
          className="flex-1 py-4 rounded-2xl bg-white text-gray-900 text-sm font-medium flex items-center justify-center gap-2"
        >
          <Check size={16} strokeWidth={2} /> Done
        </button>
      </div>
    </div>
  );
}

// ── Item row ─────────────────────────────────────────────────────────────────

function ItemRow({ item, onToggle, onRemove }: {
  item: ChecklistItem;
  onToggle: () => void;
  onRemove: () => void;
}) {
  return (
    <div className={`flex items-center gap-3 bg-white rounded-2xl border px-4 py-3.5 shadow-sm transition-all ${
      item.checked ? "border-gray-50 opacity-50" : "border-gray-100"
    }`}>
      <button
        onClick={onToggle}
        className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-all ${
          item.checked ? "bg-gray-900 border-gray-900" : "border-gray-300"
        }`}
      >
        {item.checked && <Check size={10} strokeWidth={3} className="text-white" />}
      </button>
      <span className={`flex-1 text-sm leading-snug ${item.checked ? "line-through text-gray-400" : "text-gray-800"}`}>
        {item.text}
      </span>
      <button onClick={onRemove} className="p-1">
        <X size={12} strokeWidth={1.5} className="text-gray-300" />
      </button>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function ListsPage() {
  const [lists, setLists] = useState<ChecklistList[]>([]);
  const [activeListId, setActiveListId] = useState<string>(LIST_IDS.daily);
  const [blitzMode, setBlitzMode] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [newItemText, setNewItemText] = useState("");
  const [loading, setLoading] = useState(true);

  // ── Load from Supabase ───────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    const [{ data: listsData }, { data: itemsData }] = await Promise.all([
      supabase.from("checklist_lists").select("*").order("created_at"),
      supabase.from("checklist_items").select("*").order("created_at"),
    ]);

    if (!listsData) return;

    // Seed packing if empty
    const packingItems = (itemsData ?? []).filter((i) => i.list_id === LIST_IDS.packing);
    if (packingItems.length === 0) {
      await supabase.from("checklist_items").insert(buildPackingInserts());
      const { data: fresh } = await supabase.from("checklist_items").select("*").order("created_at");
      buildLists(listsData, fresh ?? []);
    } else {
      buildLists(listsData, itemsData ?? []);
    }
    setLoading(false);
  }, []);

  function buildLists(listsData: {id: string; name: string; type: string}[], itemsData: ChecklistItem[]) {
    setLists(
      listsData.map((l) => ({
        ...l,
        items: itemsData.filter((i) => i.list_id === l.id),
      }))
    );
  }

  useEffect(() => { loadData(); }, [loadData]);

  // ── Realtime subscription ────────────────────────────────────────────────

  useEffect(() => {
    const channel = supabase
      .channel("checklist_items_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "checklist_items" },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            const updated = payload.new as ChecklistItem;
            setLists((prev) =>
              prev.map((l) => ({
                ...l,
                items: l.items.map((i) => i.id === updated.id ? { ...i, checked: updated.checked } : i),
              }))
            );
          } else if (payload.eventType === "INSERT") {
            const inserted = payload.new as ChecklistItem;
            setLists((prev) =>
              prev.map((l) =>
                l.id !== inserted.list_id ? l : { ...l, items: [...l.items, inserted] }
              )
            );
          } else if (payload.eventType === "DELETE") {
            const deleted = payload.old as { id: string };
            setLists((prev) =>
              prev.map((l) => ({ ...l, items: l.items.filter((i) => i.id !== deleted.id) }))
            );
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // ── Actions ──────────────────────────────────────────────────────────────

  const toggleItem = async (item: ChecklistItem) => {
    // Optimistic update
    setLists((prev) =>
      prev.map((l) => ({
        ...l,
        items: l.items.map((i) => i.id === item.id ? { ...i, checked: !i.checked } : i),
      }))
    );
    await supabase
      .from("checklist_items")
      .update({ checked: !item.checked, checked_at: !item.checked ? new Date().toISOString() : null })
      .eq("id", item.id);
  };

  const addItem = async () => {
    if (!newItemText.trim()) return;
    const text = newItemText.trim();
    setNewItemText("");
    setAddingItem(false);
    await supabase.from("checklist_items").insert({ list_id: activeListId, text, checked: false });
  };

  const removeItem = async (item: ChecklistItem) => {
    // Optimistic
    setLists((prev) =>
      prev.map((l) => ({ ...l, items: l.items.filter((i) => i.id !== item.id) }))
    );
    await supabase.from("checklist_items").delete().eq("id", item.id);
  };

  // ── Render ───────────────────────────────────────────────────────────────

  const activeList = lists.find((l) => l.id === activeListId) ?? { id: activeListId, name: "", type: "", items: [] };
  const done   = activeList.items.filter((i) => i.checked).length;
  const total  = activeList.items.length;
  const allDone = done === total && total > 0;

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-3">
        <Loader2 size={24} strokeWidth={1.5} className="text-gray-300 animate-spin" />
        <p className="text-xs text-gray-400">Loading lists…</p>
      </div>
    );
  }

  return (
    <>
      {blitzMode && (
        <BlitzMode
          items={activeList.items}
          onClose={() => setBlitzMode(false)}
          onToggle={(id) => {
            const item = activeList.items.find((i) => i.id === id);
            if (item) toggleItem(item);
          }}
        />
      )}

      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="px-5 pt-12 pb-4 bg-white border-b border-gray-100">
          <h1 className="text-xl font-medium text-gray-900">Lists</h1>
          <p className="text-xs text-gray-400 mt-0.5">Stay organised for 22 days</p>
        </div>

        {/* List selector tabs */}
        <div className="flex gap-2 px-4 py-3 bg-white border-b border-gray-100 overflow-x-auto scrollbar-hide">
          {lists.map((l) => {
            const d = l.items.filter((i) => i.checked).length;
            const t = l.items.length;
            const active = l.id === activeListId;
            return (
              <button
                key={l.id}
                onClick={() => setActiveListId(l.id)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  active ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {l.name}
                {t > 0 && (
                  <span className={`ml-1.5 ${active ? "text-white/60" : "text-gray-400"}`}>
                    {d}/{t}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Progress summary card */}
        <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <ProgressRing done={done} total={total} />
            <div className="absolute inset-0 flex items-center justify-center">
              {allDone ? (
                <Check size={18} strokeWidth={2.5} className="text-gray-900" />
              ) : (
                <span className="text-xs font-medium text-gray-700">
                  {total > 0 ? Math.round((done / total) * 100) : 0}%
                </span>
              )}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{activeList.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {allDone ? "All done! 🎉" : `${done} of ${total} complete`}
            </p>
          </div>
          <button
            onClick={() => setBlitzMode(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full"
          >
            <Zap size={11} strokeWidth={2} />
            Quick check
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-4 mt-3 space-y-2 pb-4">
          {activeList.items.filter((i) => !i.checked).map((item) => (
            <ItemRow key={item.id} item={item} onToggle={() => toggleItem(item)} onRemove={() => removeItem(item)} />
          ))}

          {done > 0 && (
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] text-gray-300 uppercase tracking-wide">Completed {done}</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
          )}

          {activeList.items.filter((i) => i.checked).map((item) => (
            <ItemRow key={item.id} item={item} onToggle={() => toggleItem(item)} onRemove={() => removeItem(item)} />
          ))}

          {addingItem ? (
            <div className="bg-white rounded-2xl border border-gray-200 px-4 py-3 flex items-center gap-3">
              <input
                autoFocus
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") addItem(); if (e.key === "Escape") { setAddingItem(false); setNewItemText(""); } }}
                placeholder="New item…"
                className="flex-1 text-sm text-gray-900 placeholder-gray-300 outline-none"
              />
              <button onClick={addItem} className="text-xs font-medium text-gray-900 px-3 py-1 rounded-full bg-gray-100">Add</button>
              <button onClick={() => { setAddingItem(false); setNewItemText(""); }}>
                <X size={14} strokeWidth={1.5} className="text-gray-400" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAddingItem(true)}
              className="w-full flex items-center gap-2 text-xs text-gray-400 py-2.5 px-4 rounded-2xl border border-dashed border-gray-200 hover:border-gray-300 transition-colors bg-white"
            >
              <Plus size={12} /> Add item
            </button>
          )}
        </div>
      </div>
    </>
  );
}
