import type { ViewModelParams } from "../view-model-params";
import type { ViewModel } from "../view-model-type";
import { goToAddSticker } from "../variants/add-sticker";
import { goToAddArrow } from "../variants/add-arrow";
import { goToDraw } from "../variants/draw";
import { goToIdle } from "../variants/idle";

export function useCommonActionsDecorator({ setViewState }: ViewModelParams) {
  return (viewModel: ViewModel): ViewModel => {
    // Проверяем, находимся ли мы уже в режиме рисования
    const isInDrawMode = viewModel.actions?.draw?.isActive === true;

    return {
      ...viewModel,
      layout: {
        ...viewModel.layout,
        onKeyDown: (e) => {
          viewModel.layout?.onKeyDown?.(e);
          if (e.key === "s") {
            setViewState(goToAddSticker());
          }
          if (e.key === "a") {
            setViewState(goToAddArrow());
          }
          if (e.key === "d") {
            if (isInDrawMode) {
              setViewState(goToIdle());
            } else {
              setViewState(goToDraw());
            }
          }
        },
      },
      actions: {
        addArrow: {
          isActive: false,
          onClick: () => setViewState(goToAddArrow()),
        },
        addSticker: {
          isActive: false,
          onClick: () => setViewState(goToAddSticker()),
        },
        draw: {
          isActive: isInDrawMode,
          onClick: () => {
            // Если уже в режиме рисования - выходим, иначе входим
            if (isInDrawMode) {
              setViewState(goToIdle());
            } else {
              setViewState(goToDraw());
            }
          },
        },
        ...viewModel.actions,
      },
    };
  };
}
