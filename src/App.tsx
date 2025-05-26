import React from 'react';
import { WalletProvider } from './contexts/WalletContext';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  return (
    <WalletProvider>
      <HomePage />
    </WalletProvider>
  );
};

export default App;