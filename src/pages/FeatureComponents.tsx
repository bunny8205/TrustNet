import React, { useState } from 'react';

// Transaction Limits Component
export const TransactionLimitsFeature: React.FC<{ trustScore: number; walletData: any }> = ({ trustScore, walletData }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const getDailyLimit = () => {
    if (trustScore < 0.3) return 50;
    if (trustScore < 0.7) return 500;
    return 10000;
  };

  const handleTransfer = () => {
    const amountNum = parseFloat(amount);
    const limit = getDailyLimit();
    const balance = parseFloat(walletData?.total_token_balance || '0');

    if (amountNum > balance) {
      setMessageType('error');
      setMessage(`Insufficient balance. Your current balance is ${balance} HTR.`);
      return;
    }

    if (amountNum > limit) {
      setMessageType('error');
      setMessage(`Your daily limit is ${limit} HTR. Please enter a smaller amount.`);
    } else {
      setShowForm(false);
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setMessageType('success');
        setMessage(`Transaction of ${amount} HTR to ${recipient} would be processed. Your trust score allows up to ${limit} HTR per day.`);
      }, 1500);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ marginTop: 0, color: '#1f2937' }}>Transaction Limits</h2>
      <p style={{ color: '#4b5563' }}>
        Your current daily limit: <strong>{getDailyLimit()} HTR</strong>
      </p>

      {showForm && (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Recipient Wallet Address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db'
              }}
              placeholder="Enter wallet address"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Amount (HTR)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db'
              }}
              placeholder="Enter amount"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <p style={{ margin: 0 }}>
              Current Balance: <strong>{walletData?.total_token_balance || '0'} HTR</strong>
            </p>
          </div>

          <button
            onClick={handleTransfer}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Transfer
          </button>
        </>
      )}

      {isProcessing && (
        <div style={{ margin: '2rem 0', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', width: '50px', height: '50px', border: '3px solid rgba(59, 130, 246, 0.3)', borderRadius: '50%', borderTopColor: '#3b82f6', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem' }}>Processing transaction...</p>
        </div>
      )}

      {message && !isProcessing && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: messageType === 'error' ? '#fef2f2' : '#ecfdf5',
          borderRadius: '0.5rem',
          borderLeft: `4px solid ${messageType === 'error' ? '#ef4444' : '#10b981'}`
        }}>
          <p style={{ margin: 0, color: messageType === 'error' ? '#b91c1c' : '#065f46' }}>
            {message}
          </p>
          <button
            onClick={() => {
              setMessage('');
              setShowForm(true);
              setRecipient('');
              setAmount('');
            }}
            style={{
              marginTop: '0.5rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: 'transparent',
              color: messageType === 'error' ? '#b91c1c' : '#065f46',
              border: '1px solid currentColor',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            New Transaction
          </button>
        </div>
      )}
    </div>
  );
};

// Escrow Protection Component
export const EscrowProtectionFeature: React.FC<{ trustScore: number }> = ({ trustScore }) => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isEscrowRequired, setIsEscrowRequired] = useState(false);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const checkEscrow = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setIsEscrowRequired(trustScore < 0.4 && numValue > 10);
  };

  const handleSubmit = () => {
    if (!amount || !recipient) {
      setMessage('Please enter both amount and recipient');
      return;
    }

    setShowForm(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setMessage(
        isEscrowRequired
          ? `Transaction of ${amount} HTR would be processed with escrow protection`
          : `Transaction of ${amount} HTR would be processed directly`
      );
    }, 1500);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ marginTop: 0, color: '#1f2937' }}>Escrow Protection</h2>
      <p style={{ color: '#4b5563' }}>
        {trustScore < 0.4
          ? 'Your transactions may require escrow protection'
          : 'Your transactions qualify for direct transfers'}
      </p>

      {showForm && (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
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
                border: '1px solid #d1d5db'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
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
                border: '1px solid #d1d5db'
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
            onClick={handleSubmit}
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
        </>
      )}

      {isProcessing && (
        <div style={{ margin: '2rem 0', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', width: '50px', height: '50px', border: '3px solid rgba(14, 165, 233, 0.3)', borderRadius: '50%', borderTopColor: '#0ea5e9', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem' }}>Processing transaction...</p>
        </div>
      )}

      {message && !isProcessing && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#ecfdf5',
          borderRadius: '0.5rem',
          borderLeft: '4px solid #10b981'
        }}>
          <p style={{ margin: 0, color: '#065f46' }}>
            {message}
          </p>
          <button
            onClick={() => {
              setMessage('');
              setShowForm(true);
              setRecipient('');
              setAmount('');
            }}
            style={{
              marginTop: '0.5rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: 'transparent',
              color: '#065f46',
              border: '1px solid currentColor',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            New Transaction
          </button>
        </div>
      )}
    </div>
  );
};

// Reduced Fees Component
export const ReducedFeesFeature: React.FC<{ trustScore: number }> = ({ trustScore }) => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const getFeePercentage = () => {
    if (trustScore < 0.3) return 1.0;
    if (trustScore < 0.6) return 0.5;
    return 0.1;
  };

  const handleSubmit = () => {
    if (!amount || !recipient) {
      setMessage('Please enter both amount and recipient');
      return;
    }

    setShowForm(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const fee = (parseFloat(amount) * getFeePercentage()) / 100;
      setMessage(
        `Transaction of ${amount} HTR would be processed with a fee of ${fee.toFixed(2)} HTR (${getFeePercentage()}%). Your trust score gives you this reduced fee.`
      );
    }, 1500);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ marginTop: 0, color: '#1f2937' }}>Reduced Fees</h2>
      <p style={{ color: '#4b5563' }}>
        Your current fee rate: <strong>{getFeePercentage()}%</strong>
      </p>

      {showForm && (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
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
                border: '1px solid #d1d5db'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Amount (HTR)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db'
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Send with Reduced Fee
          </button>
        </>
      )}

      {isProcessing && (
        <div style={{ margin: '2rem 0', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', width: '50px', height: '50px', border: '3px solid rgba(16, 185, 129, 0.3)', borderRadius: '50%', borderTopColor: '#10b981', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem' }}>Processing transaction...</p>
        </div>
      )}

      {message && !isProcessing && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#ecfdf5',
          borderRadius: '0.5rem',
          borderLeft: '4px solid #10b981'
        }}>
          <p style={{ margin: 0, color: '#065f46' }}>
            {message}
          </p>
          <button
            onClick={() => {
              setMessage('');
              setShowForm(true);
              setRecipient('');
              setAmount('');
            }}
            style={{
              marginTop: '0.5rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: 'transparent',
              color: '#065f46',
              border: '1px solid currentColor',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            New Transaction
          </button>
        </div>
      )}
    </div>
  );
};

// KYC Status Component
export const KYCStatusFeature: React.FC<{ trustScore: number }> = ({ trustScore }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const needsKyc = trustScore < 0.25 && !isVerified;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const handleSubmit = () => {
    if (needsKyc && documents.length === 0) {
      setMessage('Please upload required documents');
      return;
    }

    setShowForm(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsVerified(true);
      setMessage('Verification process would be initiated.');
    }, 1500);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ marginTop: 0, color: '#1f2937' }}>KYC Status</h2>

      {needsKyc && showForm ? (
        <>
          <p style={{ color: '#92400e' }}>
            To continue using full features, please complete identity verification.
          </p>

          <div style={{ margin: '1.5rem 0' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Upload ID Documents
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ marginBottom: '1rem' }}
            />

            {documents.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <p>Selected documents:</p>
                <ul>
                  {documents.map((doc, index) => (
                    <li key={index}>{doc.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Submit Verification
          </button>
        </>
      ) : isProcessing ? (
        <div style={{ margin: '2rem 0', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', width: '50px', height: '50px', border: '3px solid rgba(245, 158, 11, 0.3)', borderRadius: '50%', borderTopColor: '#f59e0b', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem' }}>Processing verification...</p>
        </div>
      ) : (
        <>
          <p style={{ color: '#166534' }}>
            {trustScore < 0.5
              ? 'Basic verification complete'
              : 'Full privileges granted'}
          </p>
          <div style={{
            padding: '1rem',
            backgroundColor: '#f0fdf4',
            borderRadius: '0.5rem',
            marginTop: '1rem',
            borderLeft: '4px solid #86efac'
          }}>
            <p style={{ margin: 0, color: '#166534' }}>
              {isVerified
                ? '✅ Your identity has been verified'
                : 'Your trust score is high enough that verification is not required'}
            </p>
          </div>
        </>
      )}

      {message && !isProcessing && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#ecfdf5',
          borderRadius: '0.5rem',
          borderLeft: '4px solid #10b981'
        }}>
          <p style={{ margin: 0, color: '#065f46' }}>
            {message}
          </p>
          {needsKyc && (
            <button
              onClick={() => {
                setMessage('');
                setShowForm(true);
                setDocuments([]);
              }}
              style={{
                marginTop: '0.5rem',
                padding: '0.25rem 0.5rem',
                backgroundColor: 'transparent',
                color: '#065f46',
                border: '1px solid currentColor',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
            >
              Upload More Documents
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Transaction Insurance Component
export const TransactionInsuranceFeature: React.FC<{ trustScore: number }> = ({ trustScore }) => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isInsuranceEnabled, setIsInsuranceEnabled] = useState(false);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const isEligible = trustScore > 0.7;
  const coverageAmount = isEligible ? 'Up to 10,000 HTR' : 'Not eligible';

  const handleSubmit = () => {
    if (!isEligible) {
      setMessage('You need a trust score above 70% to use transaction insurance');
      return;
    }

    if (!amount || !recipient) {
      setMessage('Please enter both amount and recipient');
      return;
    }

    setShowForm(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setMessage(
        `Transaction of ${amount} HTR would be processed with ${isInsuranceEnabled ? '' : 'out'} insurance coverage.`
      );
    }, 1500);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ marginTop: 0, color: '#1f2937' }}>
        Transaction Insurance
      </h2>

      {isEligible ? (
        showForm ? (
          <>
            <p style={{ color: '#047857' }}>
              You qualify for AI-powered transaction insurance:
            </p>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.5rem', color: '#047857' }}>
              <li>Coverage: {coverageAmount} per transaction</li>
              <li>Automatic fraud detection</li>
              <li>Smart contract failure protection</li>
            </ul>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
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
                  border: '1px solid #d1d5db'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Amount (HTR)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={isInsuranceEnabled}
                  onChange={(e) => setIsInsuranceEnabled(e.target.checked)}
                />
                Enable Transaction Insurance (0.2% fee)
              </label>
            </div>

            <button
              onClick={handleSubmit}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Send Transaction
            </button>
          </>
        ) : isProcessing ? (
          <div style={{ margin: '2rem 0', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', width: '50px', height: '50px', border: '3px solid rgba(16, 185, 129, 0.3)', borderRadius: '50%', borderTopColor: '#10b981', animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '1rem' }}>Processing transaction...</p>
          </div>
        ) : null
      ) : (
        <>
          <p style={{ color: '#6b7280' }}>
            Transaction insurance is available for wallets with trust scores above 70%.
          </p>
          <div style={{
            padding: '1rem',
            backgroundColor: '#ffffff',
            borderRadius: '0.5rem',
            borderLeft: '4px solid #9ca3af',
            marginTop: '1rem'
          }}>
            <p style={{ margin: 0, color: '#6b7280' }}>
              Build your trust score to qualify for this protection.
            </p>
          </div>
        </>
      )}

      {message && !isProcessing && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: message.includes('need') ? '#fef2f2' : '#ecfdf5',
          borderRadius: '0.5rem',
          borderLeft: `4px solid ${message.includes('need') ? '#ef4444' : '#10b981'}`
        }}>
          <p style={{ margin: 0, color: message.includes('need') ? '#b91c1c' : '#065f46' }}>
            {message}
          </p>
          {isEligible && (
            <button
              onClick={() => {
                setMessage('');
                setShowForm(true);
                setRecipient('');
                setAmount('');
              }}
              style={{
                marginTop: '0.5rem',
                padding: '0.25rem 0.5rem',
                backgroundColor: 'transparent',
                color: message.includes('need') ? '#b91c1c' : '#065f46',
                border: '1px solid currentColor',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
            >
              New Transaction
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Job Board Access Component
export const JobBoardAccessFeature: React.FC<{ trustScore: number }> = ({ trustScore }) => {
  const [selectedJob, setSelectedJob] = useState('');
  const [application, setApplication] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const jobs = [
    {
      id: 'auditor',
      title: 'Smart Contract Auditor',
      minTrust: 0.8,
      reward: '5000 HTR',
      description: 'Review and audit smart contracts for security vulnerabilities'
    },
    {
      id: 'dao',
      title: 'DAO Contributor',
      minTrust: 0.6,
      reward: '2000 HTR/month',
      description: 'Participate in governance and decision making for a DAO'
    },
    {
      id: 'moderator',
      title: 'Community Moderator',
      minTrust: 0.7,
      reward: '1500 HTR/month',
      description: 'Moderate community channels and help onboard new members'
    },
  ];

  const canApply = (minTrust: number) => trustScore >= minTrust;

  const handleSubmit = () => {
    if (!selectedJob) {
      setMessage('Please select a job to apply for');
      return;
    }

    const job = jobs.find(j => j.id === selectedJob);
    if (job && !canApply(job.minTrust)) {
      setMessage('Your trust score is too low for this position');
      return;
    }

    if (!application) {
      setMessage('Please write an application message');
      return;
    }

    setShowForm(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setMessage(`Application for ${job?.title} would be submitted.`);
    }, 1500);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginTop: 0, color: '#1f2937' }}>Web3 Job Board</h2>
      <p style={{ color: '#4b5563' }}>
        Available opportunities based on your trust score:
      </p>

      {showForm ? (
        <>
          <div style={{ margin: '1.5rem 0' }}>
            {jobs.map((job) => (
              <div
                key={job.id}
                style={{
                  padding: '1rem',
                  marginBottom: '1rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '0.5rem',
                  border: `1px solid ${canApply(job.minTrust) ? '#a7f3d0' : '#e2e8f0'}`,
                  opacity: canApply(job.minTrust) ? 1 : 0.6
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={{ margin: 0 }}>{job.title}</h3>
                  <div style={{ fontWeight: 500, color: '#059669' }}>{job.reward}</div>
                </div>
                <p style={{ margin: '0.5rem 0', color: '#4b5563' }}>{job.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <small style={{ color: '#64748b' }}>Min. Trust: {(job.minTrust * 100).toFixed(0)}%</small>
                  <label>
                    <input
                      type="radio"
                      name="job"
                      value={job.id}
                      checked={selectedJob === job.id}
                      onChange={() => setSelectedJob(job.id)}
                      disabled={!canApply(job.minTrust)}
                    />
                    Select
                  </label>
                </div>
              </div>
            ))}
          </div>

          {selectedJob && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Application Message
              </label>
              <textarea
                value={application}
                onChange={(e) => setApplication(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  minHeight: '100px'
                }}
                placeholder="Why are you a good fit for this position?"
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            disabled={!selectedJob}
          >
            Submit Application
          </button>
        </>
      ) : isProcessing ? (
        <div style={{ margin: '2rem 0', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', width: '50px', height: '50px', border: '3px solid rgba(59, 130, 246, 0.3)', borderRadius: '50%', borderTopColor: '#3b82f6', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem' }}>Processing application...</p>
        </div>
      ) : null}

      {message && !isProcessing && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: message.includes('low') ? '#fef2f2' : '#ecfdf5',
          borderRadius: '0.5rem',
          borderLeft: `4px solid ${message.includes('low') ? '#ef4444' : '#10b981'}`
        }}>
          <p style={{ margin: 0, color: message.includes('low') ? '#b91c1c' : '#065f46' }}>
            {message}
          </p>
          <button
            onClick={() => {
              setMessage('');
              setShowForm(true);
              setSelectedJob('');
              setApplication('');
            }}
            style={{
              marginTop: '0.5rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: 'transparent',
              color: message.includes('low') ? '#b91c1c' : '#065f46',
              border: '1px solid currentColor',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Apply for Another Job
          </button>
        </div>
      )}
    </div>
  );
};

// Community Access Component
export const CommunityAccessFeature: React.FC<{ trustScore: number }> = ({ trustScore }) => {
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const communities = [
    {
      id: 'general',
      name: 'General Chat',
      minTrust: 0,
      icon: '💬',
      description: 'Open discussions about Hathor and Web3'
    },
    {
      id: 'nft',
      name: 'NFT Collectors',
      minTrust: 0.4,
      icon: '🖼️',
      description: 'Discuss NFT trends and collections'
    },
    {
      id: 'dev',
      name: 'Developers',
      minTrust: 0.5,
      icon: '👨‍💻',
      description: 'Technical discussions for Hathor developers'
    },
    {
      id: 'investors',
      name: 'Premium Investors',
      minTrust: 0.7,
      icon: '💰',
      description: 'Exclusive channel for high-trust investors'
    },
  ];

  const canJoin = (minTrust: number) => trustScore >= minTrust;

  const handleJoin = () => {
    if (!selectedCommunity) {
      setMessage('Please select a community to join');
      return;
    }

    const community = communities.find(c => c.id === selectedCommunity);
    if (community && !canJoin(community.minTrust)) {
      setMessage('Your trust score is too low for this community');
      return;
    }

    setShowForm(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setMessage(`You would be granted access to ${community?.name}.`);
    }, 1500);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginTop: 0, color: '#1f2937' }}>Community Access</h2>
      <p style={{ color: '#4b5563' }}>
        Your trust score grants access to exclusive communities:
      </p>

      {showForm ? (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
            margin: '1.5rem 0'
          }}>
            {communities.map((community) => (
              <div
                key={community.id}
                onClick={() => canJoin(community.minTrust) && setSelectedCommunity(community.id)}
                style={{
                  padding: '1rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '0.5rem',
                  border: `1px solid ${canJoin(community.minTrust) ? '#bae6fd' : '#e2e8f0'}`,
                  textAlign: 'center',
                  opacity: canJoin(community.minTrust) ? 1 : 0.6,
                  cursor: canJoin(community.minTrust) ? 'pointer' : 'default',
                  ...(selectedCommunity === community.id && {
                    border: '2px solid #3b82f6',
                    boxShadow: '0 0 0 1px #3b82f6'
                  })
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  {community.icon}
                </div>
                <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>{community.name}</h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
                  {community.description}
                </p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                  {canJoin(community.minTrust)
                    ? '✅ Access granted'
                    : `Requires ${(community.minTrust * 100).toFixed(0)}% trust`}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleJoin}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            disabled={!selectedCommunity}
          >
            Join Community
          </button>
        </>
      ) : isProcessing ? (
        <div style={{ margin: '2rem 0', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', width: '50px', height: '50px', border: '3px solid rgba(59, 130, 246, 0.3)', borderRadius: '50%', borderTopColor: '#3b82f6', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem' }}>Processing request...</p>
        </div>
      ) : null}

      {message && !isProcessing && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: message.includes('low') ? '#fef2f2' : '#ecfdf5',
          borderRadius: '0.5rem',
          borderLeft: `4px solid ${message.includes('low') ? '#ef4444' : '#10b981'}`
        }}>
          <p style={{ margin: 0, color: message.includes('low') ? '#b91c1c' : '#065f46' }}>
            {message}
          </p>
          <button
            onClick={() => {
              setMessage('');
              setShowForm(true);
              setSelectedCommunity('');
            }}
            style={{
              marginTop: '0.5rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: 'transparent',
              color: message.includes('low') ? '#b91c1c' : '#065f46',
              border: '1px solid currentColor',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Join Another Community
          </button>
        </div>
      )}
    </div>
  );
};

// NFT Reputation Component
export const NFTReputationFeature: React.FC<{ trustScore: number }> = ({ trustScore }) => {
  const [isMinting, setIsMinting] = useState(false);
  const [message, setMessage] = useState('');
  const [showBadge, setShowBadge] = useState(true);

  const getBadgeLevel = () => {
    if (trustScore < 0.3) return 1;
    if (trustScore < 0.6) return 2;
    if (trustScore < 0.8) return 3;
    return 4;
  };

  const badgeLevel = getBadgeLevel();
  const badgeColors = ['#6b7280', '#3b82f6', '#8b5cf6', '#10b981'];
  const badgeNames = ['Novice', 'Trusted', 'Expert', 'Legend'];

  const handleMint = () => {
    setShowBadge(false);
    setIsMinting(true);
    setTimeout(() => {
      setIsMinting(false);
      setMessage(`You have minted a ${badgeNames[badgeLevel - 1]} Badge NFT.`);
    }, 2000);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ marginTop: 0, color: '#1f2937' }}>Reputation Badge NFT</h2>
      <p style={{ color: '#4b5563' }}>
        Your trust score qualifies you for this reputation level.
      </p>

      {showBadge && !isMinting && (
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: badgeColors[badgeLevel - 1],
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '2rem',
          fontWeight: 'bold',
          margin: '1.5rem auto',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          {badgeLevel}
        </div>
      )}

      {isMinting && (
        <div style={{ margin: '2rem 0' }}>
          <div style={{ display: 'inline-block', width: '50px', height: '50px', border: '3px solid rgba(139, 92, 246, 0.3)', borderRadius: '50%', borderTopColor: '#8b5cf6', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem' }}>Minting your badge NFT...</p>
        </div>
      )}

      {showBadge && !isMinting && (
        <>
          <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>
            {badgeNames[badgeLevel - 1]} Badge
          </h3>
          <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
            Higher scores unlock more prestigious badges.
          </p>

          <button
            onClick={handleMint}
            disabled={isMinting}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: 'pointer',
              opacity: isMinting ? 0.7 : 1
            }}
          >
            {isMinting ? 'Minting...' : 'Mint Badge NFT'}
          </button>
        </>
      )}

      {message && !isMinting && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#ecfdf5',
          borderRadius: '0.5rem',
          borderLeft: '4px solid #10b981'
        }}>
          <p style={{ margin: 0, color: '#065f46' }}>
            {message}
          </p>
          <button
            onClick={() => {
              setMessage('');
              setShowBadge(true);
            }}
            style={{
              marginTop: '0.5rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: 'transparent',
              color: '#065f46',
              border: '1px solid currentColor',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            View Badge Again
          </button>
        </div>
      )}
    </div>
  );
};

// Security Features Component
export const SecurityFeaturesFeature: React.FC<{ trustScore: number; riskData: any }> = ({
  trustScore,
  riskData
}) => {
  const [enhancedProtection, setEnhancedProtection] = useState(false);
  const [multiSig, setMultiSig] = useState(false);
  const [delay, setDelay] = useState(false);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const securityLevel = riskData?.riskScore > 0.6
    ? 'high'
    : riskData?.riskScore > 0.3
      ? 'medium'
      : 'low';

  const handleSubmit = () => {
    const features: string[] = [];
    if (enhancedProtection) features.push('Enhanced Protection');
    if (multiSig) features.push('Multi-Sig Wallet');
    if (delay) features.push('Transaction Delay');

    setShowForm(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setMessage(
        `Security features would be updated: ${features.join(', ') || 'No changes'}`
      );
    }, 1500);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ marginTop: 0, color: '#1f2937' }}>
        {securityLevel === 'high'
          ? 'High Risk - Security Alert'
          : securityLevel === 'medium'
            ? 'Medium Risk - Caution Advised'
            : 'Low Risk - Secure'}
      </h2>

      <p style={{ color: '#4b5563' }}>
        {securityLevel === 'high'
          ? 'Your wallet shows high risk indicators. Some features may be limited.'
          : securityLevel === 'medium'
            ? 'Your wallet shows moderate risk. Consider verifying your identity.'
            : 'Your wallet security status is good.'}
      </p>

      {showForm ? (
        <>
          <div style={{ margin: '1.5rem 0' }}>
            <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>Security Options</h3>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={enhancedProtection}
                  onChange={(e) => setEnhancedProtection(e.target.checked)}
                />
                Enhanced Protection (0.1% fee)
              </label>
              <p style={{ margin: '0.25rem 0 0 1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                Additional monitoring and fraud detection
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={multiSig}
                  onChange={(e) => setMultiSig(e.target.checked)}
                />
                Enable Multi-Sig Wallet
              </label>
              <p style={{ margin: '0.25rem 0 0 1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                Require multiple approvals for transactions
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={delay}
                  onChange={(e) => setDelay(e.target.checked)}
                />
                Transaction Delay (24 hours)
              </label>
              <p style={{ margin: '0.25rem 0 0 1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                Adds a delay to outgoing transactions
              </p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: securityLevel === 'high'
                ? '#ef4444'
                : securityLevel === 'medium'
                  ? '#f59e0b'
                  : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Update Security Settings
          </button>
        </>
      ) : isProcessing ? (
        <div style={{ margin: '2rem 0', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', width: '50px', height: '50px', border: '3px solid rgba(16, 185, 129, 0.3)', borderRadius: '50%', borderTopColor: '#10b981', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem' }}>Updating security settings...</p>
        </div>
      ) : null}

      {message && !isProcessing && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#ecfdf5',
          borderRadius: '0.5rem',
          borderLeft: '4px solid #10b981'
        }}>
          <p style={{ margin: 0, color: '#065f46' }}>
            {message}
          </p>
          <button
            onClick={() => {
              setMessage('');
              setShowForm(true);
            }}
            style={{
              marginTop: '0.5rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: 'transparent',
              color: '#065f46',
              border: '1px solid currentColor',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Change Settings
          </button>
        </div>
      )}
    </div>
  );
};