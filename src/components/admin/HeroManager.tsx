'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader, Upload, Check, X as XIcon, Image as ImageIcon } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { supabase } from '@/utils/supabase';

interface HeroImage {
    id: string;
    image_url: string;
    order: number;
    is_active: boolean;
    created_at: string;
}

export default function HeroManager() {
    const { addNotification } = useNotification();
    const [images, setImages] = useState<HeroImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const BASE_IMAGE_URL = 'https://fbgmwoldofhnlfnqfsug.supabase.co/storage/v1/object/public/product-images/';

    const fetchImages = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/hero');
            const data = await res.json();
            if (res.ok) {
                setImages(data);
            }
        } catch (error) {
            console.error('Error fetching hero images:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const fileName = `hero-${Date.now()}-${file.name}`;

        try {
            const { error } = await supabase
                .storage
                .from('product-images')
                .upload(fileName, file, { upsert: true });

            if (error) throw error;

            const publicUrl = `${BASE_IMAGE_URL}${fileName}`;

            const res = await fetch('/api/admin/hero', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image_url: publicUrl,
                    order: images.length,
                    is_active: true
                }),
            });

            if (!res.ok) throw new Error('Failed to save to database');

            await fetchImages();
            addNotification('Hero image uploaded successfully!');
        } catch (error: any) {
            console.error('Upload Error:', error);
            addNotification(`Failed to upload: ${error.message}`, 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this hero image?')) return;

        try {
            const res = await fetch(`/api/admin/hero?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setImages(images.filter(img => img.id !== id));
                addNotification('Hero image deleted successfully!');
            }
        } catch (error) {
            console.error('Delete error:', error);
            addNotification('Failed to delete image', 'error');
        }
    };

    const toggleActive = async (image: HeroImage) => {
        try {
            const res = await fetch('/api/admin/hero', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: image.id,
                    is_active: !image.is_active
                }),
            });

            if (res.ok) {
                setImages(images.map(img => img.id === image.id ? { ...img, is_active: !img.is_active } : img));
                addNotification(`Image ${!image.is_active ? 'activated' : 'deactivated'} successfully!`);
            }
        } catch (error) {
            console.error('Update error:', error);
            addNotification('Failed to update image', 'error');
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-20 md:mt-5 ml-2">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Hero Images</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage homepage slideshow</p>
                </div>
                <label className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-[#ff6a00] hover:shadow-[0_10px_20px_rgba(255,106,0,0.3)] transition-all duration-300 shadow-lg cursor-pointer active:scale-95">
                    {uploading ? <Loader className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                    {uploading ? 'Uploading...' : 'Add Hero Image'}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex justify-center py-20">
                        <Loader className="w-8 h-8 animate-spin text-[#ff6a00]" />
                    </div>
                ) : images.length === 0 ? (
                    <div className="col-span-full p-16 text-center bg-white rounded-[2rem] border border-gray-100 text-gray-400 font-medium">
                        No hero images found. Upload your first one!
                    </div>
                ) : (
                    images.map((img) => (
                        <div key={img.id} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden group">
                            <div className="relative aspect-[16/9] overflow-hidden">
                                <img src={img.image_url} alt="Hero" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <button
                                        onClick={() => toggleActive(img)}
                                        className={`p-3 rounded-full transition-all ${img.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}
                                        title={img.is_active ? 'Deactivate' : 'Activate'}
                                    >
                                        {img.is_active ? <Check className="w-5 h-5" /> : <XIcon className="w-5 h-5" />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(img.id)}
                                        className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                {!img.is_active && (
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-gray-900/80 text-white text-[10px] font-bold uppercase tracking-widest rounded-full backdrop-blur-sm">
                                        Inactive
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex justify-between items-center">
                                <div className="text-[10px] text-gray-400 font-mono">ID: {img.id.slice(0, 8)}...</div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                    {new Date(img.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
