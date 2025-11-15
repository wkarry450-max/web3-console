export interface WalletInfo {
  address: string;
  balance: string;
  network: string;
  provider: 'metamask' | 'walletconnect' | null;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  blockNumber: number;
  gasUsed: string;
  gasPrice: string;
}

export interface RiskScore {
  score: number;
  level: 'low' | 'medium' | 'high';
  factors: {
    transactionCount: number;
    suspiciousActivity: boolean;
    age: number;
    balance: number;
  };
}

export interface ChartData {
  date: string;
  value: number;
  count: number;
}

