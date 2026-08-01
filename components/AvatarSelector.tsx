"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { UserTypes } from "@/types";

export const PRESET_AVATARS: {
  id: UserTypes["avatar"];
  label: string;
  imageUrl: string;
}[] = [
  { id: "openBook", label: "Open Book", imageUrl: "/assets/book.png" },
  { id: "readingLamp", label: "Reading Lamp", imageUrl: "/assets/library.png" },
  { id: "owl", label: "Wise Owl", imageUrl: "/assets/owl.png" },
  { id: "bookMark", label: "Bookmark", imageUrl: "/assets/book-mark.png" },
];

interface AvatarSelectorProps {
  selectedAvatar: UserTypes["avatar"];
  onSelect: (avatar: UserTypes["avatar"]) => void;
  label?: string;
}

export function AvatarSelector({
  selectedAvatar,
  onSelect,
  label,
}: AvatarSelectorProps) {
  return (
    <div>
      {label && (
        <label className="block mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text-main)]/45">
          {label}
        </label>
      )}

      <input type="hidden" name="avatar" value={selectedAvatar} />

      <div className="flex items-center gap-4">
        {PRESET_AVATARS.map(({ id, label: avatarLabel, imageUrl }) => {
          const isSelected = selectedAvatar === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              title={avatarLabel}
              className={`relative w-16 h-16 rounded-full border-2 overflow-hidden transition-all duration-200 outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-card)] ${
                isSelected
                  ? "border-[var(--accent)] scale-105 shadow-md"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={imageUrl}
                alt={avatarLabel}
                fill
                sizes="64px"
                className="object-cover"
              />

              {isSelected && (
                <span className="absolute -bottom-0.5 -right-0.5 bg-[var(--accent)] text-white p-0.5 rounded-full ring-2 ring-[var(--bg-card)] z-10">
                  <Check className="w-2.5 h-2.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}