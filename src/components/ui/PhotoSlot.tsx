"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PhotoSlotProps {
  url?: string | null;
  alt?: string;
  className?: string;
  slotKey: string; // unique key, e.g. "activity-5-0", "hero-5", "stay-stockholm"
  onUpdate?: (url: string) => void;
  editable?: boolean;
  gradient?: string; // fallback CSS gradient
}

export default function PhotoSlot({
  url,
  alt = "",
  className = "",
  slotKey,
  onUpdate,
  editable = true,
  gradient = "linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)",
}: PhotoSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localUrl, setLocalUrl] = useState<string | null>(null);
  const display = localUrl ?? url;

  const handleFile = async (file: File) => {
    setUploading(true);
    // Preview immediately
    const preview = URL.createObjectURL(file);
    setLocalUrl(preview);

    const ext  = file.name.split(".").pop();
    const path = `${slotKey}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("card-photos")
      .upload(path, file, { upsert: true });

    if (!error) {
      const { data } = supabase.storage.from("card-photos").getPublicUrl(path);
      const publicUrl = data.publicUrl;
      setLocalUrl(publicUrl);
      onUpdate?.(publicUrl);

      // Persist to day_cards table
      const dayMatch = slotKey.match(/(\d+)/);
      if (dayMatch) {
        await supabase.from("day_cards").upsert({
          id: slotKey,
          day_number: parseInt(dayMatch[1]),
          type: "photo",
          title: slotKey,
          image_url: publicUrl,
        }, { onConflict: "id" });
      }
    }
    setUploading(false);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {display ? (
        <img src={display} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full" style={{ background: gradient }} />
      )}

      {editable && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          <button
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            {uploading
              ? <Loader2 size={14} className="text-white animate-spin" />
              : <Camera size={14} className="text-white" />
            }
          </button>
        </>
      )}
    </div>
  );
}
