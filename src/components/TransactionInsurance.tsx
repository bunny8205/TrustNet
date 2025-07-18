import React from 'react';

const TransactionInsurance: React.FC<{ trustScore: number }> = ({ trustScore }) => {
  const isEligible = trustScore > 0.7;
  const coverageAmount = isEligible ? 'Up to 10,000 HTR' : 'Not eligible';

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: isEligible ? '#ecfdf5' : '#f3f4f6',
      borderRadius: '0.75rem',
      border: `1px solid ${isEligible ? '#a7f3d0' : '#e5e7eb'}`
    }}>
      <h3 style={{
        marginTop: 0,
        marginBottom: '1rem',
        fontSize: '1.125rem',
        fontWeight: 600,
        color: isEligible ? '#065f46' : '#4b5563'
      }}>
        🔄 Transaction Insurance
      </h3>

      {isEligible ? (
        <>
          <p style={{ marginBottom: '1rem', color: '#047857' }}>
            You qualify for AI-powered transaction insurance:
          </p>
          <ul style={{
            paddingLeft: '1.25rem',
            marginBottom: '1.5rem',
            color: '#047857'
          }}>
            <li>Coverage: {coverageAmount} per transaction</li>
            <li>Automatic fraud detection</li>
            <li>Smart contract failure protection</li>
          </ul>
          <button
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Enable Insurance
          </button>
        </>
      ) : (
        <>
          <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
            Transaction insurance is available for wallets with trust scores above 70%.
          </p>
          <div style={{
            padding: '1rem',
            backgroundColor: '#ffffff',
            borderRadius: '0.5rem',
            borderLeft: '4px solid #9ca3af'
          }}>
            <p style={{ margin: 0, color: '#6b7280' }}>
              Build your trust score to qualify for this protection.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionInsurance;