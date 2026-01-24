import React from 'react';
import './CloudSyncSettings.css';
import { CloudSyncContent } from './CloudSyncContent';

interface CloudSyncSettingsProps {
    isOpen: boolean;
    onClose: () => void;
    onToast: (message: string) => void;
}

export const CloudSyncSettings: React.FC<CloudSyncSettingsProps> = ({
    isOpen,
    onClose,
    onToast,
}) => {
    if (!isOpen) return null;

    return (
        <div className="cloud-sync-overlay" onClick={onClose}>
            <div className="cloud-sync-modal" onClick={(e) => e.stopPropagation()}>
                <CloudSyncContent onClose={onClose} onToast={onToast} />
            </div>
        </div>
    );
};

export default CloudSyncSettings;
