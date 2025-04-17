
# 📈 Reinforcement Learning for Stock Trading — DQN-Based Agents

This project implements and compares various Deep Q-Network (DQN) based reinforcement learning agents to trade stocks using different policy strategies, reward mechanisms, and neural network architectures.

---

## 🧠 Project Motivation

> _"I am making an RL bot..."_ — From the beginning, the project revolved around testing realistic trading strategies via reinforcement learning. After struggling with flat MLP policies that fail to capture temporal dependencies, we explored hybrid deep learning models like CNNs and LSTMs.

The main question:
> How much should the bot buy, sell, or hold? Can temporal patterns be exploited for more intelligent decisions?

We experimented with:
- Discrete Action Spaces (Buy/Sell/Hold)
- "All-In" Strategy (buy/sell everything at once)
- Continuous Control Plans (upcoming)
- Multiple reward strategies including Sharpe Ratio and Net Worth delta

---

## 🧪 Experiments and Notebooks

Each notebook corresponds to a unique combination of architecture, trading strategy, and reward signal:

- **DQN_CustomPolicy(CNN)_AllInPolicy.ipynb**: Uses **CNN** architecture with **All-In Policy** and **Basic Reward**.- **DQN_CustomPolicy(CNN)_AllInPolicy-SharpeRatio.ipynb**: Uses **CNN** architecture with **All-In Policy** and **Sharpe Ratio-based Reward**.- **DQN_CustomPolicy(CNN)_OneStockPolicy.ipynb**: Uses **CNN** architecture with **One-Stock Policy** and **Basic Reward**.- **DQN_CustomPolicy(CNN)_OneStockPolicy-SharpeRatio.ipynb**: Uses **CNN** architecture with **One-Stock Policy** and **Sharpe Ratio-based Reward**.- **DQN_CustomPolicy(CNN-LSTM)_AllInPolicy.ipynb**: Uses **CNN-LSTM** architecture with **All-In Policy** and **Basic Reward**.- **DQN_CustomPolicy(CNN-LSTM)_OneStockPolicy.ipynb**: Uses **CNN-LSTM** architecture with **One-Stock Policy** and **Basic Reward**.- **DQN_MlpPolicy_AllInPolicy.ipynb**: Uses **MLP** architecture with **All-In Policy** and **Basic Reward**.- **DQN_MlpPolicy_AllInPolicy-NetWorthCentric.ipynb**: Uses **MLP** architecture with **All-In Policy** and **Net Worth-Centric Reward**.- **DQN_MlpPolicy_OneStockPolicy.ipynb**: Uses **MLP** architecture with **One-Stock Policy** and **Basic Reward**.- **DQN_MlpPolicy_OneStockPolicy-NetWorthCentric.ipynb**: Uses **MLP** architecture with **One-Stock Policy** and **Net Worth-Centric Reward**.

---

## 🧾 Action Space Variants

1. **OneStockPolicy (Discrete)**: Buy/Sell/Hold fixed single unit
2. **AllInPolicy (Discrete)**: Buy or sell full amount (100%)
3. **Continuous (Upcoming)**: Fractional trade between [-1, 1] using PPO/DDPG

---

## 🔍 Key Design Elements

- **State Space**: Context windows of historical data with technical indicators
- **Neural Architectures**:
  - MLP (default Stable-Baselines3)
  - Custom CNN
  - Hybrid CNN-LSTM
- **Custom Feature Extractors**: Used for deep temporal feature modeling
- **Reward Strategies**:
  - Profit/Loss Delta
  - Sharpe Ratio Boosting
  - Net Worth-centric progression
- **Evaluation**:
  - Trading Signal Visualization
  - Net Worth Growth
  - Sharpe Ratio Comparison

---

## 🔧 How to Run

1. Clone the repo and install dependencies:
```bash
pip install stable-baselines3[extra] gym pandas matplotlib
```

2. Run any notebook from Jupyter or Colab:
```bash
jupyter notebook DQN_MlpPolicy_AllInPolicy.ipynb
```

3. (Optional) Edit policies, indicators, and context window sizes inside each notebook

---

## 📚 Future Directions

- Implement PPO/DDPG for **continuous action control**
- Add **sentiment analysis** and **commodity correlation features**
- Integrate **real-time backtesting engine**
- Explore **multi-stock environments** or **portfolio balancing**

---

---
