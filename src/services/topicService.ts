import { API_ENDPOINTS } from '../config/api';

export interface Vocabulary {
  id: string;
  character: string;
  pinyin: string;
  translation: string;
}

export interface Topic {
  id: string;
  name: string;
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

const mockTopics: Topic[] = [
  {
    id: '1',
    name: 'Greetings',
    description: 'Basic greetings',
    vocabulary: [
      { id: '1', character: '你好', pinyin: 'Nǐ hǎo', translation: 'Hola' },
      { id: '2', character: '谢谢', pinyin: 'Xièxiè', translation: 'Gracias' },
      { id: '3', character: '再见', pinyin: 'Zàijiàn', translation: 'Adiós' },
      { id: '4', character: '早上好', pinyin: 'Zǎoshang hǎo', translation: 'Buenos días' },
      { id: '5', character: '晚安', pinyin: 'Wǎn\'ān', translation: 'Buenas noches' }
    ]
  },
  {
    id: '2',
    name: 'Numbers',
    description: '1-10',
    vocabulary: [
      { id: '6', character: '一', pinyin: 'Yī', translation: 'Uno' },
      { id: '7', character: '二', pinyin: 'Èr', translation: 'Dos' },
      { id: '8', character: '三', pinyin: 'Sān', translation: 'Tres' },
      { id: '9', character: '四', pinyin: 'Sì', translation: 'Cuatro' },
      { id: '10', character: '五', pinyin: 'Wǔ', translation: 'Cinco' }
    ]
  }
];

export const topicService = {
  getTopics: async (): Promise<Topic[]> => {
    try {
      const response = await fetch(API_ENDPOINTS.TOPICS, {
        method: 'GET',
        headers: getHeaders()
      });
      if (!response.ok) return mockTopics;
      return await response.json();
    } catch (error) {
      console.warn("API failed, using mock data", error);
      return mockTopics;
    }
  },

  getTopicById: async (id: string): Promise<Topic | undefined> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.TOPICS}/${id}`, {
        method: 'GET',
        headers: getHeaders()
      });
      if (!response.ok) return mockTopics.find(t => t.id === id);
      return await response.json();
    } catch (error) {
      console.warn("API failed, using mock data", error);
      return mockTopics.find(t => t.id === id);
    }
  },

  createTopic: async (title: string, description: string): Promise<Topic> => {
    const response = await fetch(API_ENDPOINTS.TOPICS, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name: title, description })
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(errorBody || 'Error al crear tema');
    }
    return await response.json();
  },

  addVocabulary: async (topicId: string, vocab: Omit<Vocabulary, 'id'>): Promise<Vocabulary> => {
    const response = await fetch(`${API_ENDPOINTS.TOPICS}/${topicId}/vocabulary`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(vocab)
    });
    if (!response.ok) throw new Error('Error al agregar vocabulario');
    return await response.json();
  },
};