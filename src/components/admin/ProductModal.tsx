'use client';
import { useState, useEffect } from 'react';
import { X, Save, Loader, Plus, Trash2 } from 'lucide-react';

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

    // Manage sizes dynamically
    const [sizes, setSizes] = useState<SizeVariant[]>([]);

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

        } else {
            setFormData({
                name: '',
                price: '',
                img: '',
                featured: false,
            });
            setSizes([]);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleAddSize = () => {
        setSizes([...sizes, { size: '', price: formData.price }]); // Default to base price
    };

    const handleRemoveSize = (index: number) => {
        setSizes(sizes.filter((_, i) => i !== index));
    };

    const handleSizeChange = (index: number, field: keyof SizeVariant, value: string) => {
        const newSizes = [...sizes];
        newSizes[index][field] = value;
        setSizes(newSizes);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Prepare submission data with correct types
            const submission = {
                ...formData,
                price: parseFloat(formData.price), // Convert to number
                sizes: sizes.map(s => ({
                    ...s,
                    price: parseFloat(s.price || formData.price) // Convert variant prices too
                }))
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <input
                                type="url"
                                placeholder="https://..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a00] outline-none"
                                value={formData.img}
                                onChange={e => setFormData({ ...formData, img: e.target.value })}
                            />
                            <p className="text-xs text-gray-400 mt-1">Paste a direct image link.</p>
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
