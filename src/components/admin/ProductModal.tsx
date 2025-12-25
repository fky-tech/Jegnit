'use client';
import { useState, useEffect } from 'react';
import { X, Save, Loader, Plus, Trash2, Upload } from 'lucide-react';
import { supabase } from '@/utils/supabase';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (product: any) => Promise<void>;
    initialData?: any;
}

interface SizeVariant {
    size: string;
    price: string;
}

export default function ProductModal({ isOpen, onClose, onSubmit, initialData }: ProductModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '', // Base price
        img: '',
        featured: false,
    });

    // Manage sizes and colors dynamically
    const [sizes, setSizes] = useState<SizeVariant[]>([]);
    const [colors, setColors] = useState<{ name: string, img: string }[]>([]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                price: initialData.price || '',
                img: initialData.img || '',
                featured: initialData.featured || false,
            });

            // Parse sizes if available
            try {
                if (typeof initialData.sizes === 'string') {
                    setSizes(JSON.parse(initialData.sizes));
                } else if (Array.isArray(initialData.sizes)) {
                    setSizes(initialData.sizes);
                } else {
                    setSizes([]);
                }
            } catch (e) {
                setSizes([]);
            }

            // Parse colors if available
            try {
                if (typeof initialData.colors === 'string') {
                    setColors(JSON.parse(initialData.colors));
                } else if (Array.isArray(initialData.colors)) {
                    setColors(initialData.colors);
                } else {
                    setColors([]);
                }
            } catch (e) {
                setColors([]);
            }

        } else {
            setFormData({
                name: '',
                price: '',
                img: '',
                featured: false,
            });
            setSizes([]);
            setColors([]);
        }
    }, [initialData, isOpen]);

    const [uploading, setUploading] = useState(false);
    const BASE_IMAGE_URL = 'https://fbgmwoldofhnlfnqfsug.supabase.co/storage/v1/object/public/product-images/';

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, colorIndex?: number) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const fileName = `${Date.now()}-${file.name}`; // Avoid collisions

        try {
            // Upload to Supabase Storage
            const { error } = await supabase
                .storage
                .from('product-images')
                .upload(fileName, file, {
                    upsert: true
                });

            if (error) throw error;

            const publicUrl = `${BASE_IMAGE_URL}${fileName}`;

            if (colorIndex !== undefined) {
                const newColors = [...colors];
                newColors[colorIndex].img = publicUrl;
                setColors(newColors);
            } else {
                setFormData(prev => ({ ...prev, img: publicUrl }));
            }

        } catch (error: any) {
            console.error('Upload Error:', error);
            alert(`Failed to upload image: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    const handleAddSize = () => {
        setSizes([...sizes, { size: '', price: formData.price }]);
    };

    const handleRemoveSize = (index: number) => {
        setSizes(sizes.filter((_, i) => i !== index));
    };

    const handleSizeChange = (index: number, field: keyof SizeVariant, value: string) => {
        const newSizes = [...sizes];
        newSizes[index][field] = value;
        setSizes(newSizes);
    };

    const handleAddColor = () => {
        setColors([...colors, { name: '', img: '' }]);
    };

    const handleRemoveColor = (index: number) => {
        setColors(colors.filter((_, i) => i !== index));
    };

    const handleColorChange = (index: number, field: string, value: string) => {
        const newColors = [...colors];
        const color = newColors[index] as any;
        color[field] = value;
        setColors(newColors);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const submission = {
                ...formData,
                price: parseFloat(formData.price),
                sizes: sizes.map(s => ({
                    ...s,
                    price: parseFloat(s.price || formData.price)
                })),
                colors: colors
            };

            await onSubmit(submission);
            onClose();
        } catch (error) {
            console.error(error);
            alert("Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
                    <h3 className="text-lg font-bold text-gray-900">
                        {initialData ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-4 flex-1">
                    <form id="productForm" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a00] focus:border-transparent outline-none transition-all"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (ETB)</label>
                            <input
                                type="number"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a00] outline-none"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>

                        {/* Dynamic Sizes Section */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-gray-700">Size Variants</label>
                                <button type="button" onClick={handleAddSize} className="text-xs flex items-center gap-1 bg-black text-white px-2 py-1 rounded hover:bg-[#ff6a00] transition-colors">
                                    <Plus className="w-3 h-3" /> Add Size
                                </button>
                            </div>

                            <div className="space-y-2">
                                {sizes.length === 0 && <p className="text-xs text-gray-400 italic">No specific sizes added.</p>}
                                {sizes.map((s, idx) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            placeholder="Size (e.g. S, M, XL)"
                                            className="w-1/3 px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#ff6a00]"
                                            value={s.size}
                                            onChange={(e) => handleSizeChange(idx, 'size', e.target.value)}
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="Price"
                                            className="w-1/3 px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#ff6a00]"
                                            value={s.price}
                                            onChange={(e) => handleSizeChange(idx, 'price', e.target.value)}
                                            required
                                        />
                                        <button type="button" onClick={() => handleRemoveSize(idx)} className="text-red-500 hover:text-red-700 p-1">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dynamic Colors Section */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-gray-700">Color Variants</label>
                                <button type="button" onClick={handleAddColor} className="text-xs flex items-center gap-1 bg-black text-white px-2 py-1 rounded hover:bg-[#ff6a00] transition-colors">
                                    <Plus className="w-3 h-3" /> Add Color
                                </button>
                            </div>

                            <div className="space-y-3">
                                {colors.length === 0 && <p className="text-xs text-gray-400 italic">No specific colors added.</p>}
                                {colors.map((c, idx) => (
                                    <div key={idx} className="p-3 bg-white rounded-lg border border-gray-200">
                                        <div className="flex gap-2 items-center mb-2">
                                            <input
                                                type="text"
                                                placeholder="Color Name (e.g. Black, Nude)"
                                                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#ff6a00]"
                                                value={c.name}
                                                onChange={(e) => handleColorChange(idx, 'name', e.target.value)}
                                                required
                                            />
                                            <button type="button" onClick={() => handleRemoveColor(idx)} className="text-red-500 hover:text-red-700 p-1">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="url"
                                                placeholder="Image URL"
                                                className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#ff6a00]"
                                                value={c.img}
                                                onChange={(e) => handleColorChange(idx, 'img', e.target.value)}
                                            />
                                            <label className="p-1 px-2 bg-gray-100 border border-gray-300 rounded text-[10px] cursor-pointer hover:bg-gray-200">
                                                Upload
                                                <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, idx)} />
                                            </label>
                                        </div>
                                        {c.img && (
                                            <img src={c.img} className="mt-2 w-full h-20 object-contain bg-gray-50 rounded" alt="Color variant" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Main Product Image (Default)</label>

                            {/* File Upload */}
                            <div className="mb-3">
                                <label className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${uploading ? 'bg-gray-50 border-gray-300' : 'border-gray-300 hover:border-[#ff6a00] hover:bg-[#ff6a00]/5'}`}>
                                    <div className="flex flex-col items-center gap-2 text-center">
                                        {uploading ? <Loader className="w-6 h-6 animate-spin text-[#ff6a00]" /> : <Upload className="w-6 h-6 text-gray-400" />}
                                        <span className="text-sm font-medium text-gray-600">
                                            {uploading ? 'Uploading...' : 'Click to Upload Image'}
                                        </span>
                                        <span className="text-xs text-gray-400">Supports JPG, PNG</span>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>

                            <label className="block text-xs font-medium text-gray-500 mb-1">Or paste URL manually:</label>
                            <input
                                type="url"
                                placeholder="https://..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a00] outline-none text-sm"
                                value={formData.img}
                                onChange={e => setFormData({ ...formData, img: e.target.value })}
                            />
                            {formData.img && (
                                <div className="mt-2 w-full h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={formData.img} alt="Preview" className="w-full h-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="featured"
                                className="w-5 h-5 text-[#ff6a00] rounded focus:ring-[#ff6a00] border-gray-300"
                                checked={formData.featured}
                                onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                            />
                            <label htmlFor="featured" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                                Mark as Featured (Home Page)
                            </label>
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex-shrink-0 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 text-gray-700 font-bold bg-white border border-gray-200 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="productForm" // Connect to form
                        disabled={loading}
                        className="flex-1 px-4 py-3 text-white font-bold bg-[#ff6a00] hover:bg-[#ff8533] rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Product</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
