import { useState, useEffect } from 'react';
import { fetchApi } from '../../../lib/api/client';

// ---- Types ----
interface NeedSummary {
  id: number;
  city?: string | null;
  area?: string | null;
  property_type?: string | null;
  rent_min?: number | null;
  rent_max?: number | null;
  gender_preference?: string | null;
  people_count?: number | null;
  contact_phone?: string | null;
  contact_whatsapp?: string | null;
  special_notes?: string | null;
  raw_text: string;
}

interface AvailableAd {
  id?: number;
  property_type?: string | null;
  city?: string | null;
  area?: string | null;
  rent_min?: number | null;
  rent_max?: number | null;
  contact_phone?: string | null;
  contact_whatsapp?: string | null;
  gender_preference?: string | null;
  rooms?: number | null;
  people_count?: number | null;
  attached_bathroom?: boolean | null;
  separate_entrance?: boolean | null;
  parking_available?: boolean | null;
  furnished_status?: boolean | null;
  special_notes?: string | null;
  source?: string | null;
}

interface MatchEntry {
  score: number;
  explanation: string;
  ad: AvailableAd;
}

interface Pair {
  needed: NeedSummary;
  top_matches: MatchEntry[];
  total_matches: number;
}

interface AllMatchesResponse {
  pairs: Pair[];
  total_needed: number;
  total_available: number;
}

// ---- Helper ----
const fmt = (v: string | number | null | undefined, fb = 'N/A') =>
  v != null && v !== '' ? String(v) : fb;

const fmtRent = (min?: number | null, max?: number | null) => {
  if (max) return `Rs. ${max.toLocaleString()}`;
  if (min) return `Rs. ${min.toLocaleString()}`;
  return 'N/A';
};

function ScoreBadge({ score }: { score: number }) {
  const pct = Math.round(score);
  const color = pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-[#6C63FF]' : 'bg-amber-400';
  return (
    <span className={`text-[11px] font-bold text-white px-2 py-0.5 rounded-full ${color} whitespace-nowrap`}>
      {pct}%
    </span>
  );
}

// ---- Main Component ----
export function MatchingDashboard() {
  const [data, setData] = useState<AllMatchesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Pair | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi<AllMatchesResponse>('/matching/all');
      setData(res);
      if (res.pairs.length > 0) setSelected(res.pairs[0]);
    } catch {
      setError('Failed to load matches. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-32 text-gray-400">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#6C63FF]/30 border-t-[#6C63FF] rounded-full animate-spin mx-auto" />
          <p className="text-sm">Cross-matching all ads…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <div className="text-center space-y-3">
          <p className="text-red-500 text-sm">{error}</p>
          <button onClick={load} className="text-sm text-[#6C63FF] underline">Try again</button>
        </div>
      </div>
    );
  }

  if (!data || data.pairs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <div className="text-center space-y-2">
          <p className="text-2xl">🔍</p>
          <p className="text-gray-500 text-sm font-medium">No needed ads in the database yet.</p>
          <p className="text-gray-400 text-xs">Add a "Rental Needed" request first, then come back here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-full overflow-hidden">

      {/* ── LEFT: Needed Ads list ── */}
      <div className="w-[340px] flex-shrink-0 border-r border-gray-100 bg-white flex flex-col">
        <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Rental Needed</h3>
            <p className="text-xs text-gray-400 mt-0.5">{data.total_needed} request{data.total_needed !== 1 ? 's' : ''} · {data.total_available} available</p>
          </div>
          <button onClick={load} title="Refresh" className="text-gray-400 hover:text-[#6C63FF] transition-colors p-1 rounded-lg hover:bg-gray-50">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {data.pairs.map(pair => (
            <button
              key={pair.needed.id}
              onClick={() => setSelected(pair)}
              className={`w-full text-left px-4 py-3 transition-all duration-100 ${
                selected?.needed.id === pair.needed.id
                  ? 'bg-[#6C63FF]/5 border-l-2 border-[#6C63FF]'
                  : 'hover:bg-gray-50 border-l-2 border-transparent'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate capitalize">
                    {fmt(pair.needed.property_type, 'Any type')} · {fmt(pair.needed.city, 'Any city')}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    Budget: {fmtRent(pair.needed.rent_min, pair.needed.rent_max)}
                    {pair.needed.gender_preference ? ` · ${pair.needed.gender_preference}` : ''}
                  </p>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${
                  pair.total_matches > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'
                }`}>
                  {pair.total_matches} match{pair.total_matches !== 1 ? 'es' : ''}
                </span>
              </div>
              {pair.needed.contact_phone && (
                <p className="text-[11px] text-[#6C63FF] mt-1">📞 {pair.needed.contact_phone}</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Available Matches ── */}
      <div className="flex-1 overflow-y-auto bg-[#F8F9FD] px-6 py-6">
        {selected ? (
          <div className="max-w-2xl space-y-5">
            {/* Needed summary card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Looking For</p>
                  <h3 className="text-base font-bold text-gray-900 capitalize">
                    {fmt(selected.needed.property_type, 'Any type')} in {fmt(selected.needed.city, 'any city')}
                    {selected.needed.area ? `, ${selected.needed.area}` : ''}
                  </h3>
                </div>
                <span className="text-xs bg-violet-50 text-violet-700 border border-violet-100 px-2 py-1 rounded-full">
                  Needed
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div><span className="text-gray-400">Budget:</span> <span className="font-medium">{fmtRent(selected.needed.rent_min, selected.needed.rent_max)}</span></div>
                <div><span className="text-gray-400">For:</span> <span className="font-medium capitalize">{fmt(selected.needed.gender_preference, 'Any')}{selected.needed.people_count ? ` · ${selected.needed.people_count}p` : ''}</span></div>
                <div><span className="text-gray-400">Contact:</span>{' '}
                  {selected.needed.contact_phone
                    ? <a href={`tel:${selected.needed.contact_phone}`} className="font-medium text-[#6C63FF] underline">{selected.needed.contact_phone}</a>
                    : <span className="font-medium">{fmt(selected.needed.contact_whatsapp, 'N/A')}</span>}
                </div>
              </div>
              {selected.needed.special_notes && (
                <p className="mt-3 pt-3 border-t border-gray-50 text-xs text-gray-500 italic">{selected.needed.special_notes}</p>
              )}
            </div>

            {/* Match results */}
            {selected.total_matches === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-3xl mb-2">😕</p>
                <p className="text-sm font-medium">No matching available ads found.</p>
                <p className="text-xs mt-1">Add more available ads to improve matches.</p>
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold text-gray-700">
                  Top {selected.top_matches.length} Available Match{selected.top_matches.length !== 1 ? 'es' : ''}
                </p>
                <div className="space-y-4">
                  {selected.top_matches.map((m, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden fade-up">
                      {/* Match header */}
                      <div className="flex items-start justify-between bg-gradient-to-r from-[#6C63FF]/5 to-transparent px-5 py-3 border-b border-gray-100">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 capitalize">
                            #{i + 1} · {fmt(m.ad.property_type, 'Property')} — {fmt(m.ad.city, 'Unknown')}
                            {m.ad.area ? `, ${m.ad.area}` : ''}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">{m.explanation}</p>
                        </div>
                        <ScoreBadge score={m.score} />
                      </div>

                      {/* Details */}
                      <div className="px-5 py-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div><span className="text-gray-400">Rent:</span> <span className="font-medium">{fmtRent(m.ad.rent_min, m.ad.rent_max)}/mo</span></div>
                        <div>
                          <span className="text-gray-400">Contact:</span>{' '}
                          {m.ad.contact_phone
                            ? <a href={`tel:${m.ad.contact_phone}`} className="font-medium text-[#6C63FF] underline">{m.ad.contact_phone}</a>
                            : <span className="font-medium">{fmt(m.ad.contact_whatsapp, 'N/A')}</span>}
                        </div>
                        <div><span className="text-gray-400">For:</span> <span className="font-medium capitalize">{fmt(m.ad.gender_preference, 'Any')}</span></div>
                        <div><span className="text-gray-400">Rooms:</span> <span className="font-medium">{fmt(m.ad.rooms)}</span></div>
                        <div><span className="text-gray-400">People:</span> <span className="font-medium">{fmt(m.ad.people_count)}</span></div>
                        <div><span className="text-gray-400">Source:</span> <span className="font-medium capitalize">{fmt(m.ad.source)}</span></div>
                      </div>

                      {/* Badges */}
                      <div className="px-5 pb-3 flex flex-wrap gap-1.5">
                        {m.ad.attached_bathroom && <span className="text-[10px] bg-[#6C63FF]/10 text-[#5B52D6] border border-[#6C63FF]/20 px-2 py-0.5 rounded-full">Attached Bath</span>}
                        {m.ad.separate_entrance && <span className="text-[10px] bg-[#6C63FF]/10 text-[#5B52D6] border border-[#6C63FF]/20 px-2 py-0.5 rounded-full">Separate Entrance</span>}
                        {m.ad.furnished_status && <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full">Furnished</span>}
                        {m.ad.parking_available === false && <span className="text-[10px] bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full">No Parking</span>}
                      </div>

                      {m.ad.special_notes && (
                        <div className="px-5 pb-4 border-t border-gray-50 pt-2">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Notes</p>
                          <p className="text-xs text-gray-600 leading-relaxed">{m.ad.special_notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Select a request on the left to see matches.
          </div>
        )}
      </div>
    </div>
  );
}
