import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VocabularyList from '../components/VocabularyList';
import AddVocabularyForm from '../components/AddVocabularyForm';
import Button from '../components/Button';
import { Trash2 } from 'lucide-react';
import { topicService } from '../services/topicService';
import type { Topic, Vocabulary } from '../services/topicService';

const TopicDetailPage = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();
    const [topic, setTopic] = useState<Topic | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (topicId) {
            loadTopic(topicId);
        }
    }, [topicId]);

    const loadTopic = async (id: string) => {
        setIsLoading(true);
        try {
            const data = await topicService.getTopicById(id);
            if (data) {
                setTopic(data);
            } else {
                navigate('/topics'); // Redirect if not found
            }
        } catch (error) {
            console.error('Failed to load topic:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddVocabulary = async (vocab: Omit<Vocabulary, 'id'>) => {
        if (!topic) return;
        try {
            await topicService.addVocabulary(topic.id, vocab);
            await loadTopic(topic.id);
            setIsAdding(false);
        } catch (error) {
            console.error('Failed to add vocabulary:', error);
            alert('Failed to add vocabulary. Please try again.');
        }
    };

    const handleDeleteTopic = async () => {
        if (!topic) return;
        if (window.confirm('Are you sure you want to delete this topic? This action cannot be undone.')) {
            try {
                await topicService.deleteTopic(topic.id);
                navigate('/topics');
            } catch (error) {
                console.error('Failed to delete topic:', error);
                alert('Failed to delete topic. Please try again.');
            }
        }
    };

    if (isLoading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading topic...</div>;
    }

    if (!topic) {
        return null;
    }

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
            <div style={{ marginBottom: '30px' }}>
                <Button variant="secondary" onClick={() => navigate('/topics')} style={{ marginBottom: '20px' }}>
                    &larr; Back to Topics
                </Button>

                <div style={{ borderBottom: '1px solid #eee', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h2 style={{ color: 'var(--secondary-color)', margin: '0 0 10px 0' }}>{topic.name}</h2>
                        <p style={{ color: '#666', margin: 0 }}>{topic.description}</p>
                    </div>
                    <button
                        onClick={handleDeleteTopic}
                        className="text-red-500 hover:text-red-700 transition-colors p-2 rounded hover:bg-red-50 cursor-pointer"
                        title="Delete Topic"
                    >
                        <Trash2 size={24} />
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>Vocabulary List ({topic.vocabulary?.length || 0})</h3>
                {!isAdding && (
                    <Button onClick={() => setIsAdding(true)}>
                        + Add Word
                    </Button>
                )}
            </div>

            {isAdding && (
                <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px', color: 'black' }}>
                    <h4 style={{ marginTop: 0 }}>Add New Word</h4>
                    <AddVocabularyForm onSubmit={handleAddVocabulary} onCancel={() => setIsAdding(false)} />
                </div>
            )}

            <h1 className="text-3xl font-bold text-gray-900">{topic?.name}</h1>
            <VocabularyList vocabulary={topic.vocabulary || []} />
        </div>
    );
};

export default TopicDetailPage;
