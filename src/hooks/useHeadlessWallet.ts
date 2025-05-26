import { useState, useEffect, useCallback } from 'react';

export const useHeadlessWallet = () => {
  const [walletReady, setWalletReady] = useState(false);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initializeWallet = useCallback(async (id: string) => {
    try {
      // Check if wallet exists
      const exists = await fetch(`http://localhost:8000/wallet/status`, {
        headers: { 'X-Wallet-Id': id }
      });

      if (!exists.ok) {
        // Create wallet if doesn't exist
        const createRes = await fetch('http://localhost:8000/wallet/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletId: id })
        });

        if (!createRes.ok) {
          throw new Error('Failed to create wallet');
        }
      }

      setWalletId(id);
      setWalletReady(true);
    } catch (err) {
      console.error('Wallet init error:', err);
      setError(err instanceof Error ? err.message : 'Wallet initialization failed');
    }
  }, []);

  const createNewWallet = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:8000/wallet/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      return data.walletId;
    } catch (err) {
      console.error('Create wallet error:', err);
      throw err;
    }
  }, []);

  return {
    walletReady,
    walletId,
    error,
    initializeWallet,
    createNewWallet
  };
};