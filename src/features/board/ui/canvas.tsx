import React, { type Ref } from "react";

export function Canvas({
  children,
  ref,
  ...props
}: {
  children: React.ReactNode;
  ref: Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div ref={ref} {...props} className="absolute inset-0 select-none">
      {children}
    </div>
  );
}
