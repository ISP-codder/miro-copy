import { type Point, resolveRelativePoint } from "../../domain/point";
import {
  createRectFromDimensions,
  createRectFromPoints,
  isRectsIntersecting,
  type Rect,
} from "../../domain/rect";
import { pointOnScreenToCanvas } from "../../domain/screen-to-canvas";
import { selectItems } from "../../domain/selection";
import { createRelativeBase } from "../decorator/resolve-relative";
import type { ViewModelParams } from "../view-model-params";
import type { ViewModel } from "../view-model-type";
import { goToIdle } from "./idle";

export type SelectionWindowViewState = {
  type: "selection-window";
  startPoint: Point;
  endPoint: Point;
  initialSelectedIds: Set<string>;
};

export function useSelectionWindowViewModel({
  nodesModel,
  setViewState,
  canvasRect,
  nodesDimensions,
  windowPositionModel,
}: ViewModelParams) {
  const getNodes = (state: SelectionWindowViewState, selectionRect: Rect) => {
    const relativeBase = createRelativeBase(nodesModel.nodes);

    return nodesModel.nodes.map((node) => {
      const nodeDimensions = nodesDimensions[node.id];
      let nodeRect: Rect;
      if (node.type === "sticker") {
        nodeRect = createRectFromDimensions(node, nodeDimensions);
      } else if (node.type === "arrow") {
        nodeRect = createRectFromPoints(
          resolveRelativePoint(relativeBase, node.start),
          resolveRelativePoint(relativeBase, node.end),
        );
      } else if (node.type === "drawing") {
        // For drawing nodes, create a minimal rect around the points
        if (node.points.length === 0) {
          nodeRect = { x: 0, y: 0, width: 0, height: 0 };
        } else {
          const minX = Math.min(...node.points.map((p) => p.x));
          const minY = Math.min(...node.points.map((p) => p.y));
          const maxX = Math.max(...node.points.map((p) => p.x));
          const maxY = Math.max(...node.points.map((p) => p.y));
          nodeRect = {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
          };
        }
      } else {
        nodeRect = { x: 0, y: 0, width: 0, height: 0 };
      }

      return {
        ...node,
        isSelected:
          isRectsIntersecting(nodeRect, selectionRect) ||
          state.initialSelectedIds.has(node.id),
      };
    });
  };

  return (state: SelectionWindowViewState): ViewModel => {
    const rect = createRectFromPoints(state.startPoint, state.endPoint);
    const nodes = getNodes(state, rect);

    return {
      selectionWindow: rect,
      nodes,
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
          const nodesIdsInRect = nodes
            .filter((node) => node.isSelected)
            .map((node) => node.id);

          setViewState(
            goToIdle({
              selectedIds: selectItems(
                state.initialSelectedIds,
                nodesIdsInRect,
                "add",
              ),
            }),
          );
        },
      },
    };
  };
}

export function goToSelectionWindow({
  endPoint,
  startPoint,
  initialSelectedIds,
}: {
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  initialSelectedIds?: Set<string>;
}): SelectionWindowViewState {
  return {
    type: "selection-window",
    startPoint,
    endPoint,
    initialSelectedIds: initialSelectedIds ?? new Set(),
  };
}
