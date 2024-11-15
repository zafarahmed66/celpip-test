import { ListeningTest } from "./listening";
import { ReadingTest } from "./reading";
import { SpeakingTest } from "./speaking";
import { WritingTest } from "./writing";

export interface Page {
  _id: string;
}

export interface Module {
  _id: string;
  type: string;
  pages: string[];
  testId: string;
}

type Instruction = { text: string } | { audio: string } | { video : string};


export interface Test {
  _id: string;
  title: string;
  description: string;
  modules: Module[];
  instructions: Instruction[];
  createdAt: string;
  updatedAt: string;
}

export interface AttemptTest {
  _id: string;
  modules: [
    ReadingTest,
    WritingTest,
    SpeakingTest,
    ListeningTest
  ]
}