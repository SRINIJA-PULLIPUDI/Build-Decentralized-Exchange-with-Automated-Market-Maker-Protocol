# DEX AMM Project

## Overview
This project implements a simplified Decentralized Exchange (DEX) using an Automated Market Maker (AMM) model inspired by Uniswap V2. 
It allows users to trade ERC-20 tokens directly from liquidity pools without relying on order books or centralized intermediaries.
Liquidity providers earn fees from trades while maintaining full custody of their assets.

## Features
- Initial and subsequent liquidity provision
- Liquidity removal with proportional share calculation
- Token swaps using constant product formula (x * y = k)
- 0.3% trading fee for liquidity providers
- LP token minting and burning
- Fully permissionless and non-custodial design
- Dockerized development and testing environment

## Architecture
The core of the system is a single `DEX.sol` smart contract that:
- Holds reserves of two ERC-20 tokens
- Tracks liquidity providers’ shares internally
- Implements swap, add liquidity, and remove liquidity logic

Supporting contracts:
- `MockERC20.sol`: A simple ERC-20 token used for testing

Key design decisions:
- Uses Solidity ^0.8.x for built-in overflow protection
- Uses OpenZeppelin’s `SafeERC20` for safe token transfers
- Uses `ReentrancyGuard` to prevent reentrancy attacks
- Maintains internal reserve variables instead of querying balances directly

## Mathematical Implementation

### Constant Product Formula
The AMM follows the invariant:

x * y = k

Where:
- x = reserve of token A
- y = reserve of token B
- k = constant product

During swaps, the output amount is calculated such that `k` does not decrease (ignoring rounding), ensuring fair pricing and liquidity preservation.

### Fee Calculation
A 0.3% fee is applied on every swap:
- Only 99.7% of the input amount is used for price calculation
- Formula:
```
amountInWithFee = amountIn * 997
amountOut = (amountInWithFee * reserveOut) / (reserveIn * 1000 + amountInWithFee)
```
The fee remains in the pool, increasing `k` over time and benefiting liquidity providers.

### LP Token Minting
- **Initial Liquidity Provider**:
```
liquidityMinted = sqrt(amountA * amountB)
```
- **Subsequent Liquidity Providers**:
```
liquidityMinted = (amountA * totalLiquidity) / reserveA
```
Liquidity providers receive LP tokens proportional to their share of the pool.

## Setup Instructions

### Prerequisites
- Docker and Docker Compose installed
- Git
- (Optional) Node.js 18+ for local testing

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SRINIJA-PULLIPUDI/Build-Decentralized-Exchange-with-Automated-Market-Maker-Protocol.git
cd dex-amm
```

2. Start Docker environment:
```bash
docker-compose up -d
```

3. Compile contracts:
```bash
docker-compose exec app npm run compile
```

4. Run tests:
```bash
docker-compose exec app npm test
```

5. Check coverage:
```bash
docker-compose exec app npm run coverage
```

6. Stop Docker:
```bash
docker-compose down
```

## Running Tests Locally (without Docker)
```bash
npm install
npm run compile
npm test
```

## Contract Addresses
Not deployed to a public testnet. Deployment scripts are provided for local Hardhat network usage.

## Known Limitations
- Single trading pair per DEX instance
- No price oracle or TWAP implementation
- LP tokens are tracked internally rather than as a separate ERC-20 token
- Not optimized for gas efficiency beyond basic best practices

## Security Considerations
- Reentrancy protection using `ReentrancyGuard`
- Safe token transfers via `SafeERC20`
- Input validation for zero amounts and insufficient liquidity
- Solidity 0.8.x overflow and underflow protection
- Explicit reserve tracking to avoid balance manipulation
