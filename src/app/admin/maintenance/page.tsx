'use client';

import { useState } from 'react';

export default function MaintenancePage() {
  const [maintenance, setMaintenance] = useState({
    enabled: false,
    message: 'We are currently performing scheduled maintenance. Please check back soon.',
    estimatedEnd: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setSuccess('');
    
    // Simulate save - in production, this would save to database or config
    setTimeout(() => {
      setLoading(false);
      setSuccess('Maintenance settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }, 500);
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.75rem', color: '#0A0A0A', marginBottom: '0.5rem' }}>
        Maintenance Mode
      </h1>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>
        Enable maintenance mode to temporarily disable the website for updates.
      </p>

      {success && (
        <div style={{ padding: '1rem', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '8px', color: '#155724', marginBottom: '1.5rem' }}>
          {success}
        </div>
      )}

      <div style={{ backgroundColor: '#fff', border: '1px solid #F0F0F0', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        {/* Enable/Disable Toggle */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={maintenance.enabled}
              onChange={(e) => setMaintenance({ ...maintenance, enabled: e.target.checked })}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#0A0A0A' }}>
              Enable Maintenance Mode
            </span>
          </label>
          <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '8px', marginLeft: '32px' }}>
            When enabled, visitors will see a maintenance page instead of the website.
          </p>
        </div>

        {/* Maintenance Message */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', color: '#0A0A0A', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
            Maintenance Message
          </label>
          <textarea
            value={maintenance.message}
            onChange={(e) => setMaintenance({ ...maintenance, message: e.target.value })}
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #E8E8E8',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
            placeholder="Enter the message to display to visitors..."
          />
        </div>

        {/* Estimated End Time */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', color: '#0A0A0A', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
            Estimated End Time (Optional)
          </label>
          <input
            type="datetime-local"
            value={maintenance.estimatedEnd}
            onChange={(e) => setMaintenance({ ...maintenance, estimatedEnd: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #E8E8E8',
              borderRadius: '8px',
              fontSize: '0.9rem',
            }}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            padding: '12px 32px',
            backgroundColor: loading ? '#ccc' : '#C9A84C',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Preview */}
      {maintenance.enabled && (
        <div style={{ marginTop: '2rem', backgroundColor: '#fff', border: '1px solid #F0F0F0', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0A0A0A', marginBottom: '1rem' }}>
            Preview
          </h3>
          <div style={{ padding: '2rem', backgroundColor: '#FFF8F0', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔧</div>
            <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.5rem', color: '#0A0A0A', marginBottom: '1rem' }}>
              Under Maintenance
            </h2>
            <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              {maintenance.message}
            </p>
            {maintenance.estimatedEnd && (
              <p style={{ color: '#C9A84C', fontSize: '0.85rem', fontWeight: 600 }}>
                Expected to be back: {new Date(maintenance.estimatedEnd).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
