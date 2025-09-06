import { useState, useEffect } from "react";

const TUTORIAL_SHOWN_KEY = "miro-tutorial-shown";

export function useTutorial() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Проверяем, показывали ли уже обучение
    const tutorialShown = localStorage.getItem(TUTORIAL_SHOWN_KEY);
    if (!tutorialShown) {
      setShowTutorial(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleClose = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setShowTutorial(false);
    localStorage.setItem(TUTORIAL_SHOWN_KEY, "true");
  };

  const resetTutorial = () => {
    localStorage.removeItem(TUTORIAL_SHOWN_KEY);
    setShowTutorial(true);
    setCurrentStep(0);
  };

  return {
    showTutorial,
    currentStep,
    handleNext,
    handleSkip,
    handleClose,
    resetTutorial,
  };
}

export const tutorialSteps = [
  {
    title: "Добро пожаловать на доску Miro!",
    content:
      'Здесь вы можете создавать стикеры, стрелки и рисунки.\n\nНажмите "Далее" чтобы узнать больше о возможностях.',
  },
  {
    title: "Создание стикеров",
    content:
      '• Нажмите кнопку "Стикер" или клавишу "S"\n• Кликните на доске чтобы разместить стикер\n• Дважды кликните на стикер чтобы редактировать текст',
    highlightElement: '[data-tutorial="sticker-button"]',
    position: "right" as const,
  },
  {
    title: "Рисование линий",
    content:
      '• Нажмите кнопку "Карандаш" или клавишу "D"\n• Зажмите левую кнопку мыши и рисуйте\n• Отпустите кнопку чтобы завершить рисунок\n• Правой кнопкой мыши можно отменить рисование',
    highlightElement: '[data-tutorial="draw-button"]',
    position: "right" as const,
  },
  {
    title: "Создание стрелок",
    content:
      '• Нажмите кнопку "Стрелка" или клавишу "A"\n• Кликните и протяните чтобы создать стрелку\n• Стрелки можно привязывать к стикерам',
    highlightElement: '[data-tutorial="arrow-button"]',
    position: "right" as const,
  },
  {
    title: "Перемещение объектов",
    content:
      "• Кликните на любой объект чтобы выделить его\n• Зажмите и перемещайте чтобы двигать объект\n• Можно перемещать несколько объектов одновременно\n• Для отмены используйте клавишу Escape",
  },
];
