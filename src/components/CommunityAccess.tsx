import React from 'react';

const CommunityAccess: React.FC<{ trustScore: number }> = ({ trustScore }) => {
  const communities = [
    {
      name: 'General Chat',
      minTrust: 0,
      icon: '💬'
    },
    {
      name: 'NFT Collectors',
      minTrust: 0.4,
      icon: '🖼️'
    },
    {
      name: 'Developers',
      minTrust: 0.5,
      icon: '👨‍💻'
    },
    {
      name: 'Premium Investors',
      minTrust: 0.7,
      icon: '💰'
    },
  ];

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#f0f9ff',
      borderRadius: '0.75rem',
      border: '1px solid #bae6fd'
    }}>
      <h3 style={{
        marginTop: 0,
        marginBottom: '1.5rem',
        fontSize: '1.125rem',
        fontWeight: 600,
        color: '#0369a1'
      }}>
        📲 Community Access
      </h3>

      <p style={{ marginBottom: '1.5rem', color: '#0c4a6e' }}>
        Your trust score grants access to exclusive communities:
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        {communities.map((community, index) => (
          <div
            key={index}
            style={{
              padding: '1rem',
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              border: `1px solid ${
                trustScore >= community.minTrust ? '#bae6fd' : '#e2e8f0'
              }`,
              textAlign: 'center',
              opacity: trustScore >= community.minTrust ? 1 : 0.6
            }}
          >
            <div style={{
              fontSize: '2rem',
              marginBottom: '0.5rem'
            }}>
              {community.icon}
            </div>
            <h4 style={{
              margin: 0,
              marginBottom: '0.25rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#0369a1'
            }}>
              {community.name}
            </h4>
            <div style={{
              fontSize: '0.75rem',
              color: '#64748b'
            }}>
              {trustScore >= community.minTrust
                ? '✅ Access granted'
                : `Requires ${(community.minTrust * 100).toFixed(0)}% trust`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityAccess;