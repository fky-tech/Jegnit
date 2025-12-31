'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
    id: string;
    message: string;
    type: NotificationType;
}

interface NotificationContextType {
    addNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((message: string, type: NotificationType = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        setNotifications((prev) => [...prev, { id, message, type }]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 5000);
    }, []);

    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {notifications.map((notification) => (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            className={`pointer-events-auto min-w-[320px] max-w-md p-4 rounded-2xl shadow-2xl border flex items-center gap-4 bg-white/90 backdrop-blur-xl ${notification.type === 'success'
                                    ? 'border-green-100'
                                    : notification.type === 'error'
                                        ? 'border-red-100'
                                        : 'border-blue-100'
                                }`}
                        >
                            <div className={`p-2 rounded-xl ${notification.type === 'success'
                                    ? 'bg-green-50 text-green-600'
                                    : notification.type === 'error'
                                        ? 'bg-red-50 text-red-600'
                                        : 'bg-blue-50 text-blue-600'
                                }`}>
                                {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
                                {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
                                {notification.type === 'info' && <Info className="w-5 h-5" />}
                            </div>

                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900">{notification.message}</p>
                            </div>

                            <button
                                onClick={() => removeNotification(notification.id)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
};
