import { type Point } from "../../domain/point";
import { pointOnScreenToCanvas } from "../../domain/screen-to-canvas";
import type { ViewModelParams } from "../view-model-params";
import type { ViewModel } from "../view-model-type";
import { goToIdle } from "./idle";

export type DrawViewState = {
  type: "draw";
  points: Point[];
  isDrawing: boolean;
};

export function useDrawViewModel({
  nodesModel,
  setViewState,
  windowPositionModel,
  canvasRect,
}: ViewModelParams) {
  const addDrawing = (state: DrawViewState) => {
    if (state.points.length > 1) {
      const result = nodesModel.addDrawing({ points: state.points });
    } else {
    }
  };

  return (state: DrawViewState): ViewModel => {
    const newDrawing = {
      id: "drawing-preview",
      type: "drawing" as const,
      points: state.points,
      noPointerEvents: true,
    };

    const newNodes = [...nodesModel.nodes, newDrawing];

    return {
      nodes: newNodes,
      layout: {
        onKeyDown: (e) => {
          if (e.key === "Escape") {
            setViewState(goToIdle());
          }
        },
      },
      overlay: {
        onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => {
          if (e.button === 2) {
            setViewState(goToIdle());
            return;
          }
          if (e.button !== 0) {
            return;
          }
          const startPoint = pointOnScreenToCanvas(
            { x: e.clientX, y: e.clientY },
            windowPositionModel.position,
            canvasRect,
          );

          setViewState({
            type: "draw",
            points: [startPoint],
            isDrawing: true,
          });
        },
        onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => {
          if (state.isDrawing) {
            const currentPoint = pointOnScreenToCanvas(
              { x: e.clientX, y: e.clientY },
              windowPositionModel.position,
              canvasRect,
            );

            setViewState({
              ...state,
              points: [...state.points, currentPoint],
            });
          }
        },
        onMouseUp: () => {
          if (state.isDrawing) {
            addDrawing(state);
            setViewState({
              type: "draw",
              points: [],
              isDrawing: false,
            });
          }
        },
      },
      window: {
        onMouseMove: (e) => {
          if (state.isDrawing) {
            const currentPoint = pointOnScreenToCanvas(
              { x: e.clientX, y: e.clientY },
              windowPositionModel.position,
              canvasRect,
            );
            setViewState({
              ...state,
              points: [...state.points, currentPoint],
            });
          }
        },
        onMouseUp: () => {
          if (state.isDrawing) {
            addDrawing(state);
            setViewState({
              type: "draw",
              points: [],
              isDrawing: false,
            });
          }
        },
      },
      actions: {
        draw: {
          isActive: true,
        },
      },
    };
  };
}

export function goToDraw(): DrawViewState {
  return {
    type: "draw",
    points: [],
    isDrawing: false,
  };
}
