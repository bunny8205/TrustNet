import React, { useState } from 'react';

const KycTrigger: React.FC<{ trustScore: number }> = ({ trustScore }) => {
  const [isVerified, setIsVerified] = useState(false);

  const needsKyc = trustScore < 0.25 && !isVerified;

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: needsKyc ? '#fffbeb' : '#f0fdf4',
      borderRadius: '0.75rem',
      border: `1px solid ${needsKyc ? '#fcd34d' : '#86efac'}`
    }}>
      <h3 style={{
        marginTop: 0,
        marginBottom: '1rem',
        fontSize: '1.125rem',
        fontWeight: 600,
        color: needsKyc ? '#92400e' : '#166534'
      }}>
        {needsKyc ? '🛑 Identity Verification Required' : '✅ Identity Status'}
      </h3>

      {needsKyc ? (
        <>
          <p style={{ marginBottom: '1rem', color: '#92400e' }}>
            To continue using full features, please complete identity verification.
          </p>
          <button
            onClick={() => setIsVerified(true)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Start Verification
          </button>
        </>
      ) : (
        <p style={{ marginBottom: 0, color: '#166534' }}>
          {trustScore < 0.5
            ? 'Basic verification complete'
            : 'Full privileges granted'}
        </p>
      )}
    </div>
  );
};

export default KycTrigger;