import React from 'react';
import type { Topic } from '../services/topicService';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

interface TopicListProps {
    topics: Topic[];
}

const TopicList: React.FC<TopicListProps> = ({ topics }) => {
    const navigate = useNavigate();

    if (topics.length === 0) {
        return <p style={{ textAlign: 'center', color: '#666' }}>No topics found. Create one to get started!</p>;
    }

    return (
        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {topics.map((topic) => (
                <div
                    key={topic.id}
                    style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '20px',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        color: 'black',
                    }}
                >
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-primary">{topic.name}</h3>
                        <p style={{ color: '#555', fontSize: '0.9rem' }}>{topic.description}</p>
                        <p style={{ fontSize: '0.8rem', color: '#888' }}>
                            {topic.vocabulary?.length ?? 0} words
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate(`/topics/${topic.id}`)}
                        style={{ marginTop: '15px' }}
                    >
                        View Vocabulary
                    </Button>
                </div>
            ))}
        </div>
    );
};

export default TopicList;
