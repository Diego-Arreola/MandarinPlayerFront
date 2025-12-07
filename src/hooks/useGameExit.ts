import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useGameExit = (redirectPath: string = '/welcome') => {
    const navigate = useNavigate();
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    const handleExit = () => {
        setShowExitConfirm(true);
    };

    const confirmExit = () => {
        navigate(redirectPath);
    };

    const cancelExit = () => {
        setShowExitConfirm(false);
    };

    return {
        showExitConfirm,
        handleExit,
        confirmExit,
        cancelExit
    };
};
