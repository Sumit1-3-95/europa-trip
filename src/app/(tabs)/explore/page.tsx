"use client";

import { useState } from "react";
import { LANGUAGE_PHRASES, CURRENCIES, DAYS } from "@/data/tripData";
import { getTheme } from "@/lib/theme";
import {
  Plane, Train, Cloud, DollarSign, MessageSquare, Lightbulb,
  RotateCcw, ChevronLeft, ChevronRight, ArrowLeftRight
} from "lucide-react";

const DEV_DAY = 5;
const currentDay = DAYS.find((d) => d.day === DEV_DAY) ?? DAYS[0];

// City trivia — one fact per city (static)
const CITY_TRIVIA: Record<string, { fact: string; emoji: string }> = {
  Stockholm:          { fact: "Stockholm is built across 14 islands connected by 57 bridges.", emoji: "🏝️" },
  Vaxholm:            { fact: "Vaxholm fortress has guarded the entrance to Stockholm's archipelago since the 16th century.", emoji: "🏰" },
  Malmö:              { fact: "The Turning Torso in Malmö is Scandinavia's tallest building at 190 m.", emoji: "🌀" },
  "Copenhagen (day trip)": { fact: "Copenhagen has more bicycles than cars — nearly 400 km of bike lanes.", emoji: "🚲" },
  "Amsterdam → Sprang-Capelle": { fact: "Amsterdam has more canals than Venice — over 100 km of waterways.", emoji: "🚣" },
  Efteling:           { fact: "Efteling opened in 1952 and is one of Europe's oldest theme parks, predating Disneyland.", emoji: "🎡" },
  "Rotterdam + Den Haag": { fact: "Rotterdam has Europe's largest port — handling over 400 million tonnes of goods per year.", emoji: "🚢" },
  "Den Haag → Ostend": { fact: "Den Haag (The Hague) is home to the International Court of Justice.", emoji: "⚖️" },
  Ostend:             { fact: "Ostend's beach is one of the widest in Belgium — perfect for kite-flying.", emoji: "🪁" },
  Bruges:             { fact: "Bruges has been called the Venice of the North — its medieval canals are UNESCO protected.", emoji: "🛶" },
  "Ghent → Sint-Pieters-Leeuw": { fact: "Ghent's Gravensteen castle was built in 1180 and is remarkably intact.", emoji: "🏯" },
  Brussels:           { fact: "Brussels has more than 30 Michelin-starred restaurants and invented the waffle.", emoji: "🧇" },
  "Brussels → Stockholm": { fact: "Belgium produces over 220,000 tonnes of chocolate per year — more than 20 kg per person.", emoji: "🍫" },
  Solna:              { fact: "Solna's Friends Arena is Scandinavia's largest indoor stadium.", emoji: "🏟️" },
  Delhi:              { fact: "Delhi has been continuously inhabited for over 5,000 years.", emoji: "🕌" },
};

type Tool = "phrases" | "currency" | "flight" | "train" | "weather" | "trivia";

export default function ExplorePage() {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  const theme = getTheme(currentDay.country);
  const trivia = CITY_TRIVIA[currentDay.city] ?? { fact: "Every city has a story waiting to be discovered.", emoji: "🗺️" };

  const tools: { id: Tool; label: string; icon: React.ReactNode; preview: string }[] = [
    { id: "phrases",  label: "Phrases",  icon: <MessageSquare size={20} strokeWidth={1.5} />, preview: `Learn ${currentDay.country === "Sweden" ? "Swedish" : currentDay.country === "Denmark" ? "Danish" : currentDay.country === "Netherlands" ? "Dutch" : "French"}` },
    { id: "currency", label: "Currency", icon: <DollarSign size={20} strokeWidth={1.5} />,   preview: "INR ↔ " + (currentDay.country === "Sweden" ? "SEK" : currentDay.country === "Denmark" ? "DKK" : "EUR") },
    { id: "weather",  label: "Weather",  icon: <Cloud size={20} strokeWidth={1.5} />,         preview: currentDay.city },
    { id: "trivia",   label: "Trivia",   icon: <Lightbulb size={20} strokeWidth={1.5} />,     preview: currentDay.city + " facts" },
    { id: "flight",   label: "Flights",  icon: <Plane size={20} strokeWidth={1.5} />,         preview: "Check status" },
    { id: "train",    label: "Trains",   icon: <Train size={20} strokeWidth={1.5} />,          preview: "Check status" },
  ];

  return (
    <div className="min-h-full bg-[#f8f8f8]">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 bg-white border-b border-gray-100">
        <h1 className="text-xl font-medium text-gray-900">Explore</h1>
        <p className="text-xs text-gray-400 mt-0.5">{currentDay.city} · {currentDay.dateLabel}</p>
      </div>

      {/* Trivia banner */}
      <div className="mx-4 mt-4 rounded-2xl p-4 flex gap-3" style={{ backgroundColor: theme.bg }}>
        <span className="text-2xl flex-shrink-0">{trivia.emoji}</span>
        <div>
          <p className="text-[10px] uppercase tracking-wide font-medium mb-1" style={{ color: theme.accentText }}>
            Did you know · {currentDay.city}
          </p>
          <p className="text-[13px] text-gray-700 leading-relaxed">{trivia.fact}</p>
        </div>
      </div>

      {/* Tool grid */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-2.5">
        {tools.map((tool) => {
          const active = activeTool === tool.id;
          return (
            <button key={tool.id}
              onClick={() => setActiveTool(active ? null : tool.id)}
              className={`rounded-2xl p-4 text-left border transition-all active:scale-[0.98] ${
                active ? "bg-gray-900 border-gray-900" : "bg-white border-gray-100 shadow-sm"
              }`}>
              <div className={active ? "text-white/70" : "text-gray-400"}>{tool.icon}</div>
              <p className={`text-[14px] font-medium mt-3 ${active ? "text-white" : "text-gray-900"}`}>{tool.label}</p>
              <p className={`text-[12px] mt-0.5 ${active ? "text-white/50" : "text-gray-400"}`}>{tool.preview}</p>
            </button>
          );
        })}
      </div>

      {/* Expanded tool panel */}
      {activeTool && (
        <div className="mx-4 mt-4 mb-6">
          {activeTool === "phrases" && <PhrasesPanel country={currentDay.country} />}
          {activeTool === "currency" && <CurrencyPanel country={currentDay.country} />}
          {activeTool === "weather"  && <WeatherPanel city={currentDay.city} />}
          {activeTool === "trivia"   && <TriviaPanel city={currentDay.city} trivia={trivia} />}
          {activeTool === "flight"   && <StatusPanel type="flight" />}
          {activeTool === "train"    && <StatusPanel type="train" />}
        </div>
      )}

      <div className="h-6" />
    </div>
  );
}

// ── Phrases flashcard ────────────────────────────────────────────────────────

function PhrasesPanel({ country }: { country: string }) {
  const langMap: Record<string, string> = {
    Sweden: "Swedish", Denmark: "Danish", Netherlands: "Dutch", Belgium: "French",
  };
  const langName = langMap[country] ?? "Swedish";
  const langData = LANGUAGE_PHRASES.find((l) => l.language === langName) ?? LANGUAGE_PHRASES[0];

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const phrase = langData.phrases[idx];

  const prev = () => { setIdx((i) => (i - 1 + langData.phrases.length) % langData.phrases.length); setFlipped(false); };
  const next = () => { setIdx((i) => (i + 1) % langData.phrases.length); setFlipped(false); };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-2 flex items-center gap-2 border-b border-gray-50">
        <span className="text-base">{langData.flag}</span>
        <span className="text-sm font-medium text-gray-900">{langData.language} phrases</span>
        <span className="ml-auto text-xs text-gray-400">{idx + 1} / {langData.phrases.length}</span>
      </div>

      {/* Flashcard */}
      <button
        onClick={() => setFlipped(!flipped)}
        className="w-full p-6 text-center min-h-[140px] flex flex-col items-center justify-center gap-2"
      >
        {!flipped ? (
          <>
            <p className="text-xs text-gray-400 mb-1">English</p>
            <p className="text-2xl font-medium text-gray-900">{phrase.english}</p>
            <p className="text-xs text-gray-400 mt-2">Tap to see translation</p>
          </>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-1">{langData.language}</p>
            <p className="text-2xl font-medium text-gray-900">{phrase.local}</p>
            <p className="text-sm text-gray-400 mt-1">/{phrase.pronunciation}/</p>
          </>
        )}
      </button>

      <div className="flex items-center justify-between px-4 pb-4">
        <button onClick={prev} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center">
          <ChevronLeft size={16} strokeWidth={1.5} className="text-gray-500" />
        </button>
        <button onClick={() => setFlipped(!flipped)} className="flex items-center gap-1.5 text-xs text-gray-400">
          <RotateCcw size={12} strokeWidth={1.5} /> Flip
        </button>
        <button onClick={next} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center">
          <ChevronRight size={16} strokeWidth={1.5} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
}

// ── Currency converter ───────────────────────────────────────────────────────

function CurrencyPanel({ country }: { country: string }) {
  const currencyMap: Record<string, { code: string; symbol: string }> = {
    Sweden:      { code: "SEK", symbol: "kr" },
    Denmark:     { code: "DKK", symbol: "kr" },
    Netherlands: { code: "EUR", symbol: "€" },
    Belgium:     { code: "EUR", symbol: "€" },
  };
  const local = currencyMap[country] ?? { code: "EUR", symbol: "€" };

  // Approximate static rates (INR base) — will be replaced with live API
  const approxRates: Record<string, number> = { SEK: 0.087, DKK: 0.082, EUR: 0.011 };
  const rate = approxRates[local.code] ?? 0.011;

  const [inrAmount, setInrAmount] = useState("1000");
  const [reversed, setReversed] = useState(false);

  const inr = parseFloat(inrAmount) || 0;
  const converted = reversed ? (inr / rate).toFixed(0) : (inr * rate).toFixed(2);

  const fromLabel = reversed ? local.code : "INR";
  const toLabel   = reversed ? "INR" : local.code;
  const fromSymbol = reversed ? local.symbol : "₹";
  const toSymbol   = reversed ? "₹" : local.symbol;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-900">Currency converter</p>
        <span className="text-xs text-gray-400">~approx rates</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{fromLabel}</p>
          <div className="flex items-center gap-1 bg-gray-50 rounded-xl px-3 py-2.5">
            <span className="text-sm text-gray-500">{fromSymbol}</span>
            <input
              type="number"
              value={inrAmount}
              onChange={(e) => setInrAmount(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-900 outline-none w-full"
              inputMode="decimal"
            />
          </div>
        </div>

        <button
          onClick={() => setReversed(!reversed)}
          className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 mt-4"
        >
          <ArrowLeftRight size={14} strokeWidth={1.5} className="text-gray-500" />
        </button>

        <div className="flex-1">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{toLabel}</p>
          <div className="flex items-center gap-1 bg-gray-50 rounded-xl px-3 py-2.5">
            <span className="text-sm text-gray-500">{toSymbol}</span>
            <span className="text-sm text-gray-900">{converted}</span>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-gray-300 mt-3 text-center">
        1 {local.code} ≈ ₹{(1 / rate).toFixed(1)} · Connect to internet for live rates
      </p>
    </div>
  );
}

// ── Weather placeholder ──────────────────────────────────────────────────────

function WeatherPanel({ city }: { city: string }) {
  const days = [
    { label: "Today", emoji: "⛅", high: 22, low: 14 },
    { label: "Tomorrow", emoji: "🌤️", high: 24, low: 15 },
    { label: "Wed", emoji: "🌧️", high: 18, low: 12 },
    { label: "Thu", emoji: "☀️", high: 26, low: 16 },
    { label: "Fri", emoji: "⛅", high: 21, low: 13 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <p className="text-sm font-medium text-gray-900 mb-1">{city}</p>
      <p className="text-xs text-gray-400 mb-4">5-day forecast · Add API key to enable live data</p>
      <div className="flex gap-2">
        {days.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] text-gray-400">{d.label}</span>
            <span className="text-xl">{d.emoji}</span>
            <span className="text-xs font-medium text-gray-700">{d.high}°</span>
            <span className="text-[10px] text-gray-400">{d.low}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Trivia expanded ──────────────────────────────────────────────────────────

function TriviaPanel({ city, trivia }: { city: string; trivia: { fact: string; emoji: string } }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <p className="text-sm font-medium text-gray-900 mb-3">About {city}</p>
      <div className="flex gap-3">
        <span className="text-3xl">{trivia.emoji}</span>
        <p className="text-sm text-gray-600 leading-relaxed">{trivia.fact}</p>
      </div>
    </div>
  );
}

// ── Flight / Train status ────────────────────────────────────────────────────

function StatusPanel({ type }: { type: "flight" | "train" }) {
  const [ref, setRef] = useState("");
  const isF = type === "flight";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <p className="text-sm font-medium text-gray-900 mb-3">
        {isF ? "Flight status" : "Train status"}
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={ref}
          onChange={(e) => setRef(e.target.value.toUpperCase())}
          placeholder={isF ? "e.g. LH761 or 9XUWK9" : "e.g. W5UNRLKY"}
          className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-300 outline-none"
        />
        <button className="px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium">
          Check
        </button>
      </div>
      <p className="text-[11px] text-gray-300 mt-3">
        {isF
          ? "Lufthansa: 9XUWK9 · Norwegian: XVDUPJ · SAS: YJI224"
          : "Thalys/Eurostar: W5UNRLKY"}
      </p>
    </div>
  );
}
