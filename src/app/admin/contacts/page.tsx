import { getSupabaseAdmin } from '@/utils/supabase-admin';
import { Mail, Clock, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminContacts() {
    const supabaseAdmin = getSupabaseAdmin();
    const { data: messages } = await supabaseAdmin
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Messages</h1>

            <div className="grid gap-6">
                {(!messages || messages.length === 0) ? (
                    <div className="p-12 text-center text-gray-400 bg-white rounded-xl border border-gray-100">
                        <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No messages received yet.</p>
                    </div>
                ) : (
                    messages.map((msg: any) => (
                        <div key={msg.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#ff6a00] font-bold">
                                        {msg.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{msg.name}</h3>
                                        <p className="text-sm text-gray-500">{msg.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Clock className="w-3 h-3" />
                                    {new Date(msg.created_at).toLocaleString()}
                                </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                                {msg.message}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
