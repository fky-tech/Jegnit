'use client';
import { useState, useEffect } from 'react';
import { Mail, Clock, Trash2, Loader } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';

export default function AdminContacts() {
    const { addNotification } = useNotification();
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            // Fetch from API
            const res = await fetch('/api/contacts');
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Error fetching messages', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this message?')) return;

        try {
            const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMessages(messages.filter(m => m.id !== id));
                addNotification('Message deleted successfully!');
            } else {
                addNotification('Failed to delete', 'error');
            }
        } catch (error) {
            console.error(error);
            addNotification('Error deleting', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6a00]"></div>
            </div>
        );
    }

    return (
        <div className="mt-20 md:mt-5 ml-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Messages</h1>
                    <p className="text-gray-500 font-medium mt-1">Inbox & Inquiries</p>
                </div>
            </div>

            <div className="grid gap-6">
                {(!messages || messages.length === 0) ? (
                    <div className="p-16 text-center text-gray-400 bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <Mail className="w-16 h-16 mx-auto mb-6 opacity-20" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Inbox Empty</h3>
                        <p>No messages received yet.</p>
                    </div>
                ) : (
                    messages.map((msg: any) => (
                        <div key={msg.id} className="bg-white p-5 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-[#ff6a00]/30 transition-all duration-300 group">
                            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff6a00] to-[#ff914d] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform duration-300">
                                        {msg.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{msg.name}</h3>
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            <Mail className="w-3.5 h-3.5" />
                                            {msg.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(msg.created_at).toLocaleString()}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(msg.id)}
                                        className="p-3 text-gray-300 hover:text-white hover:bg-black rounded-xl transition-all"
                                        title="Delete Message"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 group-hover:bg-white group-hover:border-gray-200 transition-colors">
                                <p className="text-gray-700 leading-relaxed font-medium">
                                    {msg.message}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
