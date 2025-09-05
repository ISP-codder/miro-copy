import { pointOnScreenToCanvas } from "@/features/board/domain/screen-to-canvas";
import type { IdleViewState } from ".";
import type { ViewModelParams } from "../../view-model-params";
import { distanceFromPoints } from "@/features/board/domain/point";
import { goToNodesDragging } from "../nodes-dragging";

export function useGoToNodesDragging({
  canvasRect,
  setViewState,
}: ViewModelParams) {
  const handleWindowMouseMove = (idleState: IdleViewState, e: MouseEvent) => {
    if (idleState.mouseDown && idleState.mouseDown.type === "node") {
      const currentPoint = pointOnScreenToCanvas(
        {
          x: e.clientX,
          y: e.clientY,
        },
        canvasRect,
      );

      if (distanceFromPoints(idleState.mouseDown, currentPoint) > 5) {
        setViewState(
          goToNodesDragging({
            startPoint: idleState.mouseDown,
            endPoint: currentPoint,
            nodesToMove: new Set([
              ...idleState.selectedIds,
              idleState.mouseDown.nodeId,
            ]),
          }),
        );
      }
    }
  };

  return {
    handleWindowMouseMove,
  };
}
