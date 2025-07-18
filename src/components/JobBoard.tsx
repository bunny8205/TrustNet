import React from 'react';

const JobBoard: React.FC<{ trustScore: number }> = ({ trustScore }) => {
  const jobs = [
    {
      title: 'Smart Contract Auditor',
      minTrust: 0.8,
      reward: '5000 HTR'
    },
    {
      title: 'DAO Contributor',
      minTrust: 0.6,
      reward: '2000 HTR/month'
    },
    {
      title: 'Community Moderator',
      minTrust: 0.7,
      reward: '1500 HTR/month'
    },
  ];

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#ecfdf5',
      borderRadius: '0.75rem',
      border: '1px solid #a7f3d0'
    }}>
      <h3 style={{
        marginTop: 0,
        marginBottom: '1.5rem',
        fontSize: '1.125rem',
        fontWeight: 600,
        color: '#065f46'
      }}>
        🌐 Web3 Job Board
      </h3>

      <p style={{ marginBottom: '1.5rem', color: '#047857' }}>
        Available opportunities based on your trust score:
      </p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {jobs.map((job, index) => (
          <div
            key={index}
            style={{
              padding: '1rem',
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              border: `1px solid ${
                trustScore >= job.minTrust ? '#a7f3d0' : '#e2e8f0'
              }`,
              opacity: trustScore >= job.minTrust ? 1 : 0.6
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.5rem'
            }}>
              <h4 style={{
                margin: 0,
                fontSize: '1rem',
                fontWeight: 600,
                color: '#064e3b'
              }}>
                {job.title}
              </h4>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#059669'
              }}>
                {job.reward}
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: '#64748b'
              }}>
                Min. Trust: {(job.minTrust * 100).toFixed(0)}%
              </div>

              {trustScore >= job.minTrust ? (
                <button
                  style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#34d399',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Apply
                </button>
              ) : (
                <div style={{
                  fontSize: '0.75rem',
                  color: '#ef4444'
                }}>
                  Trust score too low
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobBoard;