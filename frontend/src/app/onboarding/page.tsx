'use client';
import { useState } from 'react';

export default function Onboarding() {
    const [tenantName, setTenantName] = useState('');
    const [tenantId, setTenantId] = useState<string | null>(null);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const registerTenant = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/tenants', {
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
            setTimeout(async () => {
                const res = await fetch(`/api/tenants/${id}/qr`);
                if (res.ok) {
                    const data = await res.json();
                    setQrCode(data.qr?.base64 || 'mock');
                }
            }, 2000);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Vendor Onboarding</h1>
                <p className="mt-1 text-slate-500">Create a new restaurant instance and link it to WhatsApp.</p>
            </div>

            <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8">
                    {!tenantId ? (
                        <form onSubmit={registerTenant} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Restaurant Instance Name</label>
                                <input
                                    type="text"
                                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border transition-colors bg-slate-50 focus:bg-white"
                                    value={tenantName}
                                    onChange={(e) => setTenantName(e.target.value)}
                                    placeholder="e.g. marios_pizza"
                                    required
                                />
                                <p className="mt-2 text-xs text-slate-500">A unique identifier for your WhatsApp bot instance. No spaces.</p>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Provisioning AI Instance...
                                    </span>
                                ) : 'Create Bot Instance'}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-2">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Instance Created!</h2>
                                <p className="text-slate-500 mt-2">Scan this QR code with your restaurant's WhatsApp device to connect.</p>
                            </div>

                            <div className="flex justify-center py-6">
                                {qrCode ? (
                                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm inline-block">
                                        {qrCode.includes("mock") || qrCode === 'mock' ? (
                                            <div className="w-64 h-64 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400">
                                                <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                                                <span className="text-sm font-medium">Evolution API Active</span>
                                            </div>
                                        ) : (
                                            <img src={`data:image/png;base64,${qrCode}`} alt="WhatsApp QR Code" className="w-64 h-64 rounded-lg mix-blend-multiply" />
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-64 h-64 mx-auto bg-slate-50 animate-pulse rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                                        <span className="text-slate-500 text-sm font-medium">Fetching QR Payload...</span>
                                    </div>
                                )}
                            </div>

                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-left">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Your Tenant ID (Secret)</p>
                                <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3">
                                    <code className="text-sm text-indigo-600 font-mono break-all">{tenantId}</code>
                                    <button className="text-slate-400 hover:text-indigo-600 transition-colors" onClick={() => navigator.clipboard.writeText(tenantId)}>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 mt-3">You will need this ID to manage your menu and view analytics.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
