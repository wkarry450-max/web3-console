import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight, Clock } from 'lucide-react';
import { Transaction } from '../types';
import './TransactionList.css';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export const TransactionList = ({ transactions, isLoading }: TransactionListProps) => {
  if (isLoading) {
    return (
      <div className="transaction-list-loading">
        <div className="spinner"></div>
        <p>加载交易记录中...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="transaction-list-empty">
        <p>暂无交易记录</p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      {transactions.map((tx, index) => (
        <motion.div
          key={tx.hash}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="transaction-item"
        >
          <div className="transaction-icon">
            <ArrowRight size={20} />
          </div>
          <div className="transaction-content">
            <div className="transaction-header">
              <span className="transaction-hash">
                {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
              </span>
              <a
                href={`https://etherscan.io/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transaction-link"
              >
                <ExternalLink size={14} />
              </a>
            </div>
            <div className="transaction-details">
              <div className="transaction-detail-item">
                <span className="label">金额:</span>
                <span className="value">{parseFloat(tx.value).toFixed(4)} ETH</span>
              </div>
              <div className="transaction-detail-item">
                <span className="label">Gas:</span>
                <span className="value">{tx.gasUsed}</span>
              </div>
              <div className="transaction-detail-item">
                <span className="label">时间:</span>
                <span className="value">
                  <Clock size={12} />
                  {new Date(tx.timestamp).toLocaleString('zh-CN')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

