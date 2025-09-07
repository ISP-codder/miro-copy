import { Button } from "@/shared/ui/kit/button";
import React from "react";

interface ActionButtonProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  hotkey?: string;
  showHotkey?: boolean;
}

export function ActionButton({
  children,
  isActive,
  onClick,
  hotkey,
  showHotkey = true,
}: ActionButtonProps) {
  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="icon"
        className={
          isActive
            ? "bg-blue-500/30 hover:bg-blue-600/30 text-blue-500 hover:text-blue-600"
            : ""
        }
        onClick={onClick}
      >
        {children}
      </Button>

      {showHotkey && hotkey && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
            {hotkey.toUpperCase()}
          </div>
        </div>
      )}
    </div>
  );
}
