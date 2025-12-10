import React, { useState } from 'react';
import Button from './Button';
import type { Vocabulary } from '../../domain/entities/Vocabulary';

interface AddVocabularyFormProps {
    onSubmit: (vocab: Omit<Vocabulary, 'id'>) => Promise<void>;
    onCancel: () => void;
}

const AddVocabularyForm: React.FC<AddVocabularyFormProps> = ({ onSubmit, onCancel }) => {
    const [character, setCharacter] = useState('');
    const [pinyin, setPinyin] = useState('');
    const [translation, setTranslation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!character.trim() || !translation.trim()) return;

        setIsSubmitting(true);
        try {
            await onSubmit({ character, pinyin, translation });
            setCharacter('');
            setPinyin('');
            setTranslation('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
                <label htmlFor="chinese" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Chinese (Hanzi)
                </label>
                <input
                    id="chinese"
                    type="text"
                    value={character}
                    onChange={(e) => setCharacter(e.target.value)}
                    placeholder="e.g., 你好"
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: 'black' }}
                />
            </div>

            <div>
                <label htmlFor="pinyin" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Pinyin
                </label>
                <input
                    id="pinyin"
                    type="text"
                    value={pinyin}
                    onChange={(e) => setPinyin(e.target.value)}
                    placeholder="e.g., Nǐ hǎo"
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: 'black' }}
                />
            </div>

            <div>
                <label htmlFor="spanish" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Spanish Meaning
                </label>
                <input
                    id="spanish"
                    type="text"
                    value={translation}
                    onChange={(e) => setTranslation(e.target.value)}
                    placeholder="e.g., Hola"
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: 'black' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !character.trim() || !translation.trim()}>
                    {isSubmitting ? 'Adding...' : 'Add Word'}
                </Button>
            </div>
        </form>
    );
};

export default AddVocabularyForm;
