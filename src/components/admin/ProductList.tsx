'use client';
import { useState } from 'react';
import { Plus, Trash2, Edit, Check, X as XIcon } from 'lucide-react';
import ProductModal from './ProductModal';

interface ProductListProps {
    initialProducts: any[];
}

export default function ProductList({ initialProducts }: ProductListProps) {
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
            } else {
                setProducts([result, ...products]);
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
        } catch (error) {
            console.error(error);
            alert('Error deleting product');
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
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-[#ff6a00] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#ff914d] transition-colors shadow-lg shadow-orange-200"
                >
                    <Plus className="w-4 h-4" /> Add Product
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-600">Image</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Name</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Price</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-center">Featured</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.length === 0 ? (
                            <tr><td colSpan={5} className="p-10 text-center text-gray-400">No products found. Add your first one!</td></tr>
                        ) : (
                            products.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={p.img || '/placeholder.png'}
                                            alt={p.name}
                                            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                                    <td className="px-6 py-4 text-gray-600">ETB {p.price}</td>
                                    <td className="px-6 py-4 text-center">
                                        {p.featured ? (
                                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                                                <Check className="w-3 h-3" />
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-400 rounded-full">
                                                <XIcon className="w-3 h-3" />
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 flex gap-3">
                                        <button
                                            onClick={() => openEditModal(p)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
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
