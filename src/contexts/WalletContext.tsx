import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { connectWallet, disconnectWallet, closeQRCodeModal, getActiveSession, getCurrentSession } from '../lib/walletConnect/client';

interface WalletData {
  wallet_age_days: number;
  tx_count: number;
  unique_token_count: number;
  total_token_balance: number;
  nfts_owned: number;
  last_tx_days_ago: number;
  smart_contracts_used: number;
  suspicious_activity_flag: number;
  peer_score: number;
}

interface RiskData {
  riskScore: number;
  recommendation: string;
}

interface WalletState {
  address: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  getButtonText: () => string;
  trustScore: number | null;
  walletData: WalletData | null;
  isCalculatingTrustScore: boolean;
  trustScoreError: string | null;
  riskData: RiskData | null;
  riskError: string | null;
}

const WalletContext = createContext<WalletState>({} as WalletState);

const generateSampleWalletData = (address: string): WalletData => {
  const hash = Array.from(address).reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return {
    wallet_age_days: Math.floor((hash % 1000) + 30),
    tx_count: Math.floor((hash % 500) + 10),
    unique_token_count: Math.floor(hash % 20),
    total_token_balance: Math.floor(hash % 10000),
    nfts_owned: Math.floor(hash % 10),
    last_tx_days_ago: Math.floor(hash % 30),
    smart_contracts_used: Math.floor(hash % 10),
    suspicious_activity_flag: (hash % 10) === 0 ? 1 : 0,
    peer_score: parseFloat(((hash % 800) / 1000 + 0.1).toFixed(2))
  };
};

const fetchRealTrustScore = async (walletData: WalletData): Promise<number> => {
  try {
    console.log("Sending to API:", walletData);

    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        features: {
          wallet_age_days: walletData.wallet_age_days,
          tx_count: walletData.tx_count,
          unique_token_count: walletData.unique_token_count,
          total_token_balance: walletData.total_token_balance,
          nfts_owned: walletData.nfts_owned,
          last_tx_days_ago: walletData.last_tx_days_ago,
          smart_contracts_used: walletData.smart_contracts_used,
          suspicious_activity_flag: walletData.suspicious_activity_flag,
          peer_score: walletData.peer_score
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "API request failed");
    }

    const result = await response.json();
    console.log("API response:", result);

    if (typeof result.trust_score !== 'number') {
      throw new Error("Invalid response format");
    }

    return result.trust_score;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(`Failed to calculate trust score: ${error instanceof Error ? error.message : String(error)}`);
  }
};

const fetchRiskAssessment = async (walletData: WalletData): Promise<RiskData> => {
  try {
    if (!walletData || !walletData.tx_count) {
      throw new Error("Incomplete wallet data");
    }

    const response = await fetch("http://localhost:5001/risk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        wallet_age_days: walletData.wallet_age_days,
        tx_count: walletData.tx_count,
        suspicious_activity_flag: walletData.suspicious_activity_flag,
        avg_tx_value: walletData.total_token_balance / Math.max(1, walletData.tx_count),
        token_diversity: walletData.unique_token_count / 20
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      riskScore: data.risk_score,
      recommendation: data.risk_score > 0.7 ? "High risk" :
                   data.risk_score > 0.4 ? "Moderate risk" :
                   "Low risk"
    };
  } catch (error) {
    console.error("Risk assessment error:", error);
    return {
      riskScore: -1,
      recommendation: "Risk analysis unavailable - " +
        (error instanceof Error ? error.message : "Network error")
    };
  }
};

export const WalletProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trustScore, setTrustScore] = useState<number | null>(null);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isCalculatingTrustScore, setIsCalculatingTrustScore] = useState(false);
  const [trustScoreError, setTrustScoreError] = useState<string | null>(null);
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [riskError, setRiskError] = useState<string | null>(null);

  const updateWalletState = useCallback(async (session: any) => {
    try {
      if (!session) {
        setIsConnected(false);
        return;
      }

      const hathorNamespace = session.namespaces?.hathor;
      if (!hathorNamespace) throw new Error("Hathor connection not established");

      const { accounts } = hathorNamespace;
      if (!accounts || accounts.length === 0) throw new Error("No wallet accounts available");

      const [account] = accounts;
      const parts = account.split(':');
      const address = parts[2];
      if (!address) throw new Error("Invalid address format");

      setAddress(address);
      setIsConnected(true);

      const sampleData = generateSampleWalletData(address);
      setWalletData(sampleData);

      setIsCalculatingTrustScore(true);
      setTrustScoreError(null);
      try {
        const score = await fetchRealTrustScore(sampleData);
        setTrustScore(score);
      } catch (err) {
        console.error("Trust score error:", err);
        setTrustScoreError("Failed to calculate trust score");
      } finally {
        setIsCalculatingTrustScore(false);
      }
    } catch (error) {
      console.error("Connection error:", error);
      setError(error instanceof Error ? error.message : "Connection failed");
      setIsConnected(false);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    if (walletData) {
      setRiskError(null);
      fetchRiskAssessment(walletData)
        .then(data => {
          setRiskData(data);
          if (data.riskScore === -1) {
            setRiskError(data.recommendation);
          }
        })
        .catch(error => {
          setRiskError(error instanceof Error ? error.message : "Failed to fetch risk assessment");
          setRiskData({
            riskScore: -1,
            recommendation: "Risk assessment unavailable"
          });
        });
    }
  }, [walletData]);

  const checkConnection = useCallback(async () => {
    try {
      const session = getCurrentSession() || getActiveSession();
      if (session) await updateWalletState(session);
      else setIsConnected(false);
    } catch (error) {
      console.error('Connection check error:', error);
    } finally {
      setIsInitializing(false);
    }
  }, [updateWalletState]);

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 3000);
    return () => clearInterval(interval);
  }, [checkConnection]);

  const connect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await connectWallet();
      const session = getCurrentSession() || getActiveSession();
      if (!session) throw new Error('No active session');
      await updateWalletState(session);
    } catch (error) {
      console.error('Connection error:', error);
      setError(error instanceof Error ? error.message : 'Connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      setIsLoading(true);
      await disconnectWallet();
      closeQRCodeModal();
      setAddress(null);
      setIsConnected(false);
      setError(null);
      setTrustScore(null);
      setWalletData(null);
      setTrustScoreError(null);
      setRiskData(null);
      setRiskError(null);
    } catch (error) {
      console.error('Disconnection error:', error);
      setError('Failed to disconnect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isInitializing) return 'Initializing...';
    if (isLoading) return 'Connecting...';
    if (isConnected && address) return `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`;
    if (isConnected) return 'Connected: Loading details...';
    return 'Connect Wallet';
  };

  return (
    <WalletContext.Provider value={{
      address,
      isConnected,
      connect,
      disconnect,
      isLoading,
      isInitializing,
      error,
      getButtonText,
      trustScore,
      walletData,
      isCalculatingTrustScore,
      trustScoreError,
      riskData,
      riskError
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};