import React, { createContext, useContext, useEffect, useState } from "react";
import { AttemptTest, Test } from "@/types/test";
import { getAllTests } from "@/services/testService";

interface TestContextType {
  tests: Test[];
  currentTest: Test | null;
  setTests: (test: Test[]) => void;
  setCurrentTest: (test: Test) => void;
  fetchTests: () => void;
  attemptId: string | null;
  setAttemptId: (id: string | null) => void;
  moduleIds: string[];
  attemptTestData: AttemptTest | null;
  setAttemptTestData: (test: AttemptTest | null) => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tests, setTests] = useState<Test[]>([]); 
  const [attemptId, setAttemptId] = useState < string | null>(null); 
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const [attemptTestData, setAttemptTestData] = useState<AttemptTest | null>(null);
  const [moduleIds, setModuleIds] = useState<string[]>([]);

  const fetchTests = async () => {
    if (tests.length === 0) {
      try {
        const data = await getAllTests();
        setTests(data.result.data);
      } catch (error) {
        console.error("Failed to fetch tests", error);
      }
    }
  };

  useEffect(() => {
    const getModuleIds = (): string[] => {
      if (currentTest) {
        return currentTest.modules.map((module) => module._id);
      }
      return [];
    };

    const ids = getModuleIds();
    setModuleIds(ids);
  }, [currentTest])


  return (
    <TestContext.Provider
      value={{
        tests,
        currentTest,
        setTests,
        setCurrentTest,
        fetchTests,
        attemptId,
        setAttemptId,
        moduleIds,
        attemptTestData, 
        setAttemptTestData
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

export const useTestContext = (): TestContextType => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error("useTestContext must be used within a TestProvider");
  }
  return context;
};
