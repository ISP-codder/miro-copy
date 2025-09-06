import {
  type AddStickerViewState,
  useAddStickerViewModel,
} from "./variants/add-sticker";
import {
  goToIdle,
  type IdleViewState,
  useIdleViewModel,
} from "./variants/idle";
import type { ViewModel } from "./view-model-type";
import type { ViewModelParams } from "./view-model-params";
import { useState } from "react";
import {
  type SelectionWindowViewState,
  useSelectionWindowViewModel,
} from "./variants/selection-window";
import {
  type EditStickerViewState,
  useEditStickerViewModel,
} from "./variants/edit-sticker";
import {
  type NodesDraggingViewState,
  useNodesDraggingViewModel,
} from "./variants/nodes-dragging";
import { useZoomDecorator } from "./decorator/zoom";
import {
  useWindowDraggingViewModel,
  type WindowDraggingViewState,
} from "./variants/window-dragging";

export type ViewState =
  | AddStickerViewState
  | EditStickerViewState
  | IdleViewState
  | SelectionWindowViewState
  | NodesDraggingViewState
  | WindowDraggingViewState;

export function useViewModel(params: Omit<ViewModelParams, "setViewState">) {
  const [viewState, setViewState] = useState<ViewState>(() => goToIdle());

  const newParams = {
    ...params,
    setViewState,
  };

  const addStickerViewModel = useAddStickerViewModel(newParams);
  const editStickerViewModel = useEditStickerViewModel(newParams);
  const idleViewModel = useIdleViewModel(newParams);
  const selectionWindowViewModel = useSelectionWindowViewModel(newParams);
  const nodesDraggingViewModel = useNodesDraggingViewModel(newParams);
  const windowDraggingViewModel = useWindowDraggingViewModel(newParams);

  const zoomDecorator = useZoomDecorator(newParams);
  let viewModel: ViewModel;
  switch (viewState.type) {
    case "add-sticker":
      viewModel = addStickerViewModel();
      break;
    case "edit-sticker": {
      viewModel = editStickerViewModel(viewState);
      break;
    }
    case "idle": {
      viewModel = idleViewModel(viewState);
      break;
    }
    case "selection-window": {
      viewModel = selectionWindowViewModel(viewState);
      break;
    }
    case "nodes-dragging": {
      console.log("nodes-dragging", viewState);
      viewModel = nodesDraggingViewModel(viewState);
      break;
    }
    case "window-dragging": {
      viewModel = windowDraggingViewModel(viewState);
      break;
    }
    default:
      throw new Error("Invalid view state");
  }

  return zoomDecorator(viewModel);
}
