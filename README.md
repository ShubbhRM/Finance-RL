```
███████╗██╗███╗   ██╗ █████╗ ███╗   ██╗ ██████╗███████╗      ██████╗ ██╗
██╔════╝██║████╗  ██║██╔══██╗████╗  ██║██╔════╝██╔════╝      ██╔══██╗██║
█████╗  ██║██╔██╗ ██║███████║██╔██╗ ██║██║     █████╗  █████╗██████╔╝██║
██╔══╝  ██║██║╚██╗██║██╔══██║██║╚██╗██║██║     ██╔══╝  ╚════╝██╔══██╗██║
██║     ██║██║ ╚████║██║  ██║██║ ╚████║╚██████╗███████╗      ██║  ██║███████╗
╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚══════╝      ╚═╝  ╚═╝╚══════╝
```

<div align="center">

**`[ Reinforcement Learning for Algorithmic Stock Trading ]`**

[![Jupyter](https://img.shields.io/badge/Jupyter-Notebook-F37626?style=flat-square&logo=jupyter&logoColor=white&labelColor=0a0a0a)](https://jupyter.org)
[![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=flat-square&logo=python&logoColor=white&labelColor=0a0a0a)](https://python.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-DL-EE4C2C?style=flat-square&logo=pytorch&logoColor=white&labelColor=0a0a0a)](https://pytorch.org)
[![SB3](https://img.shields.io/badge/Stable--Baselines3-RL-00ff41?style=flat-square&labelColor=0a0a0a)](https://stable-baselines3.readthedocs.io)
[![License](https://img.shields.io/badge/license-MIT-00ff41?style=flat-square&labelColor=0a0a0a)](LICENSE)
[![Portfolio](https://img.shields.io/badge/portfolio-live-00ff41?style=flat-square&labelColor=0a0a0a)](https://ShubbhRM.github.io/Finance-RL)

[**→ View Live Portfolio Page**](https://ShubbhRM.github.io/Finance-RL)

</div>

---

## `$ cat project.md`

A systematic study comparing **Deep Reinforcement Learning** agents for stock trading.
Each experiment isolates one variable — architecture, algorithm, or reward signal — to measure its effect on trading performance.

**Research questions:**
- Does CNN beat MLP for temporal price pattern recognition?
- Does LSTM sequential memory improve multi-step decision quality?
- Does Sharpe Ratio reward outperform raw P&L as a training signal?
- How does on-policy PPO compare to off-policy DQN in this setting?

---

## `$ ls experiments/`

| # | Notebook | Architecture | Algorithm | Strategy | Reward |
|---|----------|-------------|-----------|----------|--------|
| 01 | `DQN_MlpPolicy_OneStockPolicy.ipynb` | MLP | DQN | OneStock | P&L |
| 02 | `DQN_MlpPolicy_OneStockPolicy-NetWorthCentric.ipynb` | MLP | DQN | OneStock | NetWorth |
| 03 | `DQN_MlpPolicy_AllInPolicy.ipynb` | MLP | DQN | AllIn | P&L |
| 04 | `DQN_MlpPolicy_AllInPolicy-NetWorthCentric.ipynb` | MLP | DQN | AllIn | NetWorth |
| 05 | `DQN_MlpPolicy_YesFeature Scaling.ipynb` | MLP | DQN | OneStock | P&L *(+scaling)* |
| 06 | `DQN_CustomPolicy(CNN)_OneStockPolicy.ipynb` | CNN | DQN | OneStock | P&L |
| 07 | `DQN_CustomPolicy(CNN)_OneStockPolicy-SharpeRatio.ipynb` | CNN | DQN | OneStock | Sharpe |
| 08 | `DQN_CustomPolicy(CNN)_AllInPolicy.ipynb` | CNN | DQN | AllIn | P&L |
| 09 | `DQN_CustomPolicy(CNN)_AllInPolicy-SharpeRatio.ipynb` | CNN | DQN | AllIn | Sharpe |
| 10 | `DQN_CustomPolicy(CNN-LSTM)_OneStockPolicy.ipynb` | CNN-LSTM | DQN | OneStock | P&L |
| 11 | `DQN_CustomPolicy(CNN-LSTM)_AllInPolicy.ipynb` | CNN-LSTM | DQN | AllIn | P&L |
| 12 | `PPO_MlpPolicy_AllIn.ipynb` | MLP | PPO | AllIn | P&L |
| 13 | `PPO_MlpPolicy_AllIn-Copy1.ipynb` | MLP | PPO | AllIn | P&L |
| 14 | `ML Mods 1.ipynb` | MLP | DQN | OneStock | P&L *(ML mods)* |

---

## `$ cat architecture.md`

```
INPUT (OHLCV window)
        │
   ┌────┴──────────┐
   │               │               │
  MLP             CNN          CNN-LSTM
  FC×3          Conv1D×3       Conv1D×3
(256→128→64)    Flatten       LSTM(256)
   │               │               │
   └────────┬───────────────────────┘
            │
       Action Head
    [Buy / Sell / Hold]
```

| Architecture | Description | Experiments |
|---|---|---|
| **MLP** | Default SB3 `MlpPolicy` — FC layers (256→128→64→\|A\|) | 7 |
| **CNN** | Custom `Conv1D×3` extractor over price window | 4 |
| **CNN-LSTM** | Conv1D → LSTM(256) → FC — full sequential memory | 3 |

---

## `$ cat action_space.md`

| Strategy | Type | Description |
|---|---|---|
| **OneStockPolicy** | Discrete | `{Buy 1, Sell 1, Hold}` — fixed single unit |
| **AllInPolicy** | Discrete | `{Buy 100%, Sell 100%}` — all-or-nothing |
| **Continuous** *(upcoming)* | Continuous | Fractional `[-1, 1]` via PPO / DDPG |

---

## `$ cat reward_functions.md`

| Reward | Formula | Goal |
|---|---|---|
| **P&L Delta** | `Δ portfolio_value` | Maximize raw profit per step |
| **Sharpe Ratio** | `mean(returns) / std(returns)` | Risk-adjusted return |
| **Net Worth** | `cash + holdings × price` | Maximize total portfolio wealth |

---

## `$ ./install.sh`

```bash
# Clone
git clone https://github.com/ShubbhRM/Finance-RL.git
cd Finance-RL

# Install dependencies
pip install stable-baselines3[extra] gym pandas matplotlib torch

# Launch any experiment
jupyter notebook "DQN_CustomPolicy(CNN-LSTM)_OneStockPolicy.ipynb"
```

---

## `$ cat roadmap.md`

- [x] DQN with MLP policy
- [x] Custom CNN feature extractor
- [x] Hybrid CNN-LSTM architecture
- [x] Sharpe Ratio reward signal
- [x] Net Worth reward signal
- [x] PPO on-policy baseline
- [ ] DDPG continuous action control
- [ ] Sentiment analysis features
- [ ] Real-time backtesting engine
- [ ] Multi-stock / portfolio environment

---

<div align="center">

**`[ ShubbhRM / Finance-RL ]`**

[Portfolio](https://ShubbhRM.github.io/Finance-RL) · [Issues](https://github.com/ShubbhRM/Finance-RL/issues) · [Discussions](https://github.com/ShubbhRM/Finance-RL/discussions)

</div>
