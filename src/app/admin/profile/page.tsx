'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (session?.user) {
      setProfile(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
      }));
    }
  }, [session]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    setSuccess('');
    setError('');

    if (!profile.name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }, 500);
  };

  const handleChangePassword = async () => {
    setLoading(true);
    setSuccess('');
    setError('');

    if (!profile.currentPassword || !profile.newPassword || !profile.confirmPassword) {
      setError('All password fields are required');
      setLoading(false);
      return;
    }

    if (profile.newPassword !== profile.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (profile.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess('Password changed successfully!');
      setProfile(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      setTimeout(() => setSuccess(''), 3000);
    }, 500);
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.75rem', color: '#0A0A0A', marginBottom: '0.5rem' }}>
        Profile Settings
      </h1>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>
        Manage your account information and security settings.
      </p>

      {success && (
        <div style={{ padding: '1rem', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '8px', color: '#155724', marginBottom: '1.5rem' }}>
          {success}
        </div>
      )}

      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '8px', color: '#721c24', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Profile Information */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #F0F0F0', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0A0A0A', marginBottom: '1.5rem' }}>
          Profile Information
        </h2>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: '#0A0A0A', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
            Name
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #E8E8E8',
              borderRadius: '8px',
              fontSize: '0.9rem',
            }}
            placeholder="Enter your name"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: '#0A0A0A', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
            Email
          </label>
          <input
            type="email"
            value={profile.email}
            disabled
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #E8E8E8',
              borderRadius: '8px',
              fontSize: '0.9rem',
              backgroundColor: '#F5F5F5',
              cursor: 'not-allowed',
            }}
          />
          <p style={{ color: '#666', fontSize: '0.75rem', marginTop: '4px' }}>
            Email cannot be changed
          </p>
        </div>

        <button
          onClick={handleUpdateProfile}
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
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </div>

      {/* Change Password */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #F0F0F0', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0A0A0A', marginBottom: '1.5rem' }}>
          Change Password
        </h2>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: '#0A0A0A', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
            Current Password
          </label>
          <input
            type="password"
            value={profile.currentPassword}
            onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #E8E8E8',
              borderRadius: '8px',
              fontSize: '0.9rem',
            }}
            placeholder="Enter current password"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: '#0A0A0A', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
            New Password
          </label>
          <input
            type="password"
            value={profile.newPassword}
            onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #E8E8E8',
              borderRadius: '8px',
              fontSize: '0.9rem',
            }}
            placeholder="Enter new password"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: '#0A0A0A', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
            Confirm New Password
          </label>
          <input
            type="password"
            value={profile.confirmPassword}
            onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #E8E8E8',
              borderRadius: '8px',
              fontSize: '0.9rem',
            }}
            placeholder="Confirm new password"
          />
        </div>

        <button
          onClick={handleChangePassword}
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
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </div>
    </div>
  );
}
