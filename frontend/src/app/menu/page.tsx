'use client';
import { useState } from 'react';

export default function MenuEditor() {
    const [tenantId, setTenantId] = useState('');
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');

    const fetchMenu = async () => {
        if (!tenantId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/tenants/${tenantId}/menu`);
            if (res.ok) {
                setItems(await res.json());
                setIsLoaded(true);
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
            const res = await fetch(`/api/tenants/${tenantId}/menu`, {
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
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Menu Editor</h1>
                <p className="mt-1 text-slate-500">Add or modify items on your AI-powered restaurant menu.</p>
            </div>

            {/* Tenant Authentication Bar */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Workspace Verification</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                            </div>
                            <input
                                type="text"
                                className="pl-10 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border font-mono text-slate-600 bg-slate-50 focus:bg-white transition-colors"
                                value={tenantId}
                                onChange={(e) => setTenantId(e.target.value)}
                                placeholder="Enter your secret Tenant ID..."
                            />
                        </div>
                    </div>
                    <button
                        onClick={fetchMenu}
                        disabled={loading || !tenantId}
                        className="w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all font-semibold whitespace-nowrap"
                    >
                        {loading ? 'Accessing...' : 'Access Menu'}
                    </button>
                </div>
            </div>

            {isLoaded && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">

                    {/* Add Item Form Sidebar */}
                    <div className="lg:col-span-1 border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden h-fit">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900">Add New Item</h3>
                        </div>
                        <div className="p-6">
                            <form onSubmit={addItem} className="space-y-5">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Item Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={newItemName}
                                        onChange={e => setNewItemName(e.target.value)}
                                        placeholder="e.g. Pepperoni Pizza"
                                        className="w-full border border-slate-300 p-2.5 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block text-sm bg-slate-50 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Price ($)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-slate-500 sm:text-sm">$</span>
                                        </div>
                                        <input
                                            required
                                            type="number"
                                            step="0.01"
                                            value={newItemPrice}
                                            onChange={e => setNewItemPrice(e.target.value)}
                                            placeholder="12.99"
                                            className="pl-7 w-full border border-slate-300 p-2.5 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block text-sm bg-slate-50 focus:bg-white font-mono"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-indigo-50 text-indigo-700 font-bold p-3 rounded-lg hover:bg-indigo-100 hover:shadow-sm border border-indigo-200 transition-all">
                                    + Publish Item to AI Menu
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Menu Table */}
                    <div className="lg:col-span-2 border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900">Active Menu Configuration</h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                {items.length} Extracted Items
                            </span>
                        </div>

                        {items.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center justify-center">
                                <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                <h3 className="text-sm font-medium text-slate-900">No items configured</h3>
                                <p className="mt-1 text-sm text-slate-500">Get started by creating a new menu item.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto min-h-[400px]">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                Item Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        {items.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                                                            {item.item_name.charAt(0)}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-semibold text-slate-900">{item.item_name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-mono font-bold text-slate-700">
                                                    ${item.price.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
