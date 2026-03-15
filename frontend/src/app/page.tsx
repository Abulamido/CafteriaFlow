import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="mt-1 text-slate-500">Manage your multi-tenant WhatsApp ordering AI across multiple restaurants.</p>
        </div>
        <div className="hidden sm:block">
          <Link href="/onboarding" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Tenant
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="bg-white overflow-hidden shadow-sm shadow-slate-200/50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="w-12 h-12 flex-shrink-0 bg-indigo-50 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Total Tenants</dt>
                  <dd>
                    <div className="text-2xl font-bold text-slate-900">12</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white overflow-hidden shadow-sm shadow-slate-200/50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="w-12 h-12 flex-shrink-0 bg-emerald-50 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Monthly Orders</dt>
                  <dd>
                    <div className="text-2xl font-bold text-slate-900">4,821</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white overflow-hidden shadow-sm shadow-slate-200/50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="w-12 h-12 flex-shrink-0 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">AI Resolution Rate</dt>
                  <dd>
                    <div className="text-2xl font-bold text-slate-900">98.2%</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white overflow-hidden shadow-sm shadow-slate-200/50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="w-12 h-12 flex-shrink-0 bg-fuchsia-50 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Messages Processed</dt>
                  <dd>
                    <div className="text-2xl font-bold text-slate-900">14.2k</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <h2 className="text-lg font-semibold text-slate-800 mt-10 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/onboarding" className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
          <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Onboard New Restaurant</h3>
          <p className="text-slate-500 text-sm">Create a tenant profile and scan the Evolution WhatsApp QR code.</p>
        </Link>

        <Link href="/menu" className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
          <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Menu Editor</h3>
          <p className="text-slate-500 text-sm">Configure items and categories for the AI to recommend and parse.</p>
        </Link>

        <Link href="/orders" className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
          <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Analytics & Performance</h3>
          <p className="text-slate-500 text-sm">View real-time incoming orders, bot resolution rates, and revenue.</p>
        </Link>
      </div>
    </div>
  );
}
