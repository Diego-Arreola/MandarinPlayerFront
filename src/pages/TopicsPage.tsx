import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopicList from '../components/TopicList';
import CreateTopicForm from '../components/CreateTopicForm';
import Button from '../components/Button';
import { topicService } from '../services/topicService';
import type { Topic } from '../services/topicService';

const TopicsPage = () => {
    const navigate = useNavigate();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadTopics();
    }, []);

    const loadTopics = async () => {
        setIsLoading(true);
        try {
            const data = await topicService.getTopics();
            setTopics(data);
        } catch (error) {
            console.error('Failed to load topics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTopic = async (title: string, description: string) => {
        try {
            await topicService.createTopic(title, description);
            await loadTopics();
            setIsCreating(false);
        } catch (error) {
            console.error('Failed to create topic:', error);
            alert('Failed to create topic. Please try again.');
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: 'var(--secondary-color)', margin: 0 }}>Topics Menu</h2>
                <Button variant="secondary" onClick={() => navigate('/welcome')}>
                    Back to Home
                </Button>
            </div>

            {isCreating ? (
                <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px', color: 'black' }}>
                    <h3 style={{ marginTop: 0 }}>Create New Topic</h3>
                    <CreateTopicForm onSubmit={handleCreateTopic} onCancel={() => setIsCreating(false)} />
                </div>
            ) : (
                <div style={{ marginBottom: '30px' }}>
                    <Button onClick={() => setIsCreating(true)} style={{ width: '100%' }}>
                        + Create New Topic
                    </Button>
                </div>
            )}

            {isLoading ? (
                <p style={{ textAlign: 'center' }}>Loading topics...</p>
            ) : (
                <TopicList topics={topics} />
            )}
        </div>
    );
};

export default TopicsPage;
