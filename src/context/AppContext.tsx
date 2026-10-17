import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  ActivePage,
  ExamResult,
  ExamConfig,
  AppSettings,
} from '../types';
import { sounds } from '../utils/audio';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  user: UserProfile | null;
  activePage: ActivePage;
  selectedTopicId: string | null;
  selectedModuleId: string | null;
  activeExamConfig: ExamConfig | null;
  lastExamResult: ExamResult | null;
  completedTopics: string[];
  bookmarkedTopics: string[];
  flaggedQuestionIds: string[];
  examHistory: ExamResult[];
  settings: AppSettings;
  toasts: Toast[];

  // Actions
  setActivePage: (page: ActivePage) => void;
  openTopic: (topicId: string, moduleId?: string) => void;
  startExam: (config: ExamConfig) => void;
  completeExam: (result: ExamResult) => void;
  toggleTopicCompletion: (topicId: string) => void;
  toggleBookmark: (topicId: string) => void;
  toggleFlagQuestion: (questionId: string) => void;
  loginUser: (email: string, name?: string) => void;
  logoutUser: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  resetAllProgress: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
}

const defaultProfile: UserProfile = {
  id: 'student-guest',
  name: 'Alex Johnson',
  email: 'alex.johnson@campus.edu',
  college: 'Institute of Technology & Management',
  targetExam: 'B.Tech / MBA Operations Research',
  semester: 'Semester 5',
  createdAt: new Date().toISOString(),
  avatarSeed: 'alex',
};

const defaultSettings: AppSettings = {
  darkMode: false,
  soundEnabled: true,
  defaultExamDuration: 30,
  autoSubmitOnTimer: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from local storage
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('ormaster_user');
      return saved ? JSON.parse(saved) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [activePage, setActivePageState] = useState<ActivePage>(() => {
    try {
      const hasVisited = localStorage.getItem('ormaster_visited');
      return hasVisited ? 'dashboard' : 'splash';
    } catch {
      return 'splash';
    }
  });

  const [selectedTopicId, setSelectedTopicId] = useState<string | null>('t-1-3');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>('mod-1');
  const [activeExamConfig, setActiveExamConfig] = useState<ExamConfig | null>(null);
  const [lastExamResult, setLastExamResult] = useState<ExamResult | null>(null);

  const [completedTopics, setCompletedTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ormaster_completed_topics');
      return saved ? JSON.parse(saved) : ['t-1-1', 't-1-2'];
    } catch {
      return ['t-1-1', 't-1-2'];
    }
  });

  const [bookmarkedTopics, setBookmarkedTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ormaster_bookmarked_topics');
      return saved ? JSON.parse(saved) : ['t-1-3', 't-2-3'];
    } catch {
      return ['t-1-3', 't-2-3'];
    }
  });

  const [flaggedQuestionIds, setFlaggedQuestionIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ormaster_flagged_questions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [examHistory, setExamHistory] = useState<ExamResult[]>(() => {
    try {
      const saved = localStorage.getItem('ormaster_exam_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('ormaster_settings');
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync settings with HTML class
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    sounds.enabled = settings.soundEnabled;
    try {
      localStorage.setItem('ormaster_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Sync storage
  useEffect(() => {
    try {
      if (user) localStorage.setItem('ormaster_user', JSON.stringify(user));
      else localStorage.removeItem('ormaster_user');
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('ormaster_completed_topics', JSON.stringify(completedTopics));
    } catch {}
  }, [completedTopics]);

  useEffect(() => {
    try {
      localStorage.setItem('ormaster_bookmarked_topics', JSON.stringify(bookmarkedTopics));
    } catch {}
  }, [bookmarkedTopics]);

  useEffect(() => {
    try {
      localStorage.setItem('ormaster_flagged_questions', JSON.stringify(flaggedQuestionIds));
    } catch {}
  }, [flaggedQuestionIds]);

  useEffect(() => {
    try {
      localStorage.setItem('ormaster_exam_history', JSON.stringify(examHistory));
    } catch {}
  }, [examHistory]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev.slice(-3), { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const setActivePage = (page: ActivePage) => {
    sounds.playClick();
    setActivePageState(page);
    try {
      localStorage.setItem('ormaster_visited', 'true');
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openTopic = (topicId: string, moduleId?: string) => {
    setSelectedTopicId(topicId);
    if (moduleId) setSelectedModuleId(moduleId);
    setActivePage('topic-detail');
  };

  const startExam = (config: ExamConfig) => {
    setActiveExamConfig(config);
    setActivePage('exam-running');
    addToast(`Exam started: ${config.title} (${config.questionCount} questions, ${config.durationMinutes} mins)`);
  };

  const completeExam = (result: ExamResult) => {
    setLastExamResult(result);
    setExamHistory(prev => [result, ...prev]);
    setActivePage('exam-result');
    if (result.percentage >= 60) {
      sounds.playSuccess();
    } else {
      sounds.playError();
    }
  };

  const toggleTopicCompletion = (topicId: string) => {
    sounds.playClick();
    setCompletedTopics(prev => {
      const exists = prev.includes(topicId);
      const next = exists ? prev.filter(id => id !== topicId) : [...prev, topicId];
      addToast(exists ? 'Topic marked as pending' : 'Topic marked as completed! Keep going! 🎉', 'success');
      return next;
    });
  };

  const toggleBookmark = (topicId: string) => {
    sounds.playClick();
    setBookmarkedTopics(prev => {
      const exists = prev.includes(topicId);
      const next = exists ? prev.filter(id => id !== topicId) : [...prev, topicId];
      addToast(exists ? 'Bookmark removed' : 'Topic bookmarked! 📌', 'info');
      return next;
    });
  };

  const toggleFlagQuestion = (questionId: string) => {
    sounds.playClick();
    setFlaggedQuestionIds(prev => {
      const exists = prev.includes(questionId);
      return exists ? prev.filter(id => id !== questionId) : [...prev, questionId];
    });
  };

  const loginUser = (email: string, name?: string) => {
    sounds.playSuccess();
    const newUser: UserProfile = {
      id: 'student-' + Date.now(),
      name: name || email.split('@')[0],
      email,
      college: 'University Faculty of Engineering',
      targetExam: 'Operations Research College Exam',
      semester: 'Current Semester',
      createdAt: new Date().toISOString(),
      avatarSeed: email,
    };
    setUser(newUser);
    addToast(`Welcome back, ${newUser.name}!`, 'success');
    setActivePage('dashboard');
  };

  const logoutUser = () => {
    sounds.playClick();
    setUser(null);
    addToast('Logged out securely.', 'info');
    setActivePage('splash');
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    sounds.playSuccess();
    setUser(prev => (prev ? { ...prev, ...profile } : null));
    addToast('Profile updated successfully!', 'success');
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    sounds.playClick();
    setSettings(prev => ({ ...prev, ...newSettings }));
    addToast('Settings saved!', 'success');
  };

  const resetAllProgress = () => {
    setCompletedTopics([]);
    setBookmarkedTopics([]);
    setExamHistory([]);
    setFlaggedQuestionIds([]);
    addToast('All learning progress reset to zero.', 'info');
  };

  const exportDataJSON = () => {
    const data = {
      user,
      completedTopics,
      bookmarkedTopics,
      examHistory,
      settings,
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.completedTopics) setCompletedTopics(parsed.completedTopics);
      if (parsed.bookmarkedTopics) setBookmarkedTopics(parsed.bookmarkedTopics);
      if (parsed.examHistory) setExamHistory(parsed.examHistory);
      if (parsed.settings) setSettings(parsed.settings);
      if (parsed.user) setUser(parsed.user);
      addToast('Data restored successfully!', 'success');
      return true;
    } catch {
      addToast('Invalid JSON backup file.', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        activePage,
        selectedTopicId,
        selectedModuleId,
        activeExamConfig,
        lastExamResult,
        completedTopics,
        bookmarkedTopics,
        flaggedQuestionIds,
        examHistory,
        settings,
        toasts,
        setActivePage,
        openTopic,
        startExam,
        completeExam,
        toggleTopicCompletion,
        toggleBookmark,
        toggleFlagQuestion,
        loginUser,
        logoutUser,
        updateProfile,
        updateSettings,
        addToast,
        resetAllProgress,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
