import React, { useState } from 'react';

const EscrowManager: React.FC<{ trustScore: number; walletData: any }> = ({
  trustScore,
  walletData
}) => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isEscrowRequired, setIsEscrowRequired] = useState(false);

  const checkEscrow = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setIsEscrowRequired(trustScore < 0.4 && numValue > 10);
  };

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#f0f9ff',
      borderRadius: '0.75rem',
      border: '1px solid #bae6fd'
    }}>
      <h3 style={{
        marginTop: 0,
        marginBottom: '1rem',
        fontSize: '1.125rem',
        fontWeight: 600,
        color: '#0369a1'
      }}>
        🤝 Escrow Protection
      </h3>
      <p style={{ marginBottom: '1rem', color: '#0c4a6e' }}>
        {trustScore < 0.4
          ? 'Your transactions may require escrow protection'
          : 'Your transactions qualify for direct transfers'}
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: 500,
          color: '#075985'
        }}>
          Recipient Address
        </label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '0.375rem',
            border: '1px solid #7dd3fc'
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: 500,
          color: '#075985'
        }}>
          Amount (HTR)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            checkEscrow(e.target.value);
          }}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '0.375rem',
            border: '1px solid #7dd3fc'
          }}
        />
      </div>

      {isEscrowRequired && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#e0f2fe',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          borderLeft: '4px solid #0369a1'
        }}>
          <p style={{ margin: 0, color: '#075985' }}>
            ⚠️ This transaction will use escrow protection. Funds will be held in a
            smart contract until the recipient confirms delivery.
          </p>
        </div>
      )}

      <button
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#0ea5e9',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        {isEscrowRequired ? 'Send with Escrow' : 'Send Directly'}
      </button>
    </div>
  );
};

export default EscrowManager;