import React from "react";
import { Button } from "@/shared/ui/kit/button";

interface TutorialButtonProps {
  onShowTutorial: () => void;
}

export const TutorialButton: React.FC<TutorialButtonProps> = ({
  onShowTutorial,
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onShowTutorial}
      className="absolute bottom-4 right-4 z-40"
    >
      Показать обучение
    </Button>
  );
};
