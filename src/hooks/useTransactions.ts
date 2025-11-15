import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { Transaction, ChartData } from '../types';

export const useTransactions = (address: string | null, provider: ethers.BrowserProvider | null) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const fetchTransactions = useCallback(async () => {
    if (!address || !provider) {
      setTransactions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 模拟交易数据（实际应该从区块链浏览器 API 获取）
      const mockTransactions: Transaction[] = Array.from({ length: 20 }, (_, i) => {
        const timestamp = Date.now() - (i * 24 * 60 * 60 * 1000); // 过去 20 天
        return {
          hash: '0x' + Array.from({ length: 64 }, () => 
            Math.floor(Math.random() * 16).toString(16)
          ).join(''),
          from: address,
          to: '0x' + Array.from({ length: 40 }, () => 
            Math.floor(Math.random() * 16).toString(16)
          ).join(''),
          value: (Math.random() * 5).toFixed(4),
          timestamp,
          blockNumber: 18000000 + i,
          gasUsed: (21000 + Math.random() * 10000).toFixed(0),
          gasPrice: (20 + Math.random() * 50).toFixed(0),
        };
      });

      setTransactions(mockTransactions);

      // 生成图表数据
      const chartDataMap = new Map<string, { value: number; count: number }>();
      
      mockTransactions.forEach(tx => {
        const date = new Date(tx.timestamp).toISOString().split('T')[0];
        const existing = chartDataMap.get(date) || { value: 0, count: 0 };
        chartDataMap.set(date, {
          value: existing.value + parseFloat(tx.value),
          count: existing.count + 1,
        });
      });

      const chartDataArray: ChartData[] = Array.from(chartDataMap.entries())
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setChartData(chartDataArray);
    } catch (err: any) {
      setError(err.message || '获取交易记录失败');
    } finally {
      setIsLoading(false);
    }
  }, [address, provider]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    chartData,
    isLoading,
    error,
    refetch: fetchTransactions,
  };
};

