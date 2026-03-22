import { useState } from 'react';
import RecentRoasts from './RecentRoasts';

function App() {
  const [input, setInput] = useState('');
  const [roast, setRoast] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshCounter, setRefreshCounter] = useState(0);

  const handleRoast = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError('');
    setRoast('');

    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Something went wrong');
      
      setRoast(data.roast);
      setRefreshCounter(prev => prev + 1); // Triggers the feed to update
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>LinkedOut.</h1>
      <p className="subtitle">Powered by AI & Supabase. Paste the corporate fluff below.</p>

      <textarea 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g., 'I am humbled and honored to announce that I will be disrupting the B2B SaaS space...'"
      />

      <button onClick={handleRoast} disabled={loading}>
        {loading ? 'Analyzing fluff levels...' : 'Get the No-Nonsense Translation'}
      </button>

      {error && <div className="error-text">{error}</div>}

      {roast && (
        <div className="result-box" style={{ display: 'block' }}>
          <h3>The Honest Truth:</h3>
          <div className="result-text">{roast}</div>
        </div>
      )}

      {/* The Live Feed */}
      <RecentRoasts refreshTrigger={refreshCounter} />
    </div>
  );
}

export default App;