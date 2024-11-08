/* eslint-disable @typescript-eslint/no-explicit-any */
import { AttemptTest } from "@/types/test";
import { apiClient } from "./apiClient";

export const getAllTests = async () => {
  const res = await apiClient.get("/tests");
  return res.data;
};

export const attemptTest = async (testId: string, moduleIds: string[]) => {
  const body = {
    test: testId,
    modules: moduleIds,
  };
  const { data } = await apiClient.post("/attempts", body);
  return data.result;
};

export const fetchAttempt = async (attemptId: string, type: string, attemptData: AttemptTest | null, setData : (data: AttemptTest) => void ) => {
  let data;
  if (attemptData) {
    data = attemptData;
  } else {
    const res = await apiClient.get(`/attempts/${attemptId}`);
    data = res.data
    setData(data);
  }

  const result = data.result.modules.find((module: any) => module.type === type);
  return result;
};
