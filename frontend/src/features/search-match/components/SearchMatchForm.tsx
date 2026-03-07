import { useState } from 'react';
import { fetchApi } from '../../../lib/api/client';

interface MatchResult {
  score: number;
  explanation: string;
  ad: Record<string, unknown>;
}

interface SearchResponse {
  understood_query: Record<string, unknown>;
  matches: MatchResult[];
}

export function SearchMatchForm() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await fetchApi<SearchResponse>('/search/query', {
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

          <h3 className="font-semibold text-lg border-b pb-2">Top Match</h3>
          {results.matches.length === 0 ? (
            <p className="text-gray-500">No matches found.</p>
          ) : (
            <div className="grid gap-4">
              {results.matches.map((match: MatchResult, i: number) => (
                <div key={i} className="border p-4 rounded overflow-hidden">
                  <div className="flex justify-between items-center bg-gray-50 border-b p-4 -mx-4 -mt-4 mb-4">
                    <div>
                      <h4 className="font-bold text-lg">{match.ad.property_type || 'Property'} in {match.ad.city || 'Unknown Location'}</h4>
                      <p className="text-sm font-semibold text-green-700 mt-1">{match.explanation}</p>
                    </div>
                    <div className="text-2xl font-bold bg-green-100 text-green-800 border-2 border-green-200 px-4 py-2 rounded-lg">
                      {Math.round(match.score)}% Match
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm mt-4">
                    <div><span className="text-gray-500">Rent:</span> <span className="font-medium">{match.ad.rent_max ? `Rs. ${match.ad.rent_max}` : (match.ad.rent_min ? `Rs. ${match.ad.rent_min}` : 'N/A')}</span></div>
                    <div><span className="text-gray-500">Contact:</span> <span className="font-medium">{match.ad.contact_phone || match.ad.contact_whatsapp || 'Unknown'}</span></div>
                    <div><span className="text-gray-500">Area:</span> <span className="font-medium">{match.ad.area || 'N/A'}</span></div>
                    <div><span className="text-gray-500">Rooms:</span> <span className="font-medium">{match.ad.rooms || 'N/A'}</span></div>
                    <div><span className="text-gray-500">Bathrooms:</span> <span className="font-medium">{match.ad.bathrooms || 'N/A'}</span></div>
                    <div><span className="text-gray-500">Gender Pref:</span> <span className="font-medium">{match.ad.gender_preference || 'Any'}</span></div>
                  </div>

                  {match.ad.special_notes && (
                    <div className="mt-4 pt-4 border-t text-sm">
                      <span className="text-gray-500 block mb-1">Notes:</span>
                      <p className="text-gray-800">{match.ad.special_notes}</p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t">
                     <span className="text-gray-500 text-xs block mb-2">Raw Reference Data:</span>
                     <pre className="text-xs text-gray-400 bg-gray-50 p-2 rounded overflow-auto max-h-40">
                       {JSON.stringify(match.ad, null, 2)}
                     </pre>
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
