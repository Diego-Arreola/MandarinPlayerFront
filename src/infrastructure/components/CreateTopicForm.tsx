import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';

interface CreateTopicFormProps {
    onSubmit: (title: string, description: string) => Promise<void>;
    onCancel: () => void;
}

const CreateTopicForm: React.FC<CreateTopicFormProps> = ({ onSubmit, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isMountedRef = useRef(true);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(title, description);
            if (isMountedRef.current) {
                setTitle('');
                setDescription('');
            }
        } finally {
            if (isMountedRef.current) {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
                <label htmlFor="title" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Topic Title
                </label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Greetings"
                    required
                    style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        fontSize: '1rem',
                        color: 'black',
                    }}
                />
            </div>

            <div>
                <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the topic..."
                    rows={3}
                    style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        fontSize: '1rem',
                        resize: 'vertical',
                        color: 'black',
                    }}
                />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !title.trim()}>
                    {isSubmitting ? 'Creating...' : 'Create Topic'}
                </Button>
            </div>
        </form>
    );
};

export default CreateTopicForm;
