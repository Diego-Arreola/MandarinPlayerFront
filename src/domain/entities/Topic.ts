import type { Vocabulary } from './Vocabulary';

export interface Topic {
    id: string;
    name: string;
    description: string;
    vocabulary: Vocabulary[];
}
