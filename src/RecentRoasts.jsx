import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function RecentRoasts({ refreshTrigger }) {
  const [roasts, setRoasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentRoasts();
  }, [refreshTrigger]); // Re-fetch whenever a new roast is submitted

  const fetchRecentRoasts = async () => {
    try {
      const { data, error } = await supabase
        .from('roasts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5); // Keep the feed snappy by limiting the results

      if (error) throw error;
      if (data) setRoasts(data);
    } catch (error) {
      console.error('Error fetching roasts:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading the hall of shame...</p>;

  return (
    <div style={{ marginTop: '40px' }}>
      <h2 style={{ fontSize: '20px', color: 'var(--primary-color)', marginBottom: '15px', borderBottom: '2px solid #e8f4f9', paddingBottom: '10px' }}>
        Live Feed: Recent Roasts
      </h2>
      
      {roasts.length === 0 ? (
        <p>No roasts yet. Be the first to disrupt this space!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {roasts.map((roast) => (
            <div key={roast.id} style={{ padding: '15px', backgroundColor: '#faf9f7', borderLeft: '4px solid #ccc', borderRadius: '4px' }}>
              <p style={{ fontSize: '13px', color: '#666', fontStyle: 'italic', marginBottom: '8px' }}>
                "{roast.original_text.substring(0, 100)}{roast.original_text.length > 100 ? '...' : ''}"
              </p>
              <p style={{ fontSize: '15px', fontWeight: '500', color: '#333' }}>
                🔥 {roast.roasted_text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}