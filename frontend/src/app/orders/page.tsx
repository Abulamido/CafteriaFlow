'use client';
import { useState } from 'react';

export default function OrdersDashboard() {
    const [tenantId, setTenantId] = useState('');
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const fetchOrders = async () => {
        if (!tenantId) return;
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/api/tenants/${tenantId}/orders`);
            if (res.ok) {
                setOrders(await res.json());
                setIsLoaded(true);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Orders & Analytics</h1>
                <p className="mt-1 text-slate-500">Monitor incoming WhatsApp orders and review AI performance metrics.</p>
            </div>

            {/* Tenant Verification Bar */}
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
                        onClick={fetchOrders}
                        disabled={loading || !tenantId}
                        className="w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all font-semibold flex items-center justify-center whitespace-nowrap"
                    >
                        {loading && <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                        {loading ? 'Syncing...' : 'Sync Data'}
                    </button>
                </div>
            </div>

            {isLoaded && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Top Level Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm flex items-center">
                            <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mr-5">
                                <svg className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Orders</h4>
                                <p className="text-3xl font-extrabold text-slate-900 mt-1">{orders.length}</p>
                            </div>
                        </div>

                        <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm flex items-center relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full blur-2xl opacity-60"></div>
                            <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mr-5 relative z-10">
                                <svg className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</h4>
                                <p className="text-3xl font-extrabold text-emerald-600 mt-1">${totalRevenue.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm flex items-center">
                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mr-5">
                                <svg className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">AI Success Rate</h4>
                                <p className="text-3xl font-extrabold text-slate-900 mt-1">100%</p>
                                <p className="text-xs text-slate-400 mt-1">Zero human handoffs needed</p>
                            </div>
                        </div>
                    </div>

                    {/* Orders Data Table */}
                    <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                            <h4 className="text-lg font-bold text-slate-900">Recent Completed Orders</h4>
                        </div>

                        {orders.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center justify-center">
                                <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                <h3 className="text-sm font-medium text-slate-900">No orders recorded yet.</h3>
                                <p className="mt-1 text-sm text-slate-500">When your WhatsApp bot takes orders, they will appear here.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto min-h-[400px]">
                                <table className="min-w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th scope="col" className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider">Order Reference ID</th>
                                            <th scope="col" className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider">Customer Contact</th>
                                            <th scope="col" className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                            <th scope="col" className="px-6 py-4 text-right font-semibold text-slate-500 uppercase tracking-wider">Transaction Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {orders.slice().reverse().map((order, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded bg-slate-100 text-slate-500 flex items-center justify-center font-mono text-xs mr-3">
                                                            #{order.id.toString().slice(0, 4)}
                                                        </div>
                                                        <span className="font-mono text-sm text-slate-600 truncate max-w-[150px]">{order.id}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-900">
                                                    {order.customer_phone}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                                                        Completed
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="font-mono text-base font-bold text-slate-900">${order.total.toFixed(2)}</span>
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
