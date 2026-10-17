export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  college: string;
  targetExam: string;
  semester: string;
  createdAt: string;
  avatarSeed: string;
}

export interface Question {
  id: string;
  moduleId: string;
  topicId: string;
  topicTitle: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: Difficulty;
  formulaUsed?: string;
}

export interface ExamConfig {
  id: string;
  title: string;
  moduleId?: string; // undefined means all syllabus
  difficulty: Difficulty | 'Mixed';
  questionCount: 10 | 20 | 30 | 50 | 70;
  durationMinutes: number;
}

export interface ExamResult {
  id: string;
  examTitle: string;
  timestamp: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattempted: number;
  score: number;
  percentage: number;
  timeTakenSeconds: number;
  totalTimeSeconds: number;
  moduleId?: string;
  userAnswers: {
    questionId: string;
    selectedOption: number | null;
    isCorrect: boolean;
    isMarkedForReview?: boolean;
  }[];
  topicBreakdown: {
    topicTitle: string;
    total: number;
    correct: number;
  }[];
}

export interface NumericalExampleStep {
  stepNumber: number;
  title: string;
  description: string;
  mathExpression?: string;
  tableData?: {
    headers: string[];
    rows: (string | number)[][];
  };
}

export interface NumericalExample {
  title: string;
  problemStatement: string;
  formulation?: string;
  steps: NumericalExampleStep[];
  finalAnswer: string;
  interpretations?: string[];
}

export interface Topic {
  id: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  slug: string;
  subtitle: string;
  readingTimeMinutes: number;
  introduction: string;
  detailedExplanation: string[];
  definitions: { term: string; definition: string }[];
  formulas: { name: string; latex: string; explanation: string }[];
  numericalExamples: NumericalExample[];
  diagramType?: 'graphical_lpp' | 'simplex_flow' | 'transportation_matrix' | 'hungarian_grid' | 'game_payoff';
  realLifeExamples: {
    industry: string;
    caseTitle: string;
    description: string;
    benefit: string;
  }[];
  examQuestions: {
    question: string;
    marks: number;
    hint: string;
  }[];
  practiceQuestionIds: string[];
}

export interface Module {
  id: string;
  title: string;
  shortTitle: string;
  code: string;
  description: string;
  iconName: string;
  color: string;
  topics: Topic[];
}

export interface FormulaItem {
  id: string;
  moduleId: string;
  moduleName: string;
  name: string;
  latex: string;
  symbols: { symbol: string; meaning: string }[];
  example: string;
  tags: string[];
}

export type ActivePage =
  | 'splash'
  | 'dashboard'
  | 'subjects'
  | 'topic-detail'
  | 'solvers'
  | 'practice'
  | 'mock-exam'
  | 'exam-running'
  | 'exam-result'
  | 'progress'
  | 'formulas'
  | 'profile'
  | 'settings'
  | 'game';

export interface AppSettings {
  darkMode: boolean;
  soundEnabled: boolean;
  defaultExamDuration: number;
  autoSubmitOnTimer: boolean;
}
