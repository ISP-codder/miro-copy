import { pointOnScreenToCanvas } from "@/features/board/domain/screen-to-canvas";
import type { IdleViewState } from ".";
import type { ViewModelParams } from "../../view-model-params";

export function useMouseDown({ setViewState, canvasRect }: ViewModelParams) {
  const handleOverlayMouseDown = (
    idleState: IdleViewState,
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    const point = pointOnScreenToCanvas(
      {
        x: e.clientX,
        y: e.clientY,
      },
      canvasRect,
    );
    setViewState({
      ...idleState,
      mouseDown: {
        type: "overlay",
        x: point.x,
        y: point.y,
      },
    });
  };

  const handleNodeMouseDown = (
    idleState: IdleViewState,
    nodeId: string,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const point = pointOnScreenToCanvas(
      {
        x: e.clientX,
        y: e.clientY,
      },
      canvasRect,
    );
    setViewState({
      ...idleState,
      mouseDown: {
        type: "node",
        x: point.x,
        y: point.y,
        nodeId,
      },
    });
  };

  const getIsStickerMouseDown = (idleState: IdleViewState, nodeId: string) => {
    return (
      idleState.mouseDown?.type === "node" &&
      idleState.mouseDown.nodeId === nodeId
    );
  };

  const handleWindowMouseUp = (idleState: IdleViewState) => {
    if (idleState.mouseDown) {
      setViewState({
        ...idleState,
        mouseDown: undefined,
      });
    }
  };

  return {
    handleOverlayMouseDown,
    handleNodeMouseDown,
    handleWindowMouseUp,
    getIsStickerMouseDown,
  };
}
