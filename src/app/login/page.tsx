"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FAMILY, login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [pin, setPin]           = useState("");
  const [error, setError]       = useState("");

  const handlePin = (digit: string) => {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    setError("");
    if (next.length === 4) {
      if (login(selected!, next)) {
        router.replace("/today");
      } else {
        setError("Wrong PIN — try again");
        setTimeout(() => setPin(""), 600);
      }
    }
  };

  const handleBack = () => {
    setPin((p) => p.slice(0, -1));
    setError("");
  };

  if (!selected) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 gap-8">
        <div className="text-center">
          <p className="text-4xl mb-3">✈️</p>
          <h1 className="text-xl font-medium text-gray-900">Europa Trip</h1>
          <p className="text-xs text-gray-400 mt-1">Jul 24 – Aug 14, 2026</p>
        </div>

        <div className="w-full max-w-xs">
          <p className="text-xs text-gray-400 text-center mb-4">Who are you?</p>
          <div className="grid grid-cols-2 gap-3">
            {FAMILY.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelected(m.id)}
                className="flex flex-col items-center gap-2 bg-gray-50 border border-gray-100 rounded-2xl py-5 px-3 hover:border-gray-300 active:bg-gray-100 transition-all"
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-sm font-medium text-gray-800">{m.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const member = FAMILY.find((m) => m.id === selected)!;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 gap-8">
      <div className="text-center">
        <p className="text-4xl mb-2">{member.emoji}</p>
        <h2 className="text-lg font-medium text-gray-900">Hi, {member.name}</h2>
        <p className="text-xs text-gray-400 mt-1">Enter your PIN</p>
      </div>

      {/* PIN dots */}
      <div className="flex gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
              i < pin.length ? "bg-gray-900 scale-110" : "bg-gray-200"
            } ${error ? "bg-red-400" : ""}`}
          />
        ))}
      </div>

      {error && <p className="text-xs text-red-500 -mt-4">{error}</p>}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
        {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((key) => (
          <button
            key={key}
            onClick={() => key === "⌫" ? handleBack() : key !== "" ? handlePin(key) : undefined}
            disabled={key === ""}
            className={`h-14 rounded-2xl text-lg font-medium transition-all active:scale-95 ${
              key === "" ? "invisible" :
              key === "⌫" ? "bg-gray-100 text-gray-500" :
              "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      <button onClick={() => { setSelected(null); setPin(""); setError(""); }}
        className="text-xs text-gray-400">
        ← Back
      </button>
    </div>
  );
}
