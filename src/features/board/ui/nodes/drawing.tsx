import React from "react";
import type { ViewModelDrawingNode } from "../../view-model/view-model-type";

interface DrawingProps extends ViewModelDrawingNode {
  ref?: React.Ref<SVGPathElement>;
  noPointerEvents?: boolean;
}

export const Drawing = React.forwardRef<SVGPathElement, DrawingProps>(
  (
    { points, isSelected, onClick, onMouseDown, onMouseUp, noPointerEvents },
    ref,
  ) => {
    if (points.length < 2) {
      return null;
    }

    const pathData = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");

    return (
      <svg className="absolute left-0 top-0 pointer-events-none overflow-visible">
        <path
          ref={ref}
          d={pathData}
          fill="none"
          stroke={isSelected ? "#3b82f6" : "#000000"}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          onClick={onClick}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          style={{
            cursor: "pointer",
            pointerEvents: noPointerEvents ? "none" : "auto",
          }}
        />
      </svg>
    );
  },
);

Drawing.displayName = "Drawing";
