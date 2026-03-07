import { useState, useRef, useEffect } from 'react';
import { fetchApi } from '../../../lib/api/client';

// ---------- Types ----------
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
  source?: string | null;
}

interface MatchResult {
  score: number;
  explanation: string;
  ad: AvailableAd;
}

interface SearchResponse {
  matches: MatchResult[];
}

type ChatMessage =
  | { role: 'user'; text: string }
  | { role: 'bot'; type: 'text'; text: string }
  | { role: 'bot'; type: 'results'; matches: MatchResult[]; query: string }
  | { role: 'bot'; type: 'error'; text: string };

// ---------- Helpers ----------
const fmt = (v: string | number | null | undefined, fb = 'N/A') =>
  v != null && v !== '' ? String(v) : fb;

const fmtRent = (ad: AvailableAd) => {
  if (ad.rent_max) return `Rs. ${ad.rent_max.toLocaleString()}`;
  if (ad.rent_min) return `Rs. ${ad.rent_min.toLocaleString()}`;
  return 'N/A';
};

// ---------- Sub-components ----------
function MatchCard({ match }: { match: MatchResult }) {
  const { ad, score } = match;
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between bg-gradient-to-r from-[#6C63FF]/5 to-transparent border-b border-gray-100 px-4 py-3">
        <div>
          <h4 className="font-bold text-gray-900 capitalize text-sm">
            {fmt(ad.property_type, 'Property')} — {fmt(ad.city, 'Unknown')}
            {ad.area ? `, ${ad.area}` : ''}
          </h4>
          {ad.source && <p className="text-[10px] text-gray-400 mt-0.5">Source: {ad.source}</p>}
        </div>
        <span className="text-sm font-bold bg-[#6C63FF] text-white px-2.5 py-1 rounded-full ml-3 whitespace-nowrap">
          {Math.round(score)}%
        </span>
      </div>

      {/* Details */}
      <div className="px-4 py-3 grid grid-cols-2 gap-3">
        {[
          { label: 'Rent', value: `${fmtRent(ad)}/mo` },
          { label: 'Contact', value: ad.contact_phone ? undefined : fmt(ad.contact_whatsapp, 'N/A'),
            link: ad.contact_phone ? { href: `tel:${ad.contact_phone}`, text: ad.contact_phone } : undefined },
          { label: 'Occupants', value: ad.people_count ? `${ad.people_count} person(s)` : 'N/A' },
          { label: 'For', value: fmt(ad.gender_preference, 'Any') },
          { label: 'Rooms', value: fmt(ad.rooms) },
          { label: 'Bathrooms', value: fmt(ad.bathrooms) },
        ].map(({ label, value, link }) => (
          <div key={label}>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
            {link
              ? <a href={link.href} className="text-sm font-semibold text-[#6C63FF] underline">{link.text}</a>
              : <p className="text-sm font-semibold text-gray-800">{value}</p>}
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
        {ad.attached_bathroom && <Badge color="violet">Attached Bathroom</Badge>}
        {ad.separate_entrance && <Badge color="violet">Separate Entrance</Badge>}
        {ad.furnished_status && <Badge color="green">Furnished</Badge>}
        {ad.parking_available === true && <Badge color="green">Parking</Badge>}
        {ad.parking_available === false && <Badge color="red">No Parking</Badge>}
      </div>

      {/* Notes */}
      {ad.special_notes && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Notes</p>
          <p className="text-xs text-gray-600 leading-relaxed">{ad.special_notes}</p>
        </div>
      )}
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: 'violet' | 'green' | 'red' }) {
  const cls = {
    violet: 'bg-[#6C63FF]/10 text-[#5B52D6] border-[#6C63FF]/20',
    green:  'bg-emerald-50 text-emerald-700 border-emerald-100',
    red:    'bg-red-50 text-red-600 border-red-100',
  }[color];
  return (
    <span className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${cls}`}>{children}</span>
  );
}

function ThinkingDots() {
  return (
    <div className="flex gap-1 items-center px-4 py-3">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-[#6C63FF]/50"
          style={{ animation: `bounce 1s ${i * 0.18}s infinite` }}
        />
      ))}
      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }`}</style>
    </div>
  );
}

// ---------- Main Panel ----------
export function ChatSearchPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'bot',
      type: 'text',
      text: "👋 Hi! I'm your AI Rental Assistant. Tell me what you're looking for — try something like *\"annex in Maharagama for couple, budget 30000\"* and I'll find the best matches for you!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setLoading(true);

    try {
      const data = await fetchApi<SearchResponse>('/search/query', {
        method: 'POST',
        body: JSON.stringify({ query: q }),
      });

      if (data.matches.length === 0) {
        setMessages(prev => [
          ...prev,
          { role: 'bot', type: 'text', text: "I couldn't find any matching rentals for that query. Try adjusting your budget, location, or property type." },
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'bot', type: 'results', matches: data.matches, query: q },
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'bot', type: 'error', text: 'Something went wrong. The AI service may be busy — please try again in a moment.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-65px)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-4">
        {messages.map((msg, i) => {
          if (msg.role === 'user') {
            return (
              <div key={i} className="flex justify-end fade-up">
                <div className="max-w-[75%] bg-[#6C63FF] text-white px-4 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed shadow-sm">
                  {msg.text}
                </div>
              </div>
            );
          }

          return (
            <div key={i} className="flex justify-start items-start gap-3 fade-up">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] flex items-center justify-center flex-shrink-0 shadow mt-0.5">
                <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </svg>
              </div>

              <div className="max-w-[80%] space-y-3">
                {msg.type === 'text' && (
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-800 leading-relaxed shadow-sm">
                    {msg.text}
                  </div>
                )}
                {msg.type === 'error' && (
                  <div className="bg-red-50 border border-red-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-red-700 leading-relaxed">
                    ⚠️ {msg.text}
                  </div>
                )}
                {msg.type === 'results' && (
                  <div className="space-y-3">
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-800 shadow-sm">
                      Found <span className="font-bold text-[#6C63FF]">{msg.matches.length}</span> match{msg.matches.length > 1 ? 'es' : ''} for "<span className="italic">{msg.query}</span>"
                    </div>
                    {msg.matches.map((m, j) => (
                      <MatchCard key={j} match={m} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-start gap-3 fade-up">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#A78BFA] flex items-center justify-center shadow mt-0.5">
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              </svg>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm">
              <ThinkingDots />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-gray-100 bg-white px-4 sm:px-8 py-4">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:border-[#6C63FF] focus-within:ring-2 focus-within:ring-[#6C63FF]/10 transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-400 flex-shrink-0">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
              placeholder="e.g. annex in Hokandara for couple, budget 25000…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              disabled={loading}
            />
          </div>
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="w-11 h-11 bg-[#6C63FF] hover:bg-[#5B52D6] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all duration-150 shadow-md shadow-[#6C63FF]/30 flex-shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4 rotate-45">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-300 mt-2">Press Enter to send · AI matches are based on your database</p>
      </div>
    </div>
  );
}
