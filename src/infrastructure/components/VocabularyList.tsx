import React from 'react';
import type { Vocabulary } from '../../domain/entities/Vocabulary';

interface VocabularyListProps {
    vocabulary: Vocabulary[];
}

const VocabularyList: React.FC<VocabularyListProps> = ({ vocabulary }) => {
    if (vocabulary.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <p style={{ color: '#666', marginBottom: '10px' }}>No vocabulary added yet.</p>
                <p style={{ fontSize: '0.9rem', color: '#888' }}>Add words to start building this topic!</p>
            </div>
        );
    }

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', color: 'black' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f0f0f0', textAlign: 'left' }}>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Character/Word</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Pinyin/Pronunciation</th>
                        <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Meaning</th>
                    </tr>
                </thead>
                <tbody>
                    {vocabulary.map((vocab) => (
                        <tr key={vocab.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}>{vocab.character}</td>
                            <td style={{ padding: '12px', color: '#555' }}>{vocab.pinyin}</td>
                            <td style={{ padding: '12px' }}>{vocab.translation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VocabularyList;
