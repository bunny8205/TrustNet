import React from 'react';

const NftReputation: React.FC<{ trustScore: number; address: string }> = ({
  trustScore,
  address
}) => {
  const getBadgeLevel = () => {
    if (trustScore < 0.3) return 1;
    if (trustScore < 0.6) return 2;
    if (trustScore < 0.8) return 3;
    return 4;
  };

  const badgeLevel = getBadgeLevel();
  const badgeColors = ['#6b7280', '#3b82f6', '#8b5cf6', '#10b981'];
  const badgeNames = ['Novice', 'Trusted', 'Expert', 'Legend'];

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#f5f3ff',
      borderRadius: '0.75rem',
      border: '1px solid #c4b5fd'
    }}>
      <h3 style={{
        marginTop: 0,
        marginBottom: '1.5rem',
        fontSize: '1.125rem',
        fontWeight: 600,
        color: '#5b21b6'
      }}>
        🔗 Reputation Badge NFT
      </h3>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: badgeColors[badgeLevel - 1],
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontSize: '2rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          marginBottom: '1rem'
        }}>
          {badgeLevel}
        </div>

        <h4 style={{
          margin: 0,
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#5b21b6'
        }}>
          {badgeNames[badgeLevel - 1]} Badge
        </h4>

        <p style={{
          textAlign: 'center',
          color: '#5b21b6',
          marginBottom: '1.5rem'
        }}>
          Your trust score qualifies you for this reputation level.
          Higher scores unlock more prestigious badges.
        </p>

        <button
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Mint Badge NFT
        </button>
      </div>
    </div>
  );
};

export default NftReputation;