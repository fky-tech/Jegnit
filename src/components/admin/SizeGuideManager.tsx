'use client';
import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Loader, Save, Search, Ruler, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';

interface SizeGuide {
    id: string;
    product_id: number;
    content: any;
    products?: { name: string };
}

export default function SizeGuideManager() {
    const { addNotification } = useNotification();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [guides, setGuides] = useState<SizeGuide[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const [selectedProduct, setSelectedProduct] = useState<number | ''>('');
    const [tableData, setTableData] = useState<string[][]>([
        ['Size', 'Bust (cm)', 'Waist (cm)', 'Hips (cm)'],
        ['S', '', '', ''],
        ['M', '', '', ''],
        ['L', '', '', ''],
        ['XL', '', '', ''],
    ]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const guidesRes = await fetch('/api/admin/size-guides');
            if (guidesRes.ok) {
                const data = await guidesRes.json();
                setGuides(data);
            }

            const productsRes = await fetch('/api/admin/products');
            if (productsRes.ok) {
                const data = await productsRes.json();
                setProducts(data);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
        const newData = [...tableData];
        newData[rowIndex][colIndex] = value;
        setTableData(newData);
    };

    const addRow = () => setTableData([...tableData, new Array(tableData[0].length).fill('')]);
    const addCol = () => setTableData(tableData.map(row => [...row, '']));

    const removeRow = (idx: number) => {
        if (tableData.length > 2) {
            setTableData(tableData.filter((_, i) => i !== idx));
        }
    };

    const removeCol = () => {
        if (tableData[0].length > 2) {
            setTableData(tableData.map(row => row.slice(0, -1)));
        }
    };

    const handleSave = async () => {
        if (!selectedProduct) {
            addNotification('Please select a product first', 'info');
            return;
        }
        setSaving(true);
        try {
            const res = await fetch('/api/admin/size-guides', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: selectedProduct,
                    content: tableData
                })
            });
            if (res.ok) {
                addNotification('Size guide successfully updated!', 'success');
                fetchData();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/size-guides?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setGuides(guides.filter(g => g.id !== id));
                addNotification('Size guide deleted.', 'success');
            }
        } catch (error) {
            console.error(error);
            addNotification('Failed to delete guide.', 'error');
        } finally {
            setConfirmDelete(null);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-20 md:mt-5 ml-2">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Size Guides</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage product specific size charts</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Creator */}
                <div ref={scrollRef} className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Ruler className="w-5 h-5 text-[#ff6a00]" /> Create / Edit Guide
                    </h2>

                    <div className="mb-6">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Select Product</label>
                        <select
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#ff6a00] outline-none font-bold"
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(Number(e.target.value))}
                        >
                            <option value="">Choose a product...</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="overflow-x-auto mb-6">
                        <table className="w-full border-collapse">
                            <tbody>
                                {tableData.map((row, rIdx) => (
                                    <tr key={rIdx}>
                                        {row.map((cell, cIdx) => (
                                            <td key={cIdx} className="p-1">
                                                <input
                                                    type="text"
                                                    className={`w-full p-2 text-center text-sm rounded-lg border transition-all outline-none ${rIdx === 0
                                                        ? 'bg-gray-900 text-white font-bold border-gray-800'
                                                        : 'bg-white text-gray-800 border-orange-200 hover:border-orange-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10'
                                                        }`}
                                                    value={cell}
                                                    onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                                                />
                                            </td>
                                        ))}
                                        {rIdx > 0 && (
                                            <td className="p-1">
                                                <button onClick={() => removeRow(rIdx)} className="p-2 text-red-400 hover:text-red-600">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button onClick={addRow} className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">Add Row</button>
                        <button onClick={addCol} className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">Add Column</button>
                        <button onClick={removeCol} className="px-4 py-2 border border-red-100 text-red-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-all">Remove Col</button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="ml-auto px-8 py-3 bg-[#ff6a00] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#ff8533] transition-all shadow-lg active:scale-95 flex items-center gap-2"
                        >
                            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Guide
                        </button>
                    </div>
                </div>

                {/* List - Now Sticky & Independent */}
                <div className="lg:sticky lg:top-24 h-fit space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Existing Guides</h3>
                    <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                        {loading ? (
                            <div className="flex justify-center py-10"><Loader className="w-6 h-6 animate-spin text-[#ff6a00]" /></div>
                        ) : guides.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">No guides created yet.</p>
                        ) : (
                            guides.map(g => (
                                <div key={g.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group">
                                    <div>
                                        <p className="font-bold text-gray-900 group-hover:text-[#ff6a00] transition-colors">{g.products?.name}</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">ID: {g.product_id}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedProduct(g.product_id);
                                                setTableData(g.content);
                                                scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all outline-none"
                                        >
                                            <Save className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setConfirmDelete(g.id)}
                                            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all outline-none"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Custom Confirm Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300 text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Delete Guide?</h3>
                        <p className="text-gray-500 text-sm font-medium mb-8">This action cannot be undone. Are you sure you want to proceed?</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(confirmDelete)}
                                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-200 transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
