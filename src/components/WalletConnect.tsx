import { motion } from 'framer-motion';
import { Wallet, X, RefreshCw } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import './WalletConnect.css';

export const WalletConnect = () => {
  const { walletInfo, isConnecting, error, connectMetaMask, connectWalletConnect, disconnect, refreshBalance, isMetaMaskInstalled } = useWallet();

  if (walletInfo) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="wallet-connected"
      >
        <div className="wallet-info">
          <div className="wallet-icon">
            <Wallet size={24} />
          </div>
          <div className="wallet-details">
            <div className="wallet-address">
              {walletInfo.address.slice(0, 6)}...{walletInfo.address.slice(-4)}
            </div>
            <div className="wallet-balance">
              {parseFloat(walletInfo.balance).toFixed(4)} ETH
            </div>
            <div className="wallet-network">
              {walletInfo.network} · {walletInfo.provider}
            </div>
          </div>
        </div>
        <div className="wallet-actions">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshBalance}
            className="btn-refresh"
          >
            <RefreshCw size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={disconnect}
            className="btn-disconnect"
          >
            <X size={16} />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="wallet-connect"
    >
      <div className="connect-buttons">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={connectMetaMask}
          disabled={isConnecting || !isMetaMaskInstalled}
          className="btn-connect metamask"
          title={!isMetaMaskInstalled ? '请先安装 MetaMask 扩展' : ''}
        >
          {isConnecting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="spinner-small"
            />
          ) : (
            <>
              <Wallet size={20} />
              <span>{!isMetaMaskInstalled ? '未检测到 MetaMask' : '连接 MetaMask'}</span>
            </>
          )}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={connectWalletConnect}
          disabled={isConnecting}
          className="btn-connect walletconnect"
        >
          {isConnecting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="spinner-small"
            />
          ) : (
            <>
              <Wallet size={20} />
              <span>连接 WalletConnect</span>
            </>
          )}
        </motion.button>
      </div>
      {!isMetaMaskInstalled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="info-message"
        >
          <p>未检测到 MetaMask，请先安装扩展：</p>
          <a 
            href="https://metamask.io/download/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="metamask-link"
          >
            下载 MetaMask
          </a>
        </motion.div>
      )}
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="error-message"
        >
          {error}
        </motion.div>
      )}
    </motion.div>
  );
};

