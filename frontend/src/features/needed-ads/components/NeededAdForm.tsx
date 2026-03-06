import { useState } from 'react';
import { fetchApi } from '../../../lib/api/client';

type PreviewData = Record<string, unknown>;

interface PreviewResponse {
  extracted_data: PreviewData;
}

export function NeededAdForm() {
  const [rawText, setRawText] = useState('');
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExtract = async () => {
    setLoading(true);
    try {
      const data = await fetchApi<PreviewResponse>('/extraction/needed/preview', {
        method: 'POST',
        body: JSON.stringify({ raw_text: rawText, ad_type: 'NEEDED' }),
      });
      setPreviewData(data.extracted_data);
    } catch (error) {
      console.error(error);
      alert('Failed to extract data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetchApi('/needed-ads/', {
        method: 'POST',
        body: JSON.stringify({ raw_text: rawText, ...previewData }),
      });
      alert('Ad saved successfully!');
      setRawText('');
      setPreviewData(null);
    } catch (error) {
      console.error(error);
      alert('Failed to save ad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow space-y-4">
      <h2 className="text-xl font-bold">Paste Rental Needed Request</h2>
      <textarea
        className="w-full p-2 border rounded font-mono text-sm"
        rows={6}
        placeholder="Paste raw request text here..."
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
      />
      <div className="flex gap-2">
        <button 
          onClick={handleExtract} 
          disabled={loading || !rawText}
          className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Extract Fields'}
        </button>
      </div>

      {previewData && (
        <div className="mt-8 border-t pt-4 space-y-4">
          <h3 className="font-semibold text-lg">Extracted Data Preview (Editable)</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(previewData).map(key => (
              <div key={key} className="flex flex-col">
                <label className="text-sm text-gray-600">{key}</label>
                <input
                  type="text"
                  className="border p-1 rounded"
                  value={previewData[key] === null ? '' : typeof previewData[key] === 'object' ? JSON.stringify(previewData[key]) : String(previewData[key])}
                  onChange={(e) => setPreviewData({...previewData, [key]: e.target.value})}
                />
              </div>
            ))}
          </div>
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 w-full mt-4"
          >
            Save Ad
          </button>
        </div>
      )}
    </div>
  );
}
