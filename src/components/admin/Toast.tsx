'use client';
import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-8 right-8 z-[1000] animate-in slide-in-from-right-10 fade-in duration-300">
            <div className={`
                flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md
                ${type === 'success'
                    ? 'bg-green-50/90 border-green-100 text-green-800'
                    : 'bg-red-50/90 border-red-100 text-red-800'}
            `}>
                {type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="font-bold text-sm tracking-tight">{message}</span>
                <button
                    onClick={onClose}
                    className="ml-4 p-1 hover:bg-black/5 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
