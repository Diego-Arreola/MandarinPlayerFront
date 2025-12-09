import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { topicService } from '../../services/topicService';
import type { Topic, Vocabulary } from '../../services/topicService';

// Mock fetch globally
vi.stubGlobal('fetch', vi.fn());

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('topicService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('token', 'test-token');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getTopics', () => {
    it('fetches topics from API', async () => {
      const mockTopics: Topic[] = [
        {
          id: '1',
          name: 'Test Topic',
          description: 'Test Description',
          vocabulary: [],
        },
      ];

      const mockResponse = new Response(JSON.stringify(mockTopics), {
        status: 200,
        statusText: 'OK',
      } as ResponseInit);
      Object.defineProperty(mockResponse, 'ok', { value: true });
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const topics = await topicService.getTopics();

      expect(topics).toEqual(mockTopics);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/topics'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({ 'Authorization': 'Bearer test-token' }),
        })
      );
    });

    it('returns mock data when API fails', async () => {
      const mockResponse = new Response('Error', {
        status: 500,
        statusText: 'Internal Server Error',
      } as ResponseInit);
      Object.defineProperty(mockResponse, 'ok', { value: false });
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const topics = await topicService.getTopics();

      expect(topics).toHaveLength(2); // Mock data has 2 topics
      expect(topics[0].name).toBe('Greetings');
    });
  });

  describe('getTopicById', () => {
    it('fetches single topic by ID', async () => {
      const mockTopic: Topic = {
        id: '1',
        name: 'Test Topic',
        description: 'Test Description',
        vocabulary: [],
      };

      const mockResponse = new Response(JSON.stringify(mockTopic), {
        status: 200,
        statusText: 'OK',
      } as ResponseInit);
      Object.defineProperty(mockResponse, 'ok', { value: true });
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const topic = await topicService.getTopicById('1');

      expect(topic).toEqual(mockTopic);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/topics/1'),
        expect.any(Object)
      );
    });

    it('returns mock data when API fails', async () => {
      const mockResponse = new Response('Error', {
        status: 500,
        statusText: 'Internal Server Error',
      } as ResponseInit);
      Object.defineProperty(mockResponse, 'ok', { value: false });
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const topic = await topicService.getTopicById('1');

      expect(topic?.name).toBe('Greetings');
    });

    it('returns undefined for non-existent topic in mock data', async () => {
      const mockResponse = new Response('Not Found', {
        status: 404,
        statusText: 'Not Found',
      } as ResponseInit);
      Object.defineProperty(mockResponse, 'ok', { value: false });
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const topic = await topicService.getTopicById('999');

      expect(topic).toBeUndefined();
    });
  });

  describe('createTopic', () => {
    it('creates a new topic', async () => {
      const mockTopic: Topic = {
        id: '3',
        name: 'New Topic',
        description: 'New Description',
        vocabulary: [],
      };

      const mockResponse = new Response(JSON.stringify(mockTopic), {
        status: 201,
        statusText: 'Created',
      } as ResponseInit);
      Object.defineProperty(mockResponse, 'ok', { value: true });
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const topic = await topicService.createTopic('New Topic', 'New Description');

      expect(topic).toEqual(mockTopic);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/topics'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'New Topic', description: 'New Description' }),
        })
      );
    });

    it('returns mock topic on failed creation (fallback)', async () => {
      const mockResponse = new Response('Error', {
        status: 400,
        statusText: 'Bad Request',
      } as ResponseInit);
      Object.defineProperty(mockResponse, 'ok', { value: false });
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const topic = await topicService.createTopic('Fallback Topic', 'Fallback Desc');
      
      expect(topic).toBeDefined();
      expect(topic.name).toBe('Fallback Topic');
      expect(topic.id).toBeDefined();
    });
  });

  describe('addVocabulary', () => {
    it('adds vocabulary to a topic', async () => {
      const mockVocab: Vocabulary = {
        id: '100',
        character: '你好',
        pinyin: 'Nǐ hǎo',
        translation: 'Hola',
      };

      const mockResponse = new Response(JSON.stringify(mockVocab), {
        status: 201,
        statusText: 'Created',
      } as ResponseInit);
      Object.defineProperty(mockResponse, 'ok', { value: true });
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const vocab = await topicService.addVocabulary('1', {
        character: '你好',
        pinyin: 'Nǐ hǎo',
        translation: 'Hola',
      });

      expect(vocab).toEqual(mockVocab);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/topics/1/vocabulary'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            character: '你好',
            pinyin: 'Nǐ hǎo',
            translation: 'Hola',
          }),
        })
      );
    });

    it('returns mock vocabulary on failed addition (fallback)', async () => {
      const mockResponse = new Response('Error', {
        status: 400,
        statusText: 'Bad Request',
      } as ResponseInit);
      Object.defineProperty(mockResponse, 'ok', { value: false });
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const vocab = await topicService.addVocabulary('1', {
        character: 'Test',
        pinyin: 'Pinyin',
        translation: 'Trans',
      });

      expect(vocab).toBeDefined();
      expect(vocab.character).toBe('Test');
      expect(vocab.id).toBeDefined(); // Should have a fallback ID
    });
  });
});
