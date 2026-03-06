import { useState } from 'react';
import { fetchApi } from '../../../lib/api/client';

export function SearchMatchForm() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await fetchApi<any>('/search/query', {
        method: 'POST',
        body: JSON.stringify({ query }),
      });
      setResults(data);
    } catch (error) {
      console.error(error);
      alert('Failed to search');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow space-y-4">
      <h2 className="text-xl font-bold">Chatbot-style Search</h2>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          placeholder="e.g. looking for room around Maharagama for 2 boys under 25000"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          onClick={handleSearch}
          disabled={loading || !query}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {results && (
        <div className="mt-8 space-y-4">
          <div className="bg-blue-50 p-4 rounded text-sm">
            <h3 className="font-semibold text-blue-800">Understood Request:</h3>
            <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(results.understood_query, null, 2)}</pre>
          </div>

          <h3 className="font-semibold text-lg border-b pb-2">Matching Available Ads</h3>
          {results.matches.length === 0 ? (
            <p className="text-gray-500">No matches found.</p>
          ) : (
            <div className="grid gap-4">
              {results.matches.map((match: any, i: number) => (
                <div key={i} className="border p-4 rounded flex justify-between items-center">
                  <div>
                    <h4 className="font-bold">{match.property_type || 'Property'} in {match.city || 'Unknown Location'}</h4>
                    <p className="text-sm text-gray-600">Max Rent: {match.rent}</p>
                    <p className="text-sm text-green-700 mt-1">{match.explanation}</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 border p-2 rounded">
                    {match.score}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
