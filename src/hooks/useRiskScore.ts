import { useState, useEffect, useCallback } from 'react';
import { RiskScore } from '../types';
import { Transaction } from '../types';

export const useRiskScore = (address: string | null, transactions: Transaction[], balance: string) => {
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateRiskScore = useCallback(async () => {
    if (!address) {
      setRiskScore(null);
      return;
    }

    setIsLoading(true);

    // 模拟 API 延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const transactionCount = transactions.length;
      const balanceNum = parseFloat(balance);
      
      // 简单的风险评分算法
      let score = 50; // 基础分
      
      // 交易数量影响
      if (transactionCount < 5) score -= 10;
      else if (transactionCount > 50) score += 10;
      
      // 余额影响
      if (balanceNum < 0.01) score += 15;
      else if (balanceNum > 10) score -= 5;
      
      // 随机因素（模拟可疑活动检测）
      const suspiciousActivity = Math.random() > 0.7;
      if (suspiciousActivity) score += 20;
      
      // 地址年龄（模拟）
      const age = Math.floor(Math.random() * 365) + 30;
      if (age < 90) score += 10;
      
      score = Math.max(0, Math.min(100, score));
      
      const level: 'low' | 'medium' | 'high' = 
        score < 40 ? 'low' : score < 70 ? 'medium' : 'high';

      setRiskScore({
        score,
        level,
        factors: {
          transactionCount,
          suspiciousActivity,
          age,
          balance: balanceNum,
        },
      });
    } catch (err) {
      console.error('计算风险评分失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address, transactions, balance]);

  useEffect(() => {
    calculateRiskScore();
  }, [calculateRiskScore]);

  return {
    riskScore,
    isLoading,
    refetch: calculateRiskScore,
  };
};

