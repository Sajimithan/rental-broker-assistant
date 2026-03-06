import { useState } from 'react';
import { AvailableAdForm } from './features/available-ads/components/AvailableAdForm';
import { NeededAdForm } from './features/needed-ads/components/NeededAdForm';
import { SearchMatchForm } from './features/search-match/components/SearchMatchForm';

function App() {
  const [activeTab, setActiveTab] = useState<'available' | 'needed' | 'search'>('available');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Rental Broker Assistant</h1>
          <nav className="mt-4 sm:mt-0 flex gap-4">
            <button 
              onClick={() => setActiveTab('available')}
              className={`px-3 py-2 rounded-md font-medium ${activeTab === 'available' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Rental Available
            </button>
            <button 
              onClick={() => setActiveTab('needed')}
              className={`px-3 py-2 rounded-md font-medium ${activeTab === 'needed' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Rental Needed
            </button>
            <button 
              onClick={() => setActiveTab('search')}
              className={`px-3 py-2 rounded-md font-medium ${activeTab === 'search' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Search & Match
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'available' && <AvailableAdForm />}
        {activeTab === 'needed' && <NeededAdForm />}
        {activeTab === 'search' && <SearchMatchForm />}
      </main>
    </div>
  );
}

export default App;
