import React from 'react';

const FeeAdjuster: React.FC<{ trustScore: number }> = ({ trustScore }) => {
  const getFeeMultiplier = () => {
    if (trustScore < 0.3) return 1.5;
    if (trustScore < 0.6) return 1.0;
    return 0.7;
  };

  const baseFee = 0.01; // Example base fee in HTR
  const currentFee = baseFee * getFeeMultiplier();

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#f5f3ff',
      borderRadius: '0.75rem',
      border: '1px solid #c4b5fd'
    }}>
      <h3 style={{
        marginTop: 0,
        marginBottom: '1rem',
        fontSize: '1.125rem',
        fontWeight: 600,
        color: '#5b21b6'
      }}>
        🧠 Dynamic Fee Adjustment
      </h3>
      <p style={{ marginBottom: '1rem', color: '#5b21b6' }}>
        Your trust score affects your transaction fees:
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
          backgroundColor: '#8b5cf6',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontWeight: 'bold',
          fontSize: '1.25rem'
        }}>
          {currentFee.toFixed(2)}
        </div>
        <div>
          <div style={{ fontWeight: 600, color: '#5b21b6' }}>HTR per transaction</div>
          <div style={{ fontSize: '0.875rem', color: '#7c3aed' }}>
            {getFeeMultiplier() === 1.5
              ? 'Standard fee (low trust)'
              : getFeeMultiplier() === 1.0
                ? 'Reduced fee'
                : 'Premium fee (lowest)'}
          </div>
        </div>
      </div>
      
      <div style={{
        height: '8px',
        width: '100%',
        backgroundColor: '#ddd6fe',
        borderRadius: '4px',
        marginBottom: '1rem'
      }}>
        <div 
          style={{
            width: `${trustScore * 100}%`,
            height: '100%',
            backgroundColor: '#7c3aed',
            borderRadius: '4px'
          }}
        />
      </div>
      
      <p style={{ 
        fontSize: '0.875rem', 
        color: '#5b21b6',
        fontStyle: 'italic'
      }}>
        {trustScore < 0.3
          ? 'Build trust to reduce your fees'
          : trustScore < 0.6
            ? 'You qualify for reduced fees'
            : 'You receive our lowest fee tier'}
      </p>
    </div>
  );
};

export default FeeAdjuster;