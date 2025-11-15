import { motion } from 'framer-motion';
import { WalletConnect } from './components/WalletConnect';
import { TransactionList } from './components/TransactionList';
import { Charts } from './components/Charts';
import { RiskScore } from './components/RiskScore';
import { ThemeToggle } from './components/ThemeToggle';
import { useWallet } from './hooks/useWallet';
import { useTransactions } from './hooks/useTransactions';
import { useRiskScore } from './hooks/useRiskScore';
import './App.css';

function App() {
  const { walletInfo, provider } = useWallet();
  const { transactions, chartData, isLoading: transactionsLoading } = useTransactions(
    walletInfo?.address || null,
    provider
  );
  const { riskScore, isLoading: riskLoading } = useRiskScore(
    walletInfo?.address || null,
    transactions,
    walletInfo?.balance || '0'
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Web3 钱包可视化控制台</h1>
        <ThemeToggle />
      </header>

      <main className="app-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="wallet-section"
        >
          <WalletConnect />
        </motion.div>

        {walletInfo && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid-container"
            >
              <div className="card">
                <h2 className="card-title">风险评分</h2>
                <RiskScore riskScore={riskScore} isLoading={riskLoading} />
              </div>

              <div className="card">
                <h2 className="card-title">交易记录</h2>
                <TransactionList
                  transactions={transactions}
                  isLoading={transactionsLoading}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="charts-section"
            >
              <Charts chartData={chartData} transactions={transactions} />
            </motion.div>
          </>
        )}

        {!walletInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="welcome-message"
          >
            <h2>欢迎使用 Web3 钱包可视化控制台</h2>
            <p>请连接您的钱包以开始使用</p>
            <ul>
              <li>✅ 支持 MetaMask 和 WalletConnect</li>
              <li>📊 实时交易数据可视化</li>
              <li>🛡️ 钱包风险评分分析</li>
              <li>🎨 精美的动画效果</li>
              <li>🌓 深色/浅色主题切换</li>
            </ul>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default App;

