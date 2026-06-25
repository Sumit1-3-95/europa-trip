"use client";

import { useState } from "react";
import { DAYS } from "@/data/tripData";
import { getTheme } from "@/lib/theme";
import { Camera, Plus, Type, X, Sun, Heart, Star, MapPin } from "lucide-react";

// Key moments pre-seeded for major events
const KEY_MOMENTS = [
  { dayNum: 1,  title: "Touchdown Stockholm ✈️",    emoji: "🇸🇪" },
  { dayNum: 4,  title: "Vaxholm island day",         emoji: "⛵" },
  { dayNum: 5,  title: "Skansen & Junibacken",       emoji: "🦌" },
  { dayNum: 7,  title: "On to Malmö",                emoji: "🚂" },
  { dayNum: 9,  title: "Copenhagen day trip",        emoji: "🇩🇰" },
  { dayNum: 11, title: "Efteling theme park!",       emoji: "🎢" },
  { dayNum: 13, title: "Rotterdam + Den Haag",       emoji: "🌷" },
  { dayNum: 15, title: "Bruges — medieval city",     emoji: "🏰" },
  { dayNum: 16, title: "Ghent wanders",              emoji: "🚲" },
  { dayNum: 18, title: "Brussels & Grand-Place",     emoji: "🍫" },
  { dayNum: 19, title: "Fly back to Stockholm",      emoji: "✈️" },
  { dayNum: 21, title: "Last evening in Europe",     emoji: "🌅" },
  { dayNum: 22, title: "Homeward bound",             emoji: "🇮🇳" },
];

const STICKERS = [
  { id: "sun",    label: "Sun",     emoji: "☀️" },
  { id: "heart",  label: "Heart",   emoji: "❤️" },
  { id: "star",   label: "Star",    emoji: "⭐" },
  { id: "camera", label: "Camera",  emoji: "📸" },
  { id: "pin",    label: "Pin",     emoji: "📍" },
];

type MemoryPost = {
  id: string;
  dayNum: number;
  type: "text" | "placeholder";
  content: string;
  sticker?: string;
};

// Build initial feed: key moments + empty slots
function buildFeed(): MemoryPost[] {
  const posts: MemoryPost[] = [];
  const momentDays = new Set(KEY_MOMENTS.map((m) => m.dayNum));

  for (const day of DAYS) {
    const moment = KEY_MOMENTS.find((m) => m.dayNum === day.day);
    if (moment) {
      posts.push({
        id: `moment-${day.day}`,
        dayNum: day.day,
        type: "placeholder",
        content: `${moment.emoji} ${moment.title}`,
      });
    } else if (day.day <= 10) {
      // Show empty slots for first half to demonstrate the pattern
      posts.push({
        id: `slot-${day.day}`,
        dayNum: day.day,
        type: "placeholder",
        content: "",
      });
    }
  }
  return posts;
}

export default function VibesPage() {
  const [posts, setPosts] = useState<MemoryPost[]>(buildFeed);
  const [addingDay, setAddingDay] = useState<number | null>(null);
  const [addType, setAddType] = useState<"text" | null>(null);
  const [textInput, setTextInput] = useState("");
  const [selectedSticker, setSelectedSticker] = useState<string | undefined>(undefined);

  const submitText = (dayNum: number) => {
    if (!textInput.trim()) return;
    const newPost: MemoryPost = {
      id: `user-${Date.now()}`,
      dayNum,
      type: "text",
      content: textInput.trim(),
      sticker: selectedSticker,
    };
    setPosts((prev) => {
      // Insert after the slot for this day
      const idx = prev.findIndex((p) => p.dayNum === dayNum);
      const next = [...prev];
      if (idx >= 0) next.splice(idx + 1, 0, newPost);
      else next.push(newPost);
      return next;
    });
    setTextInput("");
    setSelectedSticker(undefined);
    setAddingDay(null);
    setAddType(null);
  };

  // Group posts by day for day separators
  const grouped: { dayNum: number; dayLabel: string; country: string; posts: MemoryPost[] }[] = [];
  for (const post of posts) {
    const day = DAYS.find((d) => d.day === post.dayNum);
    if (!day) continue;
    const last = grouped[grouped.length - 1];
    if (last && last.dayNum === post.dayNum) {
      last.posts.push(post);
    } else {
      grouped.push({ dayNum: post.dayNum, dayLabel: day.dateLabel, country: day.country, posts: [post] });
    }
  }

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 bg-white border-b border-gray-100">
        <h1 className="text-xl font-medium text-gray-900">Vibes</h1>
        <p className="text-xs text-gray-400 mt-0.5">Your family memory lane</p>
      </div>

      <div className="px-4 py-4 space-y-1">
        {grouped.map(({ dayNum, dayLabel, country, posts: dayPosts }) => {
          const theme = getTheme(country as any);
          return (
            <div key={dayNum}>
              {/* Day separator */}
              <div className="flex items-center gap-3 py-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: theme.bg }}>
                  <span className="text-[9px] font-medium" style={{ color: theme.accentText }}>{dayNum}</span>
                </div>
                <span className="text-xs text-gray-400">{dayLabel}</span>
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-base">{theme.flag}</span>
              </div>

              {/* Posts for this day */}
              <div className="space-y-3 mb-1">
                {dayPosts.map((post) => {
                  if (post.type === "placeholder" && post.content) {
                    return <KeyMomentCard key={post.id} post={post} theme={theme} />;
                  }
                  if (post.type === "placeholder" && !post.content) {
                    return (
                      <EmptySlotCard
                        key={post.id}
                        dayNum={dayNum}
                        onAdd={() => { setAddingDay(dayNum); setAddType("text"); }}
                      />
                    );
                  }
                  if (post.type === "text") {
                    return <TextMemoryCard key={post.id} post={post} />;
                  }
                  return null;
                })}

                {/* Add memory button (for key moment days too) */}
                {addingDay === dayNum ? (
                  <TextInputCard
                    value={textInput}
                    onChange={setTextInput}
                    sticker={selectedSticker}
                    onStickerChange={setSelectedSticker}
                    onSubmit={() => submitText(dayNum)}
                    onCancel={() => { setAddingDay(null); setAddType(null); setTextInput(""); }}
                  />
                ) : (
                  <button
                    onClick={() => { setAddingDay(dayNum); setAddType("text"); }}
                    className="w-full flex items-center gap-2 text-xs text-gray-400 py-2 px-4 rounded-xl border border-dashed border-gray-200 hover:border-gray-300 transition-colors bg-white"
                  >
                    <Plus size={12} />
                    Add a memory
                  </button>
                )}
              </div>
            </div>
          );
        })}

        <div className="h-4" />
      </div>
    </div>
  );
}

function KeyMomentCard({ post, theme }: { post: MemoryPost; theme: any }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Pastel image placeholder */}
      <div
        className="w-full h-44 flex flex-col items-center justify-center gap-2"
        style={{ backgroundColor: theme.bg }}
      >
        <span className="text-4xl">{post.content.split(" ")[0]}</span>
        <span className="text-sm font-medium" style={{ color: theme.accentText }}>
          {post.content.split(" ").slice(1).join(" ")}
        </span>
      </div>
      <div className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.dotColor }} />
          <p className="text-xs text-gray-400">Key moment</p>
          <Camera size={10} className="text-gray-300 ml-auto" />
          <span className="text-xs text-gray-300">Add photo</span>
        </div>
      </div>
    </div>
  );
}

function EmptySlotCard({ dayNum, onAdd }: { dayNum: number; onAdd: () => void }) {
  return (
    <button
      onClick={onAdd}
      className="w-full bg-white rounded-2xl border border-dashed border-gray-200 p-6 flex flex-col items-center gap-2 hover:border-gray-300 transition-colors"
    >
      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
        <Camera size={18} strokeWidth={1.5} className="text-gray-300" />
      </div>
      <p className="text-sm text-gray-400">Add your photo or memory here</p>
    </button>
  );
}

function TextMemoryCard({ post }: { post: MemoryPost }) {
  const sticker = STICKERS.find((s) => s.id === post.sticker);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-start gap-2">
        <p className="flex-1 text-sm text-gray-700 leading-relaxed">{post.content}</p>
        {sticker && <span className="text-xl flex-shrink-0">{sticker.emoji}</span>}
      </div>
      <p className="text-[11px] text-gray-300 mt-2">Just now · You</p>
    </div>
  );
}

function TextInputCard({
  value,
  onChange,
  sticker,
  onStickerChange,
  onSubmit,
  onCancel,
}: {
  value: string;
  onChange: (v: string) => void;
  sticker: string | undefined;
  onStickerChange: (v: string | undefined) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-gray-500 font-medium">Add a memory</span>
        <button onClick={onCancel}>
          <X size={14} strokeWidth={1.5} className="text-gray-400" />
        </button>
      </div>

      <textarea
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What happened today?"
        className="w-full text-sm text-gray-700 placeholder-gray-300 resize-none outline-none leading-relaxed min-h-[72px]"
      />

      {/* Sticker row */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
        {STICKERS.map((s) => (
          <button
            key={s.id}
            onClick={() => onStickerChange(sticker === s.id ? undefined : s.id)}
            className={`text-lg leading-none transition-opacity ${sticker && sticker !== s.id ? "opacity-30" : ""}`}
          >
            {s.emoji}
          </button>
        ))}
        <button
          onClick={onSubmit}
          disabled={!value.trim()}
          className="ml-auto text-xs font-medium px-3 py-1.5 rounded-full bg-gray-900 text-white disabled:opacity-30 transition-opacity"
        >
          Save
        </button>
      </div>
    </div>
  );
}
