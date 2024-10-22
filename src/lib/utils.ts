import { ListeningTest, Question } from "@/types/listening";
import { ReadingTest, Question as ReadingQuestion } from "@/types/reading";
import { Test } from "@/types/test";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function countQuestionsBySectionTitle(
  test: ListeningTest,
  title: string
): number {
  let totalQuestions = 0;

  test.pages.forEach((section) => {
    if (section.title === title && section.questionSets) {
      totalQuestions += 1;
    }
  });

  return totalQuestions;
}

export function getQuestionIndex(
  test: ListeningTest,
  sectionTitle: string,
  audioUrl: string
): number | null {
  let currentIndex = 0;
  for (const section of test.pages) {
    if (section.questionSets && section.title === sectionTitle) {
      currentIndex++;
      if (section.questionSets[0].questions[0].text === audioUrl) {
        return currentIndex;
      }
    }
  }

  return null;
}

export function flattenListeningTest(test: ListeningTest) {
  const flatQuestions: {
    title: string;
    question: Question;
  }[] = [];

  test.pages.forEach((section) => {
    section.questionSets?.forEach((questionSet) => {
      questionSet.questions.forEach((question) => {
        flatQuestions.push({ title: section.title, question });
      });
    });
  });

  return flatQuestions;
}

export function flattenReadingTest(test: ReadingTest) {
  const flatQuestions: {
    title: string;
    question: ReadingQuestion;
  }[] = [];

  test.pages.forEach((section) => {
    section.questionSets?.forEach((questionSet) => {
      questionSet.questions.forEach((question) => {
        flatQuestions.push({ title: section.title, question });
      });
    });
  });

  return flatQuestions;
}

export function getFlattenedQuestionIndexListening(
  test: ListeningTest,
  sectionTitle: string,
  audioUrl: string
): number | null {
  const flatQuestions = flattenListeningTest(test);
  let ansIndex = null;
  flatQuestions.forEach((question, index) => {
    if (
      question.title === sectionTitle &&
      question.question.text === audioUrl
    ) {
      ansIndex = index;
      return;
    }
  });
  return ansIndex;
}

export function getFlattenedQuestionIndexReading(
  test: ReadingTest,
  questionText: string
): number | null {
  const flatQuestions = flattenReadingTest(test);
  let ansIndex = null;
  flatQuestions.forEach((question, index) => {
    if (question.question.text === questionText) {
      ansIndex = index;
      return;
    }
  });
  return ansIndex;
}

export function getActualQuestionIndexListening(
  test: ListeningTest,
  sectionTitle: string
): number | null {
  let currentIndex = 0;
  for (const section of test.pages) {
    currentIndex++;
    if (section.questionSets && section.title === sectionTitle) {
      return currentIndex - 1;
    }
  }

  return null;
}

export function getActualQuestionIndexReading(
  test: ReadingTest,
  sectionTitle: string
): number | null {
  let currentIndex = 0;
  for (const section of test.pages) {
    currentIndex++;
    if (section.questionSets && section.title === sectionTitle) {
      return currentIndex;
    }
  }

  return null;
}


export function getNextModule(type: string, currentTest: Test) : string {
  let nextModule = "/";
  const currentModule = currentTest.modules.findIndex(module => module.type.toLowerCase() === type);
  if (currentModule >= 0 && currentModule <= currentTest.modules.length - 2) {
    nextModule = currentTest.modules[currentModule + 1].type.toLowerCase();
  }

  return nextModule;
}
