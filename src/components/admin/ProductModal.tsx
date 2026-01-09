'use client';
import { useState, useEffect } from 'react';
import { X, Save, Loader, Plus, Trash2, Upload } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
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
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        img: '',
    });
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('0');
    const [category, setCategory] = useState('Shapewear');
    const [featured, setFeatured] = useState(false);
    const [bestseller, setBestseller] = useState(false);

    // Auto-feature when discount is applied
    useEffect(() => {
        const discVal = parseInt(discount) || 0;
        if (discVal > 0) {
            setFeatured(true);
        } else if (!bestseller) {
            // Only uncheck if not a bestseller
            setFeatured(false);
        }
    }, [discount, bestseller]);

    // Manage sizes and colors dynamically
    const [sizes, setSizes] = useState<SizeVariant[]>([]);
    const [colors, setColors] = useState<{ name: string, images: string[] }[]>([]);
    const [activeColorTab, setActiveColorTab] = useState<'Black' | 'Brown' | 'Nude'>('Black');

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                img: initialData.img || '',
            });
            setPrice(initialData.price?.toString() || '');
            setDiscount(initialData.discount?.toString() || '0');
            setCategory(initialData.category || 'Shapewear');
            setFeatured(initialData.featured || false);
            setBestseller(initialData.bestseller || false);

            // Parse sizes if available
            try {
                let parsedSizes: SizeVariant[] = [];
                if (typeof initialData.sizes === 'string') {
                    parsedSizes = JSON.parse(initialData.sizes);
                } else if (Array.isArray(initialData.sizes)) {
                    parsedSizes = initialData.sizes;
                }

                // Ensure price is string for input
                setSizes(parsedSizes.map(s => ({
                    ...s,
                    price: s.price?.toString() || ''
                })));
            } catch (e) {
                console.error("Size parse error", e);
                setSizes([]);
            }

            // Parse colors if available
            try {
                let parsedColors: any[] = [];
                if (typeof initialData.colors === 'string') {
                    parsedColors = JSON.parse(initialData.colors);
                } else if (Array.isArray(initialData.colors)) {
                    parsedColors = initialData.colors;
                }

                // Convert old img structure to images array for consistency
                setColors(parsedColors.map(c => ({
                    name: c.name || 'Black',
                    images: c.images || (c.img ? [c.img] : [])
                })));
            } catch (e) {
                setColors([]);
            }

        } else {
            setFormData({
                name: '',
                img: '',
            });
            setPrice('');
            setDiscount('0');
            setCategory('Shapewear');
            setFeatured(false);
            setBestseller(false);
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

            if (colorIndex !== undefined || activeColorTab) {
                const targetColor = colorIndex !== undefined ? colors[colorIndex]?.name : activeColorTab;
                setColors(prev => {
                    const existing = prev.find(c => c.name === targetColor);
                    if (existing) {
                        return prev.map(c => c.name === targetColor ? { ...c, images: [...c.images, publicUrl] } : c);
                    } else {
                        return [...prev, { name: targetColor!, images: [publicUrl] }];
                    }
                });
            } else {
                setFormData(prev => ({ ...prev, img: publicUrl }));
            }

        } catch (error: any) {
            console.error('Upload Error:', error);
            addNotification(`Failed to upload image: ${error.message}`, 'error');
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    const handleAddSize = () => {
        setSizes([...sizes, { size: '', price: price }]);
    };

    const handleRemoveSize = (index: number) => {
        setSizes(sizes.filter((_, i) => i !== index));
    };

    const handleSizeChange = (index: number, field: keyof SizeVariant, value: string) => {
        const newSizes = [...sizes];
        newSizes[index][field] = value;
        setSizes(newSizes);
    };

    const handleRemoveColorImage = (colorName: string, imgIdx: number) => {
        setColors(prev => prev.map(c =>
            c.name === colorName ? { ...c, images: c.images.filter((_, j) => j !== imgIdx) } : c
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const submission = {
                ...formData,
                price: parseFloat(price),
                discount: parseInt(discount) || 0,
                category,
                featured,
                bestseller,
                sizes: sizes.map(s => ({
                    ...s,
                    price: parseFloat(s.price || price)
                })),
                colors: colors.filter(c => c.images && c.images.length > 0)
            };

            await onSubmit(submission);
            onClose();
        } catch (error) {
            console.error(error);
            addNotification("Failed to save product", 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
                <div className="px-8 py-6 bg-gradient-to-r from-gray-900 to-black text-white flex justify-between items-center flex-shrink-0">
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-widest">
                            {initialData ? 'Edit Product' : 'Add New Product'}
                        </h3>
                        <p className="text-xs text-gray-400 font-medium mt-1">{initialData ? 'Update your catalog item' : 'Create a new catalog item'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-white" />
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
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Price (ETB)</label>
                            <input
                                type="number"
                                required
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none focus:ring-2 focus:ring-[#ff6a00]/20 focus:border-[#ff6a00] transition-all"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Discount (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none focus:ring-2 focus:ring-[#ff6a00]/20 focus:border-[#ff6a00] transition-all"
                                placeholder="0"
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
                                            onWheel={(e) => (e.target as HTMLInputElement).blur()}
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
                        <div className="bg-white border-2 border-gray-100 rounded-[2rem] overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#ff6a00]">Color Variants</h4>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Images grouped by color</p>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="space-y-6">
                                    {/* SINGLE SELECT OPTION AS REQUESTED */}
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Select Color to Manage Images</label>
                                        <select
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-[#ff6a00]/20 focus:border-[#ff6a00] transition-all shadow-sm"
                                            value={activeColorTab}
                                            onChange={(e) => setActiveColorTab(e.target.value as 'Black' | 'Brown' | 'Nude')}
                                        >
                                            <option value="Black">Manage Black Variant</option>
                                            <option value="Brown">Manage Brown Variant</option>
                                            <option value="Nude">Manage Nude Variant</option>
                                        </select>
                                    </div>

                                    {/* ACTIVE COLOR CONFIGURATION - FORCED CLEAN RE-RENDER BY KEY */}
                                    <div key={`color-variant-${activeColorTab}`} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        {(() => {
                                            const colorObj = colors.find(c => c.name === activeColorTab) || { name: activeColorTab, images: [] };

                                            return (
                                                <div className="p-6 bg-white border-2 border-[#ff6a00]/5 rounded-[2rem] space-y-6 shadow-sm">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="w-4 h-4 rounded-full border border-black/10"
                                                                style={{
                                                                    backgroundColor: activeColorTab === 'Black' ? '#000000' :
                                                                        activeColorTab === 'Brown' ? '#63442d' : '#e3bc9a'
                                                                }}
                                                            />
                                                            <h5 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">
                                                                Images for <span className="text-[#ff6a00]">{activeColorTab}</span>
                                                            </h5>
                                                        </div>
                                                        <label className={`flex items-center gap-2 bg-[#ff6a00] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-black transition-all shadow-lg active:scale-95 ${uploading ? 'opacity-50 cursor-wait' : ''}`}>
                                                            <Upload className="w-4 h-4" />
                                                            {uploading ? 'Wait' : 'Add Image'}
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={(e) => handleImageUpload(e)} // No need for index, uses activeColorTab
                                                                disabled={uploading}
                                                            />
                                                        </label>
                                                    </div>

                                                    {colorObj.images && colorObj.images.length > 0 ? (
                                                        <div className="grid grid-cols-3 gap-4">
                                                            {colorObj.images.map((img, imgIdx) => (
                                                                <div key={imgIdx} className="relative aspect-[4/5] rounded-[1.5rem] border border-gray-100 overflow-hidden group/img shadow-sm hover:shadow-2xl transition-all scale-in border-2 hover:border-[#ff6a00]/40">
                                                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveColorImage(activeColorTab, imgIdx)}
                                                                        className="absolute top-2 right-2 p-2.5 bg-black/60 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-all backdrop-blur-md hover:bg-red-500"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="py-16 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center px-6">
                                                            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg mb-4 text-[#ff6a00]/20">
                                                                <Upload className="w-8 h-8" />
                                                            </div>
                                                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed max-w-[200px]">
                                                                No images for <span className="text-gray-900">{activeColorTab}</span>. Click "Add Image" above to start.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
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
                                checked={featured}
                                onChange={e => setFeatured(e.target.checked)}
                            />
                            <label htmlFor="featured" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                                Mark as Featured (Home Page)
                            </label>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <input
                                type="checkbox"
                                id="bestseller"
                                className="w-5 h-5 text-[#ff6a00] rounded focus:ring-[#ff6a00] border-gray-300"
                                checked={bestseller}
                                onChange={e => {
                                    setBestseller(e.target.checked);
                                    if (e.target.checked) {
                                        setFeatured(true);
                                    } else if ((parseInt(discount) || 0) <= 0) {
                                        // Only uncheck if no discount
                                        setFeatured(false);
                                    }
                                }}
                            />
                            <label htmlFor="bestseller" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                                Mark as Bestseller (Badge)
                            </label>
                        </div>
                    </form>
                </div>

                <div className="p-8 border-t border-gray-100 bg-gray-50 flex-shrink-0 flex gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3.5 text-gray-700 font-bold bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all shadow-sm active:scale-95 text-xs uppercase tracking-widest"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="productForm" // Connect to form
                        disabled={loading}
                        className="flex-1 px-4 py-3.5 text-white font-bold bg-[#ff6a00] hover:bg-[#ff8533] hover:shadow-lg hover:shadow-orange-200 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                    >
                        {loading ? <Loader className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Product</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
