import { vectorFromPoints, type Point } from "../../domain/point";

import { pointOnScreenToCanvas } from "../../domain/screen-to-canvas";

import type { ViewModelParams } from "../view-model-params";
import type { ViewModel } from "../view-model-type";
import { goToIdle } from "./idle";

export type WindowDraggingViewState = {
  type: "window-dragging";
  startPoint: Point;
  endPoint: Point;
};

export function useWindowDraggingViewModel({
  nodesModel,
  setViewState,
  canvasRect,
  windowPositionModel,
}: ViewModelParams) {
  return (state: WindowDraggingViewState): ViewModel => {
    const diff = vectorFromPoints(state.startPoint, state.endPoint);
    return {
      nodes: nodesModel.nodes,
      windowPosition: {
        x: windowPositionModel.position.x - diff.x,
        y: windowPositionModel.position.y - diff.y,
        zoom: windowPositionModel.position.zoom,
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
          windowPositionModel.setPosition({
            x: windowPositionModel.position.x - diff.x,
            y: windowPositionModel.position.y - diff.y,
            zoom: windowPositionModel.position.zoom,
          });
          setViewState(goToIdle({}));
        },
      },
    };
  };
}

export function goToWindowDragging({
  endPoint,
  startPoint,
}: {
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
}): WindowDraggingViewState {
  return {
    type: "window-dragging",
    startPoint,
    endPoint,
  };
}
