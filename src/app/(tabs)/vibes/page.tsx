"use client";

import { useState, useRef } from "react";
import { DAYS } from "@/data/tripData";
import { getTheme } from "@/lib/theme";
import { supabase } from "@/lib/supabase";
import { Camera, Type, X, Loader2 } from "lucide-react";

const KEY_MOMENTS = [
  { dayNum: 1,  title: "Touchdown Stockholm ✈️", emoji: "🇸🇪" },
  { dayNum: 4,  title: "Vaxholm island day",      emoji: "⛵" },
  { dayNum: 5,  title: "Skansen & Junibacken",    emoji: "🦌" },
  { dayNum: 7,  title: "On to Malmö",             emoji: "🚂" },
  { dayNum: 9,  title: "Copenhagen day trip",      emoji: "🇩🇰" },
  { dayNum: 11, title: "Efteling theme park!",     emoji: "🎢" },
  { dayNum: 13, title: "Rotterdam + Den Haag",     emoji: "🌷" },
  { dayNum: 15, title: "Bruges — medieval city",   emoji: "🏰" },
  { dayNum: 16, title: "Ghent wanders",            emoji: "🚲" },
  { dayNum: 18, title: "Brussels & Grand-Place",   emoji: "🍫" },
  { dayNum: 21, title: "Last evening in Europe",   emoji: "🌅" },
  { dayNum: 22, title: "Homeward bound",           emoji: "🇮🇳" },
];

const STICKERS = ["☀️", "❤️", "⭐", "📸", "📍", "🎉", "🌊", "🍕"];

type Post = { id: string; dayNum: number; type: "photo" | "text" | "empty"; content: string; sticker?: string };

function buildFeed(): Post[] {
  return DAYS.map((day) => {
    const moment = KEY_MOMENTS.find((m) => m.dayNum === day.day);
    return {
      id: `slot-${day.day}`,
      dayNum: day.day,
      type: "empty",
      content: moment ? `${moment.emoji} ${moment.title}` : day.city,
    };
  });
}

export default function VibesPage() {
  const [posts, setPosts] = useState<Post[]>(buildFeed);
  const [composingDay, setComposingDay] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [sticker, setSticker] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const day = DAYS[0];

  const handlePhoto = async (file: File, dayNum: number) => {
    setUploading(true);
    const localUrl = URL.createObjectURL(file);
    setPosts(prev => prev.map(p => p.id === `slot-${dayNum}`
      ? { ...p, type: "photo", content: localUrl } : p));

    const path = `vibe-${dayNum}-${Date.now()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("card-photos").upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("card-photos").getPublicUrl(path);
      setPosts(prev => prev.map(p => p.id === `slot-${dayNum}`
        ? { ...p, type: "photo", content: data.publicUrl } : p));
    }
    setUploading(false);
  };

  const saveText = (dayNum: number) => {
    if (!text.trim()) return;
    setPosts(prev => prev.map(p => p.id === `slot-${dayNum}`
      ? { ...p, type: "text", content: text.trim(), sticker } : p));
    setText(""); setSticker(""); setComposingDay(null);
  };

  // Group by country
  const countryGroups: { country: string; days: typeof DAYS[0][] }[] = [];
  for (const d of DAYS) {
    const last = countryGroups[countryGroups.length - 1];
    if (last?.country === d.country) last.days.push(d);
    else countryGroups.push({ country: d.country, days: [d] });
  }

  return (
    <div className="min-h-full bg-[#f8f8f8]">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 bg-white border-b border-gray-100">
        <h1 className="text-xl font-medium text-gray-900">Vibes</h1>
        <p className="text-xs text-gray-400 mt-0.5">Your trip in photos & moments</p>
      </div>

      <div className="px-4 pt-4 space-y-8 pb-6">
        {countryGroups.map(({ country, days: groupDays }) => {
          const theme = getTheme(country as Parameters<typeof getTheme>[0]);
          return (
            <div key={country}>
              {/* Country header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{theme.flag}</span>
                <span className="text-[13px] font-medium text-gray-700">{country}</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Day cards grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {groupDays.map((d) => {
                  const post = posts.find(p => p.id === `slot-${d.day}`)!;
                  const isComposing = composingDay === d.day;

                  if (isComposing) {
                    return (
                      <div key={d.day} className="col-span-2 bg-white rounded-2xl border border-gray-100 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[13px] font-medium text-gray-700">Day {d.day} · {d.city}</p>
                          <button onClick={() => setComposingDay(null)}>
                            <X size={16} className="text-gray-400" />
                          </button>
                        </div>
                        <textarea
                          autoFocus
                          value={text}
                          onChange={e => setText(e.target.value)}
                          placeholder="Write something about this day…"
                          className="w-full text-sm text-gray-800 placeholder-gray-300 outline-none resize-none leading-relaxed"
                          rows={3}
                        />
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                          <div className="flex gap-2">
                            {STICKERS.map(s => (
                              <button key={s} onClick={() => setSticker(s === sticker ? "" : s)}
                                className={`text-lg transition-transform ${s === sticker ? "scale-125" : ""}`}>
                                {s}
                              </button>
                            ))}
                          </div>
                          <button onClick={() => saveText(d.day)}
                            className="text-xs font-medium text-white bg-gray-900 px-4 py-1.5 rounded-full">
                            Save
                          </button>
                        </div>
                      </div>
                    );
                  }

                  if (post.type === "photo") {
                    return (
                      <div key={d.day} className="relative rounded-2xl overflow-hidden aspect-square bg-gray-100">
                        <img src={post.content} alt="" className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-2.5 pb-2 pt-6">
                          <p className="text-[11px] text-white/80">Day {d.day}</p>
                          <p className="text-[12px] text-white font-medium">{d.city}</p>
                        </div>
                      </div>
                    );
                  }

                  if (post.type === "text") {
                    return (
                      <div key={d.day} className="rounded-2xl bg-white border border-gray-100 p-3.5 aspect-square flex flex-col justify-between">
                        <div>
                          <p className="text-[11px] text-gray-400">Day {d.day} · {d.city}</p>
                          {post.sticker && <span className="text-2xl mt-1 block">{post.sticker}</span>}
                          <p className="text-[13px] text-gray-700 mt-1 leading-snug line-clamp-4">{post.content}</p>
                        </div>
                      </div>
                    );
                  }

                  // Empty slot
                  return (
                    <div key={d.day} className="rounded-2xl border border-dashed border-gray-200 aspect-square flex flex-col items-center justify-center gap-2 bg-white/50">
                      <p className="text-[11px] text-gray-400 text-center px-2">{post.content}</p>
                      <div className="flex gap-2">
                        <input ref={fileRef} type="file" accept="image/*" className="hidden"
                          onChange={e => { const f = e.target.files?.[0]; if (f) handlePhoto(f, d.day); }} />
                        <button onClick={() => fileRef.current?.click()}
                          className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                          {uploading ? <Loader2 size={13} className="animate-spin text-gray-400" /> : <Camera size={13} className="text-gray-400" />}
                        </button>
                        <button onClick={() => setComposingDay(d.day)}
                          className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                          <Type size={13} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
