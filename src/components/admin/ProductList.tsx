'use client';
import { useState } from 'react';
import { Plus, Trash2, Edit, Check, X as XIcon } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import ProductModal from './ProductModal';

interface ProductListProps {
    initialProducts: any[];
}

export default function ProductList({ initialProducts }: ProductListProps) {
    const { addNotification } = useNotification();
    const [products, setProducts] = useState<any[]>(initialProducts || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    // Refresh function if needed, or we just update local state after API calls
    const refreshProducts = async () => {
        // In a real app we might re-fetch from API, but for now we can rely on page reload or local updates
        // To be safe, let's allow local updates to drive the UI
    };

    const handleSave = async (productData: any) => {
        try {
            let res;
            if (editingProduct) {
                // Update via API
                res = await fetch('/api/admin/products', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingProduct.id, ...productData }),
                });
            } else {
                // Create via API
                res = await fetch('/api/admin/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData),
                });
            }

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "API Error");

            // Update local state
            if (editingProduct) {
                setProducts(products.map(p => p.id === editingProduct.id ? result : p));
                addNotification('Product updated successfully!');
            } else {
                setProducts([result, ...products]);
                addNotification('Product added successfully!');
            }
        } catch (error) {
            console.error("Save Error:", error);
            throw error; // Re-throw to be caught by Modal
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const res = await fetch(`/api/admin/products?id=${id}`, {
                method: 'DELETE',
            });
            const result = await res.json();

            if (!res.ok) throw new Error(result.error || "Delete Failed");

            setProducts(products.filter(p => p.id !== id));
            addNotification('Product deleted successfully!');
        } catch (error) {
            console.error(error);
            addNotification('Error deleting product', 'error');
        }
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product: any) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-20 md:mt-5 ml-2">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Products</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage your catalog</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-[#ff6a00] hover:shadow-[0_10px_20px_rgba(255,106,0,0.3)] transition-all duration-300 shadow-lg active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Add Product
                </button>
            </div>

            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Image</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Name</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Price</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Featured</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.length === 0 ? (
                                <tr><td colSpan={5} className="p-16 text-center text-gray-400 font-medium">No products found. Add your first one!</td></tr>
                            ) : (
                                products.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                                                <img
                                                    src={p.img || '/placeholder.png'}
                                                    alt={p.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 text-sm">{p.name}</div>
                                            <div className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {p.id}</div>
                                        </td>
                                        <td className="px-6 py-4 text-[#ff6a00] font-black tracking-tight text-sm">ETB {Number(p.price).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            {p.featured ? (
                                                <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full shadow-inner">
                                                    <Check className="w-3 h-3 stroke-[3]" />
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-300 rounded-full">
                                                    <XIcon className="w-3 h-3" />
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => openEditModal(p)}
                                                    className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all" title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    className="p-2.5 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all" title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSave}
                initialData={editingProduct}
            />
        </div>
    );
}
