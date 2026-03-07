import { useState } from 'react';
import { fetchApi } from '../../../lib/api/client';

type PreviewData = Record<string, unknown>;
interface PreviewResponse { extracted_data: PreviewData; }

function Field({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  const displayLabel = label.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {displayLabel}
      </label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] transition-all"
      />
    </div>
  );
}

export function AvailableAdPanel() {
  const [rawText, setRawText] = useState('');
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleExtract = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const data = await fetchApi<PreviewResponse>('/extraction/available/preview', {
        method: 'POST',
        body: JSON.stringify({ raw_text: rawText, ad_type: 'AVAILABLE' }),
      });
      setPreviewData(data.extracted_data);
    } catch {
      alert('Could not extract data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetchApi('/available-ads/', {
        method: 'POST',
        body: JSON.stringify({ raw_text: rawText, ...previewData }),
      });
      setSaved(true);
      setRawText('');
      setPreviewData(null);
    } catch {
      alert('Failed to save ad. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key: string, val: string) =>
    setPreviewData(prev => prev ? { ...prev, [key]: val } : prev);

  // Fields to hide from the editable preview (system-managed)
  const HIDDEN = ['raw_text', 'normalized_text', 'nearby_places', 'facilities_json'];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Add Available Rental</h2>
        <p className="text-sm text-gray-400 mt-1">Paste a raw rental ad — our AI will extract and structure all the details.</p>
      </div>

      {/* Paste box */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#6C63FF]" />
          <span className="text-sm font-semibold text-gray-700">Raw Ad Text</span>
        </div>
        <div className="p-5">
          <textarea
            rows={8}
            value={rawText}
            onChange={e => setRawText(e.target.value)}
            placeholder="Paste the rental ad here exactly as copied — including typos, slang, and all…"
            className="w-full text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] transition-all placeholder-gray-300"
          />
          <button
            onClick={handleExtract}
            disabled={loading || !rawText.trim()}
            className="mt-3 w-full bg-[#6C63FF] hover:bg-[#5B52D6] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all duration-150 shadow-md shadow-[#6C63FF]/20 text-sm"
          >
            {loading && !previewData ? '✨ Extracting with AI…' : '✨ Extract with AI'}
          </button>
        </div>
      </div>

      {/* Success toast */}
      {saved && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 fade-up">
          <span className="text-emerald-600">✅</span>
          <p className="text-sm text-emerald-700 font-medium">Ad saved successfully to the database!</p>
        </div>
      )}

      {/* Extracted preview */}
      {previewData && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden fade-up">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-gray-700">Extracted Data — Review &amp; Edit</span>
            </div>
            <span className="text-xs text-gray-400">All fields editable</span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(previewData)
                .filter(k => !HIDDEN.includes(k))
                .map(key => (
                  <Field
                    key={key}
                    label={key}
                    value={
                      previewData[key] === null
                        ? ''
                        : typeof previewData[key] === 'object'
                        ? JSON.stringify(previewData[key])
                        : String(previewData[key])
                    }
                    onChange={val => updateField(key, val)}
                  />
                ))}
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all duration-150 shadow-md shadow-emerald-500/20 text-sm"
            >
              {loading ? 'Saving…' : '💾 Save Ad to Database'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
