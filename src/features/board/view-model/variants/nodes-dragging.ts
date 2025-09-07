import {
  addPoints,
  isRelativePoint,
  type Point,
  diffPoints,
} from "../../domain/point";
import { pointOnScreenToCanvas } from "../../domain/screen-to-canvas";

import type { ViewModelParams } from "../view-model-params";
import type { ViewModel } from "../view-model-type";
import { goToIdle } from "./idle";

export type NodesDraggingViewState = {
  type: "nodes-dragging";
  startPoint: Point;
  endPoint: Point;
  nodesToMove: Set<string>;
};

export function useNodesDraggingViewModel({
  nodesModel,
  setViewState,
  canvasRect,
  windowPositionModel,
}: ViewModelParams) {
  const getNodes = (state: NodesDraggingViewState) => {
    return nodesModel.nodes.map((node) => {
      if (state.nodesToMove.has(node.id)) {
        const diff = diffPoints(state.startPoint, state.endPoint);

        if (node.type === "arrow") {
          return {
            ...node,
            start: isRelativePoint(node.start)
              ? node.start
              : addPoints(node.start, diff),
            end: isRelativePoint(node.end)
              ? node.end
              : addPoints(node.end, diff),
            isSelected: true,
          };
        }

        if (node.type === "sticker") {
          return {
            ...node,
            ...addPoints(node, diff),
            isSelected: true,
          };
        }
        if (node.type === "drawing") {
          return {
            ...node,
            points: node.points.map((point) => addPoints(point, diff)),
            isSelected: true,
          };
        }
      }

      return node;
    });
  };
  return (state: NodesDraggingViewState): ViewModel => {
    const nodes = getNodes(state);

    return {
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
          const nodesToMove = nodes
            .filter((node) => state.nodesToMove.has(node.id))
            .flatMap((node) => {
              if (node.type === "arrow") {
                return [
                  {
                    id: node.id,
                    point: node.start,
                    type: "start" as const,
                  },
                  {
                    id: node.id,
                    point: node.end,
                    type: "end" as const,
                  },
                ];
              }

              if (node.type === "sticker") {
                return [
                  {
                    id: node.id,
                    point: {
                      x: node.x,
                      y: node.y,
                    },
                  },
                ];
              }
              if (node.type === "drawing") {
                // For drawings, we need to update all points
                return node.points.map((point, index) => ({
                  id: node.id,
                  point,
                  pointIndex: index,
                }));
              }
              return [];
            });

          nodesModel.updateNodesPositions(nodesToMove);

          setViewState(
            goToIdle({
              selectedIds: state.nodesToMove,
            }),
          );
        },
      },
    };
  };
}

export function goToNodesDragging({
  endPoint,
  startPoint,
  nodesToMove,
}: {
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  nodesToMove: Set<string>;
}): NodesDraggingViewState {
  return {
    type: "nodes-dragging",
    startPoint,
    endPoint,
    nodesToMove,
  };
}
