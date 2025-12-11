import type { Topic } from '../entities/Topic';
import type { Vocabulary } from '../entities/Vocabulary';

export interface ITopicRepository {
    getTopics(): Promise<Topic[]>;
    deleteTopic(id: string): Promise<void>;
    getTopicById(id: string): Promise<Topic | undefined>;
    createTopic(title: string, description: string): Promise<Topic>;
    addVocabulary(topicId: string, vocab: Omit<Vocabulary, 'id'>): Promise<Vocabulary>;
}
