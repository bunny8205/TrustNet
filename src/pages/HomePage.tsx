import React from 'react';
import ConnectWalletButton from '../components/ConnectWalletButton';
import { useWallet } from '../contexts/WalletContext';
import hathorLogo from '../assets/hathor-logo.png';

const HomePage: React.FC = () => {
  const {
    address,
    isConnected,
    isLoading,
    trustScore,
    walletData,
    isCalculatingTrustScore,
    trustScoreError,
    riskData,
    riskError
  } = useWallet();

  const getTrustScoreColor = (score: number | null) => {
    if (score === null) return '#9E9E9E';
    if (score >= 0.8) return '#4CAF50';
    if (score >= 0.5) return '#FFC107';
    return '#F44336';
  };

  const getRiskScoreColor = (score: number | null) => {
    if (score === null) return '#9E9E9E';
    if (score <= 0.3) return '#4CAF50';
    if (score <= 0.6) return '#FFC107';
    return '#F44336';
  };

  const getTrustScoreLabel = (score: number | null) => {
    if (score === null) return 'Calculating...';
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.7) return 'Good';
    if (score >= 0.5) return 'Fair';
    return 'Poor';
  };

  const getRiskScoreLabel = (score: number | null) => {
    if (score === null) return 'Calculating...';
    if (score <= 0.3) return 'Low';
    if (score <= 0.6) return 'Medium';
    return 'High';
  };

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: 'linear-gradient(to bottom, #f9fafb, #ffffff)',
      minHeight: '100vh'
    }}>
      {/* Logo and Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2.5rem',
        gap: '1rem'
      }}>
        <img
          src={hathorLogo}
          alt="Hathor Logo"
          style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }}
        />
        <h1 style={{
          color: '#111827',
          margin: 0,
          fontSize: '2.25rem',
          fontWeight: 700,
          letterSpacing: '-0.025em'
        }}>
          TrustNet
        </h1>
      </div>

      {/* Informative Introduction Section */}
      {!isConnected && (
        <div style={{
          marginBottom: '2.5rem',
          padding: '2rem',
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          borderLeft: '4px solid #3b82f6',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
        }}>
          <h2 style={{
            color: '#111827',
            marginTop: 0,
            fontSize: '1.5rem',
            fontWeight: 600,
            marginBottom: '1rem'
          }}>Welcome to TrustNet</h2>
          <p style={{
            lineHeight: '1.75',
            marginBottom: '1.5rem',
            color: '#4b5563',
            fontSize: '1rem'
          }}>
            TrustNet provides comprehensive wallet analysis and trust scoring for the Hathor network.
            Connect your wallet to unlock personalized insights and premium benefits.
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{
              color: '#1f2937',
              marginBottom: '0.75rem',
              fontSize: '1.125rem',
              fontWeight: 600
            }}>Key Features</h3>
            <ul style={{
              lineHeight: '1.75',
              paddingLeft: '1.25rem',
              margin: 0,
              listStyleType: 'none'
            }}>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ color: '#3b82f6', marginRight: '0.5rem' }}>•</span>
                Real-time trust scoring based on wallet activity
              </li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ color: '#3b82f6', marginRight: '0.5rem' }}>•</span>
                Detailed risk assessment and security insights
              </li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ color: '#3b82f6', marginRight: '0.5rem' }}>•</span>
                Personalized recommendations for safer transactions
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ color: '#3b82f6', marginRight: '0.5rem' }}>•</span>
                Access to premium services for trusted wallets
              </li>
            </ul>
          </div>

          <div style={{
            backgroundColor: '#eff6ff',
            padding: '1.25rem',
            borderRadius: '0.75rem',
            marginTop: '1.5rem',
            border: '1px solid #dbeafe'
          }}>
            <h3 style={{
              color: '#1f2937',
              marginTop: 0,
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: '0.75rem'
            }}>Benefits for You</h3>
            <ul style={{
              lineHeight: '1.75',
              paddingLeft: '1.25rem',
              margin: 0,
              listStyleType: 'none'
            }}>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ color: '#3b82f6', marginRight: '0.5rem' }}>•</span>
                Higher yields for wallets with good trust scores
              </li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ color: '#3b82f6', marginRight: '0.5rem' }}>•</span>
                Early access to new features and token launches
              </li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ color: '#3b82f6', marginRight: '0.5rem' }}>•</span>
                Reduced fees on partner platforms
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ color: '#3b82f6', marginRight: '0.5rem' }}>•</span>
                Personalized security recommendations
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Connect Wallet Section */}
      <div style={{
        margin: '2.5rem 0',
        textAlign: 'center'
      }}>
        <h2 style={{
          color: '#111827',
          marginBottom: '1rem',
          fontSize: '1.5rem',
          fontWeight: 600
        }}>
          {isConnected ? 'Wallet Connected' : 'Get Started'}
        </h2>
        <p style={{
          marginBottom: '1.5rem',
          lineHeight: '1.75',
          color: isConnected ? '#6b7280' : '#4b5563',
          fontSize: '1.125rem',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          {isConnected
            ? 'View your trust score and wallet analysis below'
            : 'Connect your Hathor wallet to view your trust score and unlock benefits'}
        </p>
        <ConnectWalletButton />
      </div>

      {/* Wallet Analysis Section */}
      {isConnected && (
        <div style={{
          marginTop: '2.5rem',
          padding: '2rem',
          border: '1px solid #e5e7eb',
          borderRadius: '1rem',
          background: '#ffffff',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
        }}>
          <h2 style={{
            color: '#111827',
            marginBottom: '1.5rem',
            borderBottom: '1px solid #f3f4f6',
            paddingBottom: '1rem',
            fontSize: '1.5rem',
            fontWeight: 600
          }}>
            Wallet Analysis
          </h2>

          {!address ? (
            <div style={{
              padding: '1.5rem',
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '1rem'
            }}>
              Loading wallet details...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '1.5rem',
              gridTemplateColumns: '1fr 1fr',
              alignItems: 'start'
            }}>
              <div>
                <h3 style={{
                  color: '#1f2937',
                  marginBottom: '1rem',
                  fontSize: '1.125rem',
                  fontWeight: 600
                }}>Basic Info</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.25rem', color: '#374151' }}>Address:</strong>
                    <div style={{
                      fontFamily: "'Roboto Mono', monospace",
                      wordBreak: 'break-all',
                      fontSize: '0.875rem',
                      color: '#3b82f6',
                      backgroundColor: '#f8fafc',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #e2e8f0'
                    }}>
                      {address}
                    </div>
                  </div>

                  {walletData && (
                    <div>
                      <strong style={{ display: 'block', marginBottom: '0.25rem', color: '#374151' }}>Token Balance:</strong>
                      <div style={{
                        marginTop: '0.25rem',
                        fontSize: '1.125rem',
                        fontWeight: 500,
                        color: '#1f2937'
                      }}>
                        {walletData.total_token_balance} HTR
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 style={{
                  color: '#1f2937',
                  marginBottom: '1rem',
                  fontSize: '1.125rem',
                  fontWeight: 600
                }}>Trust Analysis</h3>
                {isCalculatingTrustScore ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: '#3b82f6',
                    fontSize: '0.875rem'
                  }}>
                    <div className="spinner"></div>
                    Calculating trust score...
                  </div>
                ) : trustScoreError ? (
                  <div style={{
                    color: '#ef4444',
                    backgroundColor: '#fef2f2',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1.25rem' }}>⚠️</span> Error calculating trust score
                  </div>
                ) : (
                  trustScore !== null && (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}>
                        <div style={{
                          width: '3.5rem',
                          height: '3.5rem',
                          borderRadius: '50%',
                          backgroundColor: getTrustScoreColor(trustScore),
                          color: 'white',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '1.25rem',
                          fontWeight: 'bold',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}>
                          {(trustScore * 100).toFixed(0)}
                        </div>
                        <div>
                          <div style={{
                            fontWeight: '600',
                            fontSize: '1.125rem',
                            color: '#1f2937'
                          }}>
                            {getTrustScoreLabel(trustScore)}
                          </div>
                          <div style={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            marginTop: '0.25rem'
                          }}>
                            {(trustScore * 100).toFixed(1)}% score
                          </div>
                        </div>
                      </div>

                      <div style={{
                        height: '0.5rem',
                        width: '100%',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '0.25rem',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${trustScore * 100}%`,
                          height: '100%',
                          backgroundColor: getTrustScoreColor(trustScore),
                          transition: 'width 0.5s ease',
                          borderRadius: '0.25rem'
                        }}></div>
                      </div>
                    </div>
                  )
                )}
              </div>

              {riskData && (
                <div style={{
                  gridColumn: '1 / -1',
                  padding: '1.25rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.75rem',
                  borderLeft: `4px solid ${getRiskScoreColor(riskData.riskScore)}`,
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{
                    color: '#1f2937',
                    marginBottom: '1rem',
                    fontSize: '1.125rem',
                    fontWeight: 600
                  }}>Risk Assessment</h3>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <div style={{
                        width: '3.5rem',
                        height: '3.5rem',
                        borderRadius: '50%',
                        backgroundColor: getRiskScoreColor(riskData.riskScore),
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                      }}>
                        {(riskData.riskScore * 100).toFixed(0)}
                      </div>
                      <div>
                        <div style={{
                          fontWeight: '600',
                          fontSize: '1.125rem',
                          color: '#1f2937'
                        }}>
                          {getRiskScoreLabel(riskData.riskScore)} Risk
                        </div>
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          marginTop: '0.25rem'
                        }}>
                          {riskData.recommendation}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {riskError && (
                <div style={{
                  gridColumn: '1 / -1',
                  padding: '1rem',
                  backgroundColor: '#fef2f2',
                  borderRadius: '0.75rem',
                  borderLeft: '4px solid #ef4444',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem'
                }}>
                  <span style={{ fontSize: '1.25rem' }}>⚠️</span> Could not load risk assessment: {riskError}
                </div>
              )}

              {walletData && (
                <div style={{
                  gridColumn: '1 / -1',
                  marginTop: '0.5rem'
                }}>
                  <details>
                    <summary style={{
                      cursor: 'pointer',
                      fontWeight: '500',
                      color: '#3b82f6',
                      outline: 'none',
                      fontSize: '0.875rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      View Detailed Metrics
                    </summary>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                      gap: '1.25rem',
                      marginTop: '1.25rem',
                      padding: '1.5rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.75rem',
                      border: '1px solid #e5e7eb'
                    }}>
                      <MetricItem label="Wallet Age" value={`${walletData.wallet_age_days} days`} />
                      <MetricItem label="Transactions" value={walletData.tx_count} />
                      <MetricItem label="Unique Tokens" value={walletData.unique_token_count} />
                      <MetricItem label="NFTs Owned" value={walletData.nfts_owned} />
                      <MetricItem label="Last Active" value={`${walletData.last_tx_days_ago} days ago`} />
                      <MetricItem label="Contracts Used" value={walletData.smart_contracts_used} />
                      <MetricItem label="Peer Score" value={walletData.peer_score.toFixed(2)} />
                      <MetricItem
                        label="Risk Flag"
                        value={walletData.suspicious_activity_flag ? '⚠️ High' : '✅ Low'}
                      />
                    </div>
                  </details>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MetricItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div style={{ lineHeight: '1.5' }}>
    <div style={{
      fontSize: '0.75rem',
      color: '#6b7280',
      marginBottom: '0.25rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      fontWeight: 500
    }}>
      {label}
    </div>
    <div style={{
      fontWeight: '600',
      fontSize: '1rem',
      color: '#1f2937'
    }}>
      {value}
    </div>
  </div>
);

export default HomePage;