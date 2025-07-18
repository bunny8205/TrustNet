import React from 'react';

const WalletSecurity: React.FC<{ trustScore: number; riskData: any }> = ({
  trustScore,
  riskData
}) => {
  const securityStatus = riskData?.riskScore > 0.6
    ? 'high'
    : riskData?.riskScore > 0.3
      ? 'medium'
      : 'low';

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: securityStatus === 'high'
        ? '#fee2e2'
        : securityStatus === 'medium'
          ? '#fef3c7'
          : '#dcfce7',
      borderRadius: '0.75rem',
      border: `1px solid ${
        securityStatus === 'high' 
          ? '#fca5a5' 
          : securityStatus === 'medium' 
            ? '#fcd34d' 
            : '#86efac'
      }`
    }}>
      <h3 style={{
        marginTop: 0,
        marginBottom: '1rem',
        fontSize: '1.125rem',
        fontWeight: 600,
        color: securityStatus === 'high'
          ? '#b91c1c'
          : securityStatus === 'medium'
            ? '#92400e'
            : '#166534'
      }}>
        {securityStatus === 'high'
          ? '🛡️ High Risk - Security Alert'
          : securityStatus === 'medium'
            ? '⚠️ Medium Risk - Caution Advised'
            : '✅ Low Risk - Secure'}
      </h3>

      <p style={{
        marginBottom: '1rem',
        color: securityStatus === 'high'
          ? '#b91c1c'
          : securityStatus === 'medium'
            ? '#92400e'
            : '#166534'
      }}>
        {securityStatus === 'high'
          ? 'Your wallet shows high risk indicators. Some features may be limited.'
          : securityStatus === 'medium'
            ? 'Your wallet shows moderate risk. Consider verifying your identity.'
            : 'Your wallet security status is good.'}
      </p>

      {securityStatus === 'high' && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fff',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          borderLeft: '4px solid #ef4444'
        }}>
          <p style={{ margin: 0, color: '#b91c1c' }}>
            Recommendation: Enable enhanced security measures or contact support.
          </p>
        </div>
      )}

      <button
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: securityStatus === 'high'
            ? '#ef4444'
            : securityStatus === 'medium'
              ? '#f59e0b'
              : '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        {securityStatus === 'high'
          ? 'Enable Protection'
          : securityStatus === 'medium'
            ? 'Improve Security'
            : 'View Security Options'}
      </button>
    </div>
  );
};

export default WalletSecurity;