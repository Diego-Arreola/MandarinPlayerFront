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

const mockTopics: Topic[] = [
  {
    id: '1',
    title: 'Greetings',
    description: 'Basic greetings',
    vocabulary: [
      { id: '1', chinese: '你好', pinyin: 'Nǐ hǎo', spanish: 'Hola' },
      { id: '2', chinese: '谢谢', pinyin: 'Xièxiè', spanish: 'Gracias' },
      { id: '3', chinese: '再见', pinyin: 'Zàijiàn', spanish: 'Adiós' },
      { id: '4', chinese: '早上好', pinyin: 'Zǎoshang hǎo', spanish: 'Buenos días' },
      { id: '5', chinese: '晚安', pinyin: 'Wǎn\'ān', spanish: 'Buenas noches' }
    ]
  },
  {
    id: '2',
    title: 'Numbers',
    description: '1-10',
    vocabulary: [
      { id: '6', chinese: '一', pinyin: 'Yī', spanish: 'Uno' },
      { id: '7', chinese: '二', pinyin: 'Èr', spanish: 'Dos' },
      { id: '8', chinese: '三', pinyin: 'Sān', spanish: 'Tres' },
      { id: '9', chinese: '四', pinyin: 'Sì', spanish: 'Cuatro' },
      { id: '10', chinese: '五', pinyin: 'Wǔ', spanish: 'Cinco' }
    ]
  }
];

export const topicService = {
  getTopics: async (): Promise<Topic[]> => {
    try {
      const response = await fetch(API_URL, {
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
      const response = await fetch(`${API_URL}/${id}`, {
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