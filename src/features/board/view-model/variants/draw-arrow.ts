import { diffPoints, type Point } from "../../domain/point";
import { pointOnScreenToCanvas } from "../../domain/screen-to-canvas";
import { createRelativeBase } from "../decorator/resolve-relative";
import type { ViewModelParams } from "../view-model-params";
import type { ViewModel } from "../view-model-type";
import { goToIdle } from "./idle";

export type DrawArrowViewState = {
  type: "draw-arrow";
  startPoint: Point;
  endPoint: Point;
  startRelativeTo?: string;
  endRelativeTo?: string;
};

export function useDrawArrowViewModel({
  nodesModel,
  setViewState,
  windowPositionModel,
  canvasRect,
}: ViewModelParams) {
  const addArrow = (state: DrawArrowViewState, endRelativeTo?: string) => {
    const relativeBase = createRelativeBase(nodesModel.nodes);

    const newArrow = {
      start: state.startRelativeTo
        ? {
            ...diffPoints(
              relativeBase[state.startRelativeTo],
              state.startPoint,
            ),
            relativeTo: state.startRelativeTo,
          }
        : state.startPoint,
      end: endRelativeTo
        ? {
            ...diffPoints(relativeBase[endRelativeTo], state.endPoint),
            relativeTo: endRelativeTo,
          }
        : state.endPoint,
    };
    nodesModel.addArrow(newArrow);
  };

  return (state: DrawArrowViewState): ViewModel => {
    const newArrow = {
      id: "drawing-arrow",
      type: "arrow" as const,
      start: state.startPoint,
      end: state.endPoint,
      noPointerEvents: true,
    };

    const newNodes = [...nodesModel.nodes, newArrow];

    return {
      nodes: newNodes.map((node) => {
        if (node.type === "sticker") {
          return {
            ...node,
            onMouseUp: () => {
              addArrow(state, node.id);
            },
          };
        }
        return node;
      }),
      layout: {
        onKeyDown: (e) => {
          if (e.key === "Escape") {
            setViewState(goToIdle());
          }
        },
      },
      overlay: {
        onMouseUp: () => {
          console.log("onMouseUp");
          addArrow(state);
        },
      },
      window: {
        onMouseMove: (e) => {
          const currentPoint = pointOnScreenToCanvas(
            {
              x: e.clientX,
              y: e.clientY,
            },
            windowPositionModel.position,
            canvasRect,
          );
          setViewState({
            ...state,
            endPoint: currentPoint,
          });
        },
        onMouseUp: () => {
          setViewState(goToIdle());
        },
      },
      actions: {
        addArrow: {
          isActive: true,
        },
      },
    };
  };
}

export function goToDrawArrow(
  startPoint: Point,
  startRelativeTo?: string,
): DrawArrowViewState {
  return {
    type: "draw-arrow",
    startPoint,
    endPoint: startPoint,
    startRelativeTo,
  };
}
