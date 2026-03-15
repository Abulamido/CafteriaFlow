'use client';
import { useState, useEffect } from 'react';

export default function MenuEditor() {
    const [tenantId, setTenantId] = useState('');
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');

    const fetchMenu = async () => {
        if (!tenantId) return;
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/api/tenants/${tenantId}/menu`);
            if (res.ok) {
                setItems(await res.json());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const addItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tenantId) return alert('Enter Tenant ID first');

        try {
            const res = await fetch(`http://localhost:8000/api/tenants/${tenantId}/menu`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ item_name: newItemName, price: parseFloat(newItemPrice) })
            });
            if (res.ok) {
                setNewItemName('');
                setNewItemPrice('');
                fetchMenu();
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 mt-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Enter Your Tenant ID to manage menu</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border"
                        value={tenantId}
                        onChange={(e) => setTenantId(e.target.value)}
                        placeholder="UUID..."
                    />
                </div>
                <button onClick={fetchMenu} className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">
                    Load Menu
                </button>
            </div>

            {tenantId && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-8">

                    <div className="col-span-1 space-y-4 border-r pr-6">
                        <h3 className="text-lg font-bold text-gray-900">Add New Item</h3>
                        <form onSubmit={addItem} className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-600">Item Name</label>
                                <input required type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} className="w-full border p-2 rounded mt-1" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Price ($)</label>
                                <input required type="number" step="0.01" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} className="w-full border p-2 rounded mt-1" />
                            </div>
                            <button type="submit" className="w-full bg-indigo-50 text-indigo-700 font-medium p-2 rounded hover:bg-indigo-100 border border-indigo-200">
                                + Add Item
                            </button>
                        </form>
                    </div>

                    <div className="col-span-2">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Current Menu</h3>
                        {loading ? <p>Loading...</p> : (
                            items.length === 0 ? <p className="text-gray-500 italic">No items found.</p> : (
                                <ul className="divide-y border rounded">
                                    {items.map((item, idx) => (
                                        <li key={idx} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                            <span className="font-medium text-gray-800">{item.item_name}</span>
                                            <span className="text-gray-600">${item.price.toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
