import { vectorFromPoints, type Point } from "../../domain/point";
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
  const getNodes = (state: NodesDraggingViewState) =>
    nodesModel.nodes.map((node) => {
      if (state.nodesToMove.has(node.id)) {
        const diff = vectorFromPoints(state.startPoint, state.endPoint);

        return {
          ...node,
          x: node.x + diff.x,
          y: node.y + diff.y,
          isSelected: true,
        };
      }

      return node;
    });

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
          const nodesToMove = nodes.filter((node) =>
            state.nodesToMove.has(node.id),
          );

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
