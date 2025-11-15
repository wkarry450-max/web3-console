import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { RiskScore as RiskScoreType } from '../types';
import './RiskScore.css';

interface RiskScoreProps {
  riskScore: RiskScoreType | null;
  isLoading: boolean;
}

export const RiskScore = ({ riskScore, isLoading }: RiskScoreProps) => {
  if (isLoading) {
    return (
      <div className="risk-score-loading">
        <div className="spinner"></div>
        <p>计算风险评分中...</p>
      </div>
    );
  }

  if (!riskScore) {
    return (
      <div className="risk-score-empty">
        <p>暂无风险评分数据</p>
      </div>
    );
  }

  const getScoreColor = () => {
    if (riskScore.level === 'low') return 'var(--accent-success)';
    if (riskScore.level === 'medium') return 'var(--accent-warning)';
    return 'var(--accent-danger)';
  };

  const getScoreIcon = () => {
    if (riskScore.level === 'low') return <CheckCircle size={24} />;
    if (riskScore.level === 'medium') return <AlertTriangle size={24} />;
    return <Shield size={24} />;
  };

  const getScoreLabel = () => {
    if (riskScore.level === 'low') return '低风险';
    if (riskScore.level === 'medium') return '中等风险';
    return '高风险';
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (riskScore.score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="risk-score"
    >
      <div className="risk-score-header">
        <div className="risk-score-icon" style={{ color: getScoreColor() }}>
          {getScoreIcon()}
        </div>
        <div>
          <h3 className="risk-score-title">钱包风险评分</h3>
          <p className="risk-score-label" style={{ color: getScoreColor() }}>
            {getScoreLabel()}
          </p>
        </div>
      </div>

      <div className="risk-score-circle">
        <svg width="120" height="120" className="score-svg">
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="var(--border-color)"
            strokeWidth="8"
          />
          <motion.circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke={getScoreColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="score-value" style={{ color: getScoreColor() }}>
          {riskScore.score}
        </div>
      </div>

      <div className="risk-factors">
        <div className="risk-factor">
          <span className="factor-label">交易数量</span>
          <span className="factor-value">{riskScore.factors.transactionCount}</span>
        </div>
        <div className="risk-factor">
          <span className="factor-label">地址年龄</span>
          <span className="factor-value">{riskScore.factors.age} 天</span>
        </div>
        <div className="risk-factor">
          <span className="factor-label">余额</span>
          <span className="factor-value">{riskScore.factors.balance.toFixed(4)} ETH</span>
        </div>
        <div className="risk-factor">
          <span className="factor-label">可疑活动</span>
          <span className="factor-value" style={{ 
            color: riskScore.factors.suspiciousActivity ? 'var(--accent-danger)' : 'var(--accent-success)' 
          }}>
            {riskScore.factors.suspiciousActivity ? '是' : '否'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

