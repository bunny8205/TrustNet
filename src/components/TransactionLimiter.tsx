import React from 'react';

const TransactionLimiter: React.FC<{ trustScore: number; address: string }> = ({
  trustScore,
  address
}) => {
  const getLimit = () => {
    if (trustScore < 0.3) return 50;
    if (trustScore < 0.7) return 500;
    return 10000; // Unlimited for practical purposes
  };

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#ecfdf5',
      borderRadius: '0.75rem',
      border: '1px solid #a7f3d0'
    }}>
      <h3 style={{
        marginTop: 0,
        marginBottom: '1rem',
        fontSize: '1.125rem',
        fontWeight: 600,
        color: '#065f46'
      }}>
        ⚖️ Transaction Limits
      </h3>
      <p style={{ marginBottom: '1rem', color: '#047857' }}>
        Your current daily transaction limit based on trust score:
      </p>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          borderRadius: '50%',
          backgroundColor: '#34d399',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontWeight: 'bold',
          fontSize: '1.25rem'
        }}>
          {getLimit()}
        </div>
        <div>
          <div style={{ fontWeight: 600, color: '#064e3b' }}>HTR per day</div>
          <div style={{ fontSize: '0.875rem', color: '#059669' }}>
            {trustScore < 0.3
              ? 'Basic protection level'
              : trustScore < 0.7
                ? 'Standard limit'
                : 'Premium unlimited access'}
          </div>
        </div>
      </div>
      <p style={{
        fontSize: '0.875rem',
        color: '#065f46',
        fontStyle: 'italic'
      }}>
        {trustScore < 0.3
          ? 'To increase your limit, build trust with regular transactions'
          : trustScore < 0.7
            ? 'You can request higher limits by verifying your identity'
            : 'You have maximum transaction privileges'}
      </p>
    </div>
  );
};

export default TransactionLimiter;