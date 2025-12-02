export interface Vocabulary {
  id: string;
  chinese: string;
  pinyin: string;
  spanish: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  vocabulary: Vocabulary[];
}

const STORAGE_KEY = 'mandarin_player_topics';

const getTopicsFromStorage = (): Topic[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveTopicsToStorage = (topics: Topic[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(topics));
};

export const topicService = {
  getTopics: async (): Promise<Topic[]> => {
    // Simulate async delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getTopicsFromStorage());
      }, 300);
    });
  },

  getTopicById: async (id: string): Promise<Topic | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const topics = getTopicsFromStorage();
        resolve(topics.find((t) => t.id === id));
      }, 300);
    });
  },

  createTopic: async (title: string, description: string): Promise<Topic> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const topics = getTopicsFromStorage();
        const newTopic: Topic = {
          id: Date.now().toString(),
          title,
          description,
          vocabulary: [],
        };
        topics.push(newTopic);
        saveTopicsToStorage(topics);
        resolve(newTopic);
      }, 300);
    });
  },

  addVocabulary: async (topicId: string, vocab: Omit<Vocabulary, 'id'>): Promise<Vocabulary> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const topics = getTopicsFromStorage();
        const topicIndex = topics.findIndex((t) => t.id === topicId);
        
        if (topicIndex === -1) {
          reject(new Error('Topic not found'));
          return;
        }

        const newVocab: Vocabulary = {
          id: Date.now().toString(),
          ...vocab,
        };

        topics[topicIndex].vocabulary.push(newVocab);
        saveTopicsToStorage(topics);
        resolve(newVocab);
      }, 300);
    });
  },
};
