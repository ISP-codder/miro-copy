import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/shared/ui/kit/button";
import { Card } from "@/shared/ui/kit/card";

interface TutorialStep {
  title: string;
  content: React.ReactNode;
  highlightElement?: string;
  position?: "top" | "bottom" | "left" | "right";
}

interface TutorialProps {
  steps: TutorialStep[];
  currentStep: number;
  onNext: () => void;
  onSkip: () => void;
  onClose: () => void;
  showTutorial: boolean;
}

export const AdvancedTutorial: React.FC<TutorialProps> = ({
  steps,
  currentStep,
  onNext,
  onSkip,
  onClose,
  showTutorial,
}) => {
  const [highlightPosition, setHighlightPosition] = useState<DOMRect | null>(
    null,
  );
  const tutorialRef = useRef<HTMLDivElement>(null);

  if (!showTutorial || currentStep >= steps.length) {
    return null;
  }

  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (currentStepData.highlightElement) {
      const element = document.querySelector(currentStepData.highlightElement);
      if (element) {
        const rect = element.getBoundingClientRect();
        setHighlightPosition(rect);
      }
    } else {
      setHighlightPosition(null);
    }
  }, [currentStep, currentStepData.highlightElement]);

  const getArrowStyle = () => {
    if (!highlightPosition || !tutorialRef.current) return {};

    const position = currentStepData.position || "top";

    switch (position) {
      case "top":
        return {
          top: highlightPosition.top - 20,
          left: highlightPosition.left + highlightPosition.width / 2 - 10,
          transform: "rotate(180deg)",
        };
      case "bottom":
        return {
          top: highlightPosition.bottom + 20,
          left: highlightPosition.left + highlightPosition.width / 2 - 10,
        };
      case "left":
        return {
          top: highlightPosition.top + highlightPosition.height / 2 - 10,
          left: highlightPosition.left - 20,
          transform: "rotate(90deg)",
        };
      case "right":
        return {
          top: highlightPosition.top + highlightPosition.height / 2 - 10,
          left: highlightPosition.right + 20,
          transform: "rotate(-90deg)",
        };
      default:
        return {};
    }
  };

  return (
    <>
      {highlightPosition && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30">
            <div
              className="absolute rounded-lg border-2 border-yellow-400 bg-yellow-200/20 shadow-lg"
              style={{
                top: highlightPosition.top - 4,
                left: highlightPosition.left - 4,
                width: highlightPosition.width + 8,
                height: highlightPosition.height + 8,
              }}
            />
          </div>

          <div
            className="absolute z-50 text-2xl text-yellow-400"
            style={getArrowStyle()}
          >
            ➤
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <Card ref={tutorialRef} className="relative mx-4 max-w-md p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">
              {currentStepData.title}
            </h2>
            <div className="mt-2 whitespace-pre-line text-gray-200">
              {currentStepData.content}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
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
              className="text-gray-400 hover:text-white"
              aria-label="Закрыть обучение"
            >
              ✕
            </button>
          </div>
        </Card>
      </div>
    </>
  );
};
