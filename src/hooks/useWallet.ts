import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { WalletInfo } from '../types';

interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
  addListener?: (event: string, handler: (...args: any[]) => void) => void;
  isMetaMask?: boolean;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export const useWallet = () => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  // 检查 MetaMask 是否已安装
  useEffect(() => {
    const checkMetaMask = () => {
      const hasEthereum = typeof window.ethereum !== 'undefined';
      const isMetaMask = hasEthereum && (
        window.ethereum?.isMetaMask === true || 
        (window.ethereum as any)?.isMetaMask === true
      );
      setIsMetaMaskInstalled(isMetaMask);
    };
    
    checkMetaMask();
    
    // 监听 ethereum 对象的变化（每秒检查一次，最多检查 10 秒）
    let count = 0;
    const interval = setInterval(() => {
      checkMetaMask();
      count++;
      if (count >= 10) {
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const connectMetaMask = useCallback(async () => {
    if (!window.ethereum) {
      setError('请安装 MetaMask 扩展');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // 检查 MetaMask 是否可用
      if (typeof window.ethereum.request !== 'function') {
        throw new Error('MetaMask 未正确安装或已禁用');
      }

      // 添加超时处理
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('连接超时，请检查 MetaMask 是否已解锁')), 10000);
      });

      // 请求账户访问（带超时）
      const accounts = await Promise.race([
        window.ethereum.request({
          method: 'eth_requestAccounts',
        }),
        timeoutPromise,
      ]) as string[];

      if (!accounts || accounts.length === 0) {
        throw new Error('未获取到账户，请解锁 MetaMask');
      }

      const address = accounts[0];

      // 创建 provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // 获取余额（带超时）
      const balancePromise = provider.getBalance(address);
      const balanceTimeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('获取余额超时')), 5000);
      });
      const balance = await Promise.race([balancePromise, balanceTimeout]) as bigint;
      
      // 获取网络信息（带超时）
      const networkPromise = provider.getNetwork();
      const networkTimeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('获取网络信息超时')), 5000);
      });
      const network = await Promise.race([networkPromise, networkTimeout]) as ethers.Network;
      const networkName = network.name || `Chain ${network.chainId}`;

      setProvider(provider);
      setWalletInfo({
        address,
        balance: ethers.formatEther(balance),
        network: networkName,
        provider: 'metamask',
      });
    } catch (err: any) {
      console.error('MetaMask 连接错误:', err);
      
      // 处理用户拒绝的情况
      if (err.code === 4001) {
        setError('用户拒绝了连接请求');
      } else if (err.code === -32002) {
        setError('连接请求已在进行中，请检查 MetaMask 弹窗');
      } else if (err.message?.includes('超时')) {
        setError(err.message);
      } else if (err.message?.includes('message channel')) {
        setError('MetaMask 通信失败，请刷新页面后重试');
      } else {
        setError(err.message || '连接失败，请确保 MetaMask 已解锁并刷新页面重试');
      }
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const connectWalletConnect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // 注意：实际使用时需要配置 WalletConnect 项目 ID
      // 这里使用模拟实现
      const mockAddress = '0x' + Array.from({ length: 40 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      // 创建模拟的 BrowserProvider
      const mockProvider = {
        getBalance: async (address: string) => {
          // 模拟余额变化
          const baseBalance = 1.5;
          const variation = (Math.random() - 0.5) * 0.1;
          return ethers.parseEther((baseBalance + variation).toFixed(4));
        },
        getNetwork: async () => ({ name: 'mainnet', chainId: 1n }),
      } as any;

      const balance = await mockProvider.getBalance(mockAddress);
      
      setProvider(mockProvider as any);
      setWalletInfo({
        address: mockAddress,
        balance: ethers.formatEther(balance),
        network: 'mainnet',
        provider: 'walletconnect',
      });
    } catch (err: any) {
      setError(err.message || 'WalletConnect 连接失败');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWalletInfo(null);
    setProvider(null);
    setError(null);
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!provider || !walletInfo) return;

    try {
      const balance = await provider.getBalance(walletInfo.address);
      setWalletInfo(prev => prev ? {
        ...prev,
        balance: ethers.formatEther(balance),
      } : null);
    } catch (err: any) {
      setError(err.message || '刷新余额失败');
    }
  }, [provider, walletInfo]);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      console.log('账户变更:', accounts);
      if (accounts.length === 0) {
        disconnect();
      } else {
        // 延迟连接，避免重复触发
        setTimeout(() => {
          connectMetaMask();
        }, 100);
      }
    };

    const handleChainChanged = (chainId: string) => {
      console.log('网络变更:', chainId);
      // 重新加载页面以更新网络信息
      window.location.reload();
    };

    // 使用 addListener 而不是 on（更兼容）
    try {
      if (window.ethereum.on) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
      } else if (window.ethereum.addListener) {
        window.ethereum.addListener('accountsChanged', handleAccountsChanged);
        window.ethereum.addListener('chainChanged', handleChainChanged);
      }
    } catch (err) {
      console.error('注册事件监听器失败:', err);
    }

    return () => {
      try {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      } catch (err) {
        console.error('移除事件监听器失败:', err);
      }
    };
  }, [connectMetaMask, disconnect]);

  return {
    walletInfo,
    isConnecting,
    error,
    connectMetaMask,
    connectWalletConnect,
    disconnect,
    refreshBalance,
    provider,
    isMetaMaskInstalled,
  };
};

