import type { Dispatch, SetStateAction } from "react";
import type { CanvasRect } from "../hooks/use-canvas-rect";
import type { NodesModel } from "../model/nodes";
import type { ViewState } from "./use-view-model";

export type ViewModelParams = {
  setViewState: Dispatch<SetStateAction<ViewState>>;
  nodesModel: NodesModel;
  canvasRect: CanvasRect | undefined;
};
