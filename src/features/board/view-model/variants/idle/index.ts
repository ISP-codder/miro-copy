import type { Selection } from "../../../domain/selection";

import type { ViewModelParams } from "../../view-model-params";
import type { ViewModel } from "../../view-model-type";
import { useDeleteSelected } from "./use-delete-selected";
import { useGoToAddSticker } from "./use-go-to-add-sticker";
import { useGoToEditSticker } from "./use-go-to-edit-sticker";
import { useGoToSelectionWindow } from "./use-go-to-selection-window";
import { useMouseDown } from "./use-mouse-down";
import { useSelection } from "./use-selection";

export type IdleViewState = {
  type: "idle";
  selectedIds: Set<string>;
  mouseDown?: {
    x: number;
    y: number;
  };
};

export function useIdleViewModel(params: ViewModelParams) {
  const { nodesModel } = params;

  const deleteSelected = useDeleteSelected(params);
  const goToEditSticker = useGoToEditSticker(params);
  const goToAddSticker = useGoToAddSticker(params);
  const goToSelectionWindow = useGoToSelectionWindow(params);
  const mouseDown = useMouseDown(params);
  const selection = useSelection(params);

  return (idleState: IdleViewState): ViewModel => ({
    nodes: nodesModel.nodes.map((node) => ({
      ...node,
      isSelected: selection.isSelected(idleState, node.id),
      onClick: (e) => {
        const clickResult = goToEditSticker.handleNodeClick(
          idleState,
          node.id,
          e,
        );
        if (clickResult.preventNext) return;
        selection.handleNodeClick(idleState, node.id, e);
      },
    })),
    layout: {
      onKeyDown: (e) => {
        const keyDownResult = goToEditSticker.handleKeyDown(idleState, e);
        if (keyDownResult.preventNext) return;

        deleteSelected.handleKeyDown(idleState, e);
        goToAddSticker.handleKeyDown(e);
      },
    },
    overlay: {
      onMouseDown: (e) => mouseDown.handleOverlayMouseDown(idleState, e),
      onMouseUp: () => selection.handleOverlayMouseUp(idleState),
    },
    window: {
      onMouseMove: (e) =>
        goToSelectionWindow.handleWindowMouseMove(idleState, e),
      onMouseUp: () => mouseDown.handleWindowMouseUp(idleState),
    },
    actions: {
      addSticker: {
        isActive: false,
        onClick: goToAddSticker.handleActionClick,
      },
    },
  });
}

export function goToIdle({
  selectedIds,
}: { selectedIds?: Selection } = {}): IdleViewState {
  return {
    type: "idle",
    selectedIds: selectedIds ?? new Set(),
  };
}
