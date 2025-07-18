import React from 'react';

const TrustFeatures: React.FC<{ trustScore: number | null }> = ({ trustScore }) => {
  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.75rem',
      border: '1px solid #e2e8f0'
    }}>
      <h2 style={{
        marginTop: 0,
        marginBottom: '1rem',
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#1e293b'
      }}>
        Trust-Based Features
      </h2>
      <p style={{ marginBottom: '1.5rem', color: '#475569' }}>
        Your trust score unlocks special features and benefits in the Hathor ecosystem.
        Higher scores provide more privileges and lower fees.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1rem'
      }}>
        <FeatureCard
          title="Transaction Limits"
          description="Higher trust means higher daily transaction limits"
          unlocked={trustScore ? trustScore > 0.3 : false}
        />
        <FeatureCard
          title="Escrow Protection"
          description="Low-trust transactions get automatic escrow protection"
          unlocked={true}
        />
        <FeatureCard
          title="Reduced Fees"
          description="Enjoy lower transaction fees with high trust"
          unlocked={trustScore ? trustScore > 0.5 : false}
        />
        {/* Add more feature cards */}
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{
  title: string;
  description: string;
  unlocked: boolean
}> = ({ title, description, unlocked }) => (
  <div style={{
    padding: '1rem',
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    border: `1px solid ${unlocked ? '#d1fae5' : '#e2e8f0'}`,
    opacity: unlocked ? 1 : 0.7
  }}>
    <h3 style={{
      margin: 0,
      marginBottom: '0.5rem',
      fontSize: '1rem',
      fontWeight: 600,
      color: unlocked ? '#065f46' : '#64748b'
    }}>
      {unlocked ? '✅ ' : '🔒 '}{title}
    </h3>
    <p style={{
      margin: 0,
      fontSize: '0.875rem',
      color: unlocked ? '#475569' : '#94a3b8'
    }}>
      {description}
    </p>
  </div>
);

export default TrustFeatures;