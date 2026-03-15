'use client';
import { useState, useEffect } from 'react';

export default function OrdersDashboard() {
    const [tenantId, setTenantId] = useState('');
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        if (!tenantId) return;
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/api/tenants/${tenantId}/orders`);
            if (res.ok) {
                setOrders(await res.json());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    return (
        <div className="max-w-6xl mx-auto space-y-8 mt-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Tenant ID to view Orders</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border"
                        value={tenantId}
                        onChange={(e) => setTenantId(e.target.value)}
                        placeholder="UUID..."
                    />
                </div>
                <button onClick={fetchOrders} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">
                    Refresh Orders
                </button>
            </div>

            {tenantId && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="col-span-1 border rounded-xl p-6 bg-white shadow-sm flex flex-col justify-center items-center">
                        <h4 className="text-gray-500 font-medium">Total Orders</h4>
                        <p className="text-4xl font-extrabold text-gray-900 mt-2">{orders.length}</p>
                    </div>

                    <div className="col-span-1 border rounded-xl p-6 bg-white shadow-sm flex flex-col justify-center items-center">
                        <h4 className="text-gray-500 font-medium">Total Revenue</h4>
                        <p className="text-4xl font-extrabold text-green-600 mt-2">${totalRevenue.toFixed(2)}</p>
                    </div>

                    <div className="col-span-1 md:col-span-2 border rounded-xl p-6 bg-white shadow-sm">
                        <h4 className="text-gray-800 font-bold mb-4">Recent Orders</h4>
                        {loading ? <p>Loading...</p> : (
                            orders.length === 0 ? <p className="text-gray-500 italic">No orders yet.</p> : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                                        <thead className="uppercase tracking-wider border-b border-gray-200 bg-gray-50 text-gray-500">
                                            <tr>
                                                <th className="px-4 py-3">Order ID</th>
                                                <th className="px-4 py-3">Customer Phone</th>
                                                <th className="px-4 py-3">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {orders.slice(0, 10).map((order, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-medium text-indigo-600 truncate max-w-[120px]" title={order.id}>{order.id}</td>
                                                    <td className="px-4 py-3 text-gray-700">{order.customer_phone}</td>
                                                    <td className="px-4 py-3 font-bold text-gray-900">${order.total.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
