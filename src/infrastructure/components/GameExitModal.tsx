import React from 'react';

interface GameExitModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const GameExitModal: React.FC<GameExitModalProps> = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title" style={{ color: 'black' }}>Exit Game?</h2>
                <p className="winner-text" style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'black' }}>
                    ¿Seguro que quieres terminar el juego?
                </p>
                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={onConfirm}
                        style={{ backgroundColor: '#ff4d4d', borderColor: '#ff4d4d' }}
                    >
                        Exit Game
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameExitModal;
