'use client';
import { useState, useEffect } from 'react';

export default function Onboarding() {
    const [tenantName, setTenantName] = useState('');
    const [tenantId, setTenantId] = useState<string | null>(null);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const registerTenant = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/tenants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    instance_name: tenantName,
                    api_key: 'vendor_key_' + Math.random().toString(36).slice(2)
                })
            });
            if (res.ok) {
                const data = await res.json();
                setTenantId(data.id);
                fetchQrCode(data.id);
            } else {
                alert("Failed to register tenant");
            }
        } catch (error) {
            console.error(error);
            alert("API Error");
        } finally {
            setLoading(false);
        }
    };

    const fetchQrCode = async (id: string) => {
        try {
            // Simulate polling or one-time fetch wait for background task
            setTimeout(async () => {
                const res = await fetch(`http://localhost:8000/api/tenants/${id}/qr`);
                if (res.ok) {
                    const data = await res.json();
                    setQrCode(data.qr.base64);
                }
            }, 2000);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 border rounded-xl shadow-sm mt-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Vendor Onboarding</h1>

            {!tenantId ? (
                <form onSubmit={registerTenant} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Restaurant Instance Name</label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            value={tenantName}
                            onChange={(e) => setTenantName(e.target.value)}
                            placeholder="e.g. pizza_place_123"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Registering...' : 'Register Restaurant'}
                    </button>
                </form>
            ) : (
                <div className="text-center space-y-4">
                    <h2 className="text-xl font-medium text-gray-900">Scan QR Code</h2>
                    <p className="text-gray-500 text-sm">Please scan this QR code with your WhatsApp to link the restaurant bot.</p>

                    <div className="flex justify-center mt-4">
                        {qrCode ? (
                            <div className="p-4 bg-white border rounded shadow-sm inline-block">
                                {/* In a real app we'd decode base64 to an image, mocking it here */}
                                {qrCode.includes("mock") ? (
                                    <div className="w-64 h-64 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                                        [QR Code Placeholder]
                                    </div>
                                ) : (
                                    <img src={`data:image/png;base64,${qrCode}`} alt="WhatsApp QR Code" className="w-64 h-64" />
                                )}
                            </div>
                        ) : (
                            <div className="w-64 h-64 bg-gray-50 animate-pulse rounded border border-gray-200 flex items-center justify-center">
                                Generating QR...
                            </div>
                        )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm font-medium text-indigo-600">Your Tenant ID (save this):</p>
                        <code className="text-xs bg-gray-100 p-2 block mt-2 rounded break-all">{tenantId}</code>
                    </div>
                </div>
            )}
        </div>
    );
}
