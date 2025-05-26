import Client from '@walletconnect/sign-client';
import { WalletConnectModal } from '@walletconnect/modal';
import { DEFAULT_APP_METADATA, DEFAULT_PROJECT_ID } from './constants';

let client: Client | null = null;
let walletConnectModal: WalletConnectModal | null = null;
let currentSession: any = null;

// Initialize WalletConnect Modal
function initModal(): void {
  if (!walletConnectModal) {
    walletConnectModal = new WalletConnectModal({
      projectId: DEFAULT_PROJECT_ID,
      themeMode: 'light',
      themeVariables: {
        '--wcm-z-index': '9999'
      }
    });
  }
}

// Mobile detection utility
function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// Show QR Code Modal
function showQRCodeModal(uri: string): void {
  initModal();
  walletConnectModal?.openModal({ uri });
}

// Close QR Code Modal
export function closeQRCodeModal(): void {
  walletConnectModal?.closeModal();
}

// Get or initialize WalletConnect client
export async function getWalletConnectClient(): Promise<Client> {
  if (client) return client;

  try {
    client = await Client.init({
      projectId: DEFAULT_PROJECT_ID,
      metadata: DEFAULT_APP_METADATA,
    });

    // Setup event listeners
    client.on('session_update', ({ topic, params }) => {
      console.log('Session updated:', topic, params);
      currentSession = client?.session.get(topic);
    });

    client.on('session_delete', ({ topic }) => {
      console.log('Session deleted:', topic);
      currentSession = null;
    });

    return client;
  } catch (error) {
    console.error('Failed to initialize WalletConnect client:', error);
    throw error;
  }
}

// Connect wallet
export async function connectWallet(): Promise<{
  address: string;
  chainId: string;
}> {
  try {
    const client = await getWalletConnectClient();
    currentSession = getActiveSession();

    if (currentSession) {
      const { accounts } = currentSession.namespaces.hathor;
      const [account] = accounts;
      const [chainId, address] = account.split(':');
      return { address, chainId };
    }

    const { uri, approval } = await client.connect({
      requiredNamespaces: {
        hathor: {
          methods: ['htr_signWithAddress', 'htr_sendNanoContractTx'],
          chains: ['hathor:testnet'],
          events: [],
        },
      },
    });

    if (uri) {
      if (isMobile()) {
        window.location.href = `reown://wc?uri=${encodeURIComponent(uri)}`;
      } else {
        showQRCodeModal(uri);
      }
    }

    // Wait for session approval
    const session = await approval();
    if (!session) throw new Error('Session approval failed');

    // Close modal immediately after approval
    closeQRCodeModal();

    currentSession = session;

    console.log('Session approved:', session);

    if (!session.namespaces.hathor) {
      throw new Error('Hathor namespace not found in session');
    }

    const { accounts } = session.namespaces.hathor;
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found in Hathor namespace');
    }

    const [account] = accounts;
    const [chainId, address] = account.split(':');

    return { address, chainId };
  } catch (error) {
    console.error('Wallet connection error:', error);
    closeQRCodeModal();
    throw error;
  }
}

// Disconnect wallet
export async function disconnectWallet(): Promise<void> {
  if (!client) return;

  try {
    const sessions = client.session.getAll();
    if (sessions.length > 0) {
      await client.disconnect({
        topic: sessions[0].topic,
        reason: {
          code: 6000,
          message: 'User disconnected'
        }
      });
    }
  } catch (error) {
    console.error('Failed to disconnect WalletConnect client:', error);
    throw error;
  } finally {
    client = null;
    currentSession = null;
    closeQRCodeModal();
  }
}

// Get active session
export function getActiveSession(): any {
  if (!client) return null;
  const sessions = client.session.getAll();
  return sessions.length > 0 ? sessions[0] : null;
}

// Get current session
export function getCurrentSession(): any {
  return currentSession;
}