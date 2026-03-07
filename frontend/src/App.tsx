import { useState } from 'react';
import { AvailableAdPanel } from './features/available-ads/components/AvailableAdPanel';
import { NeededAdPanel } from './features/needed-ads/components/NeededAdPanel';
import { ChatSearchPanel } from './features/search-match/components/ChatSearchPanel';

type View = 'search' | 'available' | 'needed';

const NAV = [
  {
    id: 'search' as View,
    label: 'Find a Rental',
    sub: 'AI-powered search',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
  },
  {
    id: 'available' as View,
    label: 'Add Available Ad',
    sub: 'Rental listing',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: 'needed' as View,
    label: 'Add Needed Ad',
    sub: 'Finding a place',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

export default function App() {
  const [view, setView] = useState<View>('search');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-full min-h-screen bg-[#F8F9FD]">
      {/* ── Sidebar ── */}
      <>
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-20 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <aside
          className={`
            fixed top-0 left-0 h-full z-30 flex flex-col
            bg-[#1C1D2E] text-white transition-transform duration-300
            w-[260px]
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 lg:relative lg:z-auto
          `}
        >
          {/* Brand */}
          <div className="px-6 pt-8 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm leading-tight">Evaluno AI</p>
                <p className="text-[10px] text-white/40 leading-tight">Rental Broker Assistant</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-5 space-y-1">
            {NAV.map(item => (
              <button
                key={item.id}
                onClick={() => { setView(item.id); setMobileOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150
                  ${view === item.id
                    ? 'bg-[#6C63FF] text-white shadow-md shadow-[#6C63FF]/30'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'}
                `}
              >
                <span className={view === item.id ? 'text-white' : 'text-white/40'}>{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold leading-tight">{item.label}</p>
                  <p className="text-[10px] opacity-60 leading-tight">{item.sub}</p>
                </div>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-6 py-5 border-t border-white/10">
            <p className="text-[10px] text-white/30 leading-relaxed">
              © 2025 Evaluno AI<br/>
              All rights reserved
            </p>
          </div>
        </aside>
      </>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
          {/* Hamburger (mobile) */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-600">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              {NAV.find(n => n.id === view)?.label}
            </h1>
            <p className="text-xs text-gray-400">{NAV.find(n => n.id === view)?.sub}</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              AI Online
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {view === 'search'    && <ChatSearchPanel />}
          {view === 'available' && <AvailableAdPanel />}
          {view === 'needed'    && <NeededAdPanel />}
        </main>
      </div>
    </div>
  );
}
