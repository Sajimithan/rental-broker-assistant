import { useState } from 'react';
import { fetchApi } from '../../../lib/api/client';

interface AvailableAd {
  id?: number;
  property_type?: string | null;
  city?: string | null;
  area?: string | null;
  rent_min?: number | null;
  rent_max?: number | null;
  contact_phone?: string | null;
  contact_whatsapp?: string | null;
  contact_name?: string | null;
  gender_preference?: string | null;
  rooms?: number | null;
  bathrooms?: number | null;
  people_count?: number | null;
  furnished_status?: boolean | null;
  attached_bathroom?: boolean | null;
  separate_entrance?: boolean | null;
  parking_available?: boolean | null;
  special_notes?: string | null;
  status?: string;
  source?: string | null;
}

interface MatchResult {
  score: number;
  explanation: string;
  ad: AvailableAd;
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
      alert('Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (val: string | number | null | undefined, fallback = 'N/A') =>
    val != null && val !== '' ? String(val) : fallback;

  const fmtRent = (ad: AvailableAd) => {
    if (ad.rent_max) return `Rs. ${ad.rent_max.toLocaleString()}`;
    if (ad.rent_min) return `Rs. ${ad.rent_min.toLocaleString()}`;
    return 'N/A';
  };

  const fmtBool = (val: boolean | null | undefined, trueLabel = 'Yes', falseLabel = 'No') =>
    val == null ? 'N/A' : val ? trueLabel : falseLabel;

  return (
    <div className="p-4 bg-white rounded-lg shadow space-y-4">
      <h2 className="text-xl font-bold">Find a Rental</h2>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          placeholder="e.g. annex in Hokandara for couple under 25000"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="bg-green-600 text-white px-5 py-2 rounded disabled:opacity-50 font-medium"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>

      {results && (
        <div className="mt-6 space-y-4">
          {results.matches.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No matching rentals found. Try broadening your search.</p>
          ) : (
            <>
              <p className="text-sm text-gray-500">{results.matches.length} match{results.matches.length > 1 ? 'es' : ''} found</p>
              <div className="grid gap-4">
                {results.matches.map((match: MatchResult, i: number) => (
                  <div key={i} className="border rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-start bg-gray-50 border-b px-5 py-4">
                      <div>
                        <h4 className="font-bold text-lg capitalize">
                          {fmt(match.ad.property_type, 'Property')} — {fmt(match.ad.city, 'Location unknown')}
                          {match.ad.area ? `, ${match.ad.area}` : ''}
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">Source: {fmt(match.ad.source, 'unknown')}</p>
                      </div>
                      <span className="text-lg font-bold bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-full whitespace-nowrap ml-4">
                        {Math.round(match.score)}% Match
                      </span>
                    </div>

                    {/* Key Details Grid */}
                    <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Rent</p>
                        <p className="font-semibold text-gray-800">{fmtRent(match.ad)}/mo</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Contact</p>
                        <p className="font-semibold text-gray-800">
                          {match.ad.contact_phone
                            ? <a href={`tel:${match.ad.contact_phone}`} className="text-blue-600 underline">{match.ad.contact_phone}</a>
                            : fmt(match.ad.contact_whatsapp, 'Not provided')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">For</p>
                        <p className="font-semibold text-gray-800 capitalize">
                          {match.ad.people_count ? `${match.ad.people_count} person(s) · ` : ''}
                          {fmt(match.ad.gender_preference, 'Any')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Rooms</p>
                        <p className="font-semibold text-gray-800">{fmt(match.ad.rooms)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Bathrooms</p>
                        <p className="font-semibold text-gray-800">{fmt(match.ad.bathrooms)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Furnished</p>
                        <p className="font-semibold text-gray-800">{fmtBool(match.ad.furnished_status)}</p>
                      </div>
                    </div>

                    {/* Feature Badges */}
                    <div className="px-5 pb-4 flex flex-wrap gap-2">
                      {match.ad.attached_bathroom && <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">Attached Bath</span>}
                      {match.ad.separate_entrance && <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">Separate Entrance</span>}
                      {match.ad.parking_available === false && <span className="text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full">No Parking</span>}
                      {match.ad.parking_available === true && <span className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full">Parking</span>}
                    </div>

                    {/* Notes */}
                    {match.ad.special_notes && (
                      <div className="px-5 pb-5 border-t pt-3">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Notes</p>
                        <p className="text-sm text-gray-700">{match.ad.special_notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
