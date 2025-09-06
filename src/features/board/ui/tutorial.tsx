import React from "react";
import { Button } from "@/shared/ui/kit/button";
import { Card } from "@/shared/ui/kit/card";

interface TutorialStep {
  title: string;
  content: React.ReactNode;
}

interface TutorialProps {
  steps: TutorialStep[];
  currentStep: number;
  onNext: () => void;
  onSkip: () => void;
  onClose: () => void;
  showTutorial: boolean;
}

export const Tutorial: React.FC<TutorialProps> = ({
  steps,
  currentStep,
  onNext,
  onSkip,
  onClose,
  showTutorial,
}) => {
  if (!showTutorial || currentStep >= steps.length) {
    return null;
  }

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <Card className="relative mx-4 max-w-md p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{currentStepData.title}</h2>
          <div className="mt-2 whitespace-pre-line text-gray-600">
            {currentStepData.content}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Шаг {currentStep + 1} из {steps.length}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onSkip}>
              Пропустить
            </Button>
            <Button onClick={onNext}>
              {currentStep === steps.length - 1 ? "Завершить" : "Далее"}
            </Button>
          </div>
        </div>

        <div className="absolute right-4 top-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Закрыть обучение"
          >
            ✕
          </button>
        </div>
      </Card>
    </div>
  );
};
