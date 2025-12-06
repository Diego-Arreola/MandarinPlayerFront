const API_URL = 'http://localhost:8080/api/topics';

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

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const topicService = {
  getTopics: async (): Promise<Topic[]> => {
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: getHeaders()
    });
    if (!response.ok) return [];
    return await response.json();
  },

  getTopicById: async (id: string): Promise<Topic | undefined> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: getHeaders()
    });
    if (!response.ok) return undefined;
    return await response.json();
  },

  createTopic: async (title: string, description: string): Promise<Topic> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ title, description })
    });
    if (!response.ok) throw new Error('Error al crear tema');
    return await response.json();
  },

  addVocabulary: async (topicId: string, vocab: Omit<Vocabulary, 'id'>): Promise<Vocabulary> => {
    const response = await fetch(`${API_URL}/${topicId}/vocabulary`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(vocab)
    });
    if (!response.ok) throw new Error('Error al agregar vocabulario');
    return await response.json();
  },
};