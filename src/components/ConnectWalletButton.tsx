import React, { useEffect, useState } from 'react';
import { useWallet } from '../contexts/WalletContext';

const ConnectWalletButton: React.FC = () => {
  const {
    address,
    isConnected,
    isLoading,
    isInitializing,
    error,
    connect,
    disconnect,
    getButtonText,
    trustScore,
    walletData,
    isCalculatingTrustScore,
    trustScoreError
  } = useWallet();

  const [retryCount, setRetryCount] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setLocalError(null);
  }, [isConnected, address]);

  const handleClick = async () => {
    if (isInitializing) return;

    setLocalError(null);
    try {
      if (isConnected) {
        await disconnect();
      } else {
        await connect();
        setRetryCount(0);
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Connection failed');
      console.error('Wallet action error:', err);
    }
  };

  const handleRetry = async () => {
    if (isInitializing) return;

    setRetryCount(prev => prev + 1);
    setLocalError(null);
    try {
      await connect();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Retry failed');
    }
  };

  const getErrorMessage = () => {
    if (!error && !localError) return null;
    const message = error || localError || '';

    if (message.includes('provide a connection')) {
      return 'Please connect your wallet first';
    }
    if (message.includes('namespaces') || message.includes('hathor')) {
      return 'Wallet connection error - please try again';
    }
    return message;
  };

  const getTrustScoreColor = (score: number | null) => {
    if (score === null) return '#9E9E9E';
    if (score >= 0.8) return '#4CAF50'; // Green for high trust
    if (score >= 0.5) return '#FFC107'; // Yellow for medium trust
    return '#F44336'; // Red for low trust
  };

  const getTrustScoreLabel = (score: number | null) => {
    if (score === null) return 'Unknown';
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.7) return 'Good';
    if (score >= 0.5) return 'Fair';
    return 'Poor';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      maxWidth: '420px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <button
        onClick={handleClick}
        disabled={isLoading || isInitializing}
        style={{
          padding: '12px 24px',
          backgroundColor: isConnected ? '#4CAF50' : '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          opacity: (isLoading || isInitializing) ? 0.7 : 1,
          transition: 'all 0.3s ease',
          fontSize: '16px',
          fontWeight: '500'
        }}
      >
        {getButtonText()}
      </button>

      {isConnected && address && (
        <div style={{
          marginTop: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{
            fontSize: '15px',
            padding: '12px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>Wallet Address:</strong>
              <div style={{
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                marginTop: '4px'
              }}>
                {address}
              </div>
            </div>

            {/* Trust Score Display */}
            <div style={{ margin: '12px 0' }}>
              {isCalculatingTrustScore ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#2196F3'
                }}>
                  <div className="spinner"></div>
                  Calculating trust score...
                </div>
              ) : trustScoreError ? (
                <div style={{ color: '#F44336' }}>
                  ⚠️ {trustScoreError}
                </div>
              ) : trustScore !== null ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <strong>Trust Score:</strong>
                    <div style={{
                      width: '48px',
                      height: '24px',
                      backgroundColor: getTrustScoreColor(trustScore),
                      color: 'white',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {(trustScore * 100).toFixed(0)}
                    </div>
                    <span>{getTrustScoreLabel(trustScore)}</span>
                  </div>
                  <div style={{
                    height: '8px',
                    width: '100%',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${trustScore * 100}%`,
                      height: '100%',
                      backgroundColor: getTrustScoreColor(trustScore),
                      transition: 'width 0.5s ease'
                    }}></div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Wallet Metrics */}
            {walletData && (
              <details style={{
                marginTop: '12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <summary style={{
                  padding: '10px',
                  backgroundColor: '#f1f1f1',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  View Wallet Metrics
                </summary>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: '#ffffff'
                }}>
                  <MetricItem label="Wallet Age" value={`${walletData.wallet_age_days} days`} />
                  <MetricItem label="Transactions" value={walletData.tx_count} />
                  <MetricItem label="Unique Tokens" value={walletData.unique_token_count} />
                  <MetricItem label="Token Balance" value={walletData.total_token_balance} />
                  <MetricItem label="NFTs Owned" value={walletData.nfts_owned} />
                  <MetricItem label="Last Active" value={`${walletData.last_tx_days_ago} days ago`} />
                  <MetricItem label="Contracts Used" value={walletData.smart_contracts_used} />
                  <MetricItem label="Peer Score" value={walletData.peer_score.toFixed(2)} />
                </div>
              </details>
            )}
          </div>
        </div>
      )}

      {getErrorMessage() && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '12px',
          backgroundColor: '#ffebee',
          borderRadius: '8px'
        }}>
          <div style={{ color: '#f44336' }}>
            ⚠️ {getErrorMessage()}
          </div>
          {retryCount < 3 && !isInitializing && (
            <button
              onClick={handleRetry}
              style={{
                padding: '8px 16px',
                backgroundColor: '#FF9800',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                alignSelf: 'flex-start'
              }}
            >
              Retry ({3 - retryCount} attempts left)
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const MetricItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div style={{ marginBottom: '4px' }}>
    <strong>{label}:</strong> {value}
  </div>
);

export default ConnectWalletButton;