import clsx from "clsx";
import React, { type Ref } from "react";

export function Sticker({
  id,
  text,
  x,
  y,
  onClick,
  ref,
  isSelected,
  isEditing,
  onTextChange,
}: {
  id: string;
  ref: Ref<HTMLButtonElement>;
  text: string;
  x: number;
  y: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isSelected?: boolean;
  isEditing?: boolean;
  onTextChange?: (text: string) => void;
}) {
  return (
    <button
      data-id={id}
      ref={ref}
      className={clsx(
        "absolute bg-yellow-300 px-2 py-4 rounded-xs shadow-md",
        isSelected && "outline outline-2 outline-blue-500",
      )}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      onClick={onClick}
    >
      {isEditing ? (
        <input
          value={text}
          className="w-full h-full"
          autoFocus
          onChange={(e) => onTextChange?.(e.target.value)}
        />
      ) : (
        text
      )}
    </button>
  );
}
