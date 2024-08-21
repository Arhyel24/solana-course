# Solana Wallet and Token Management

This repository provides a suite of functionalities for managing Solana wallets and tokens. It includes scripts for various operations, allowing you to interact with the Solana blockchain efficiently.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Airdrop SOL](#airdrop-sol)
  - [Generate Keypairs](#generate-keypairs)
  - [Create Account](#create-account)
  - [Transfer SOL](#transfer-sol)
  - [Transfer Token](#transfer-token)
  - [Mint Metadata](#mint-metadata)
- [Contributing](#contributing)
- [License](#license)

## Installation

To get started with this project, follow these steps:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd <repository-directory>
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```

## Usage

### Airdrop SOL

To request an airdrop of SOL to a specified wallet, execute the following TypeScript file:

```bash
ts-node airdrop.ts
```

### Generate Keypairs

To generate a new Solana keypair, use:

```bash
ts-node generate-keypairs.ts
```

### Create Account

To create a new Solana account, run:

```bash
ts-node create-account.ts
```

### Transfer SOL

To transfer SOL between accounts, execute:

```bash
ts-node transfer-sol.ts
```

### Transfer Token

For transferring SPL tokens, use:

```bash
ts-node transfer-token.ts
```

### Mint Metadata

To mint new token metadata, run:

```bash
ts-node mint-metadata.ts
```

## Contributing

Contributions are welcome! If you have suggestions or improvements, please submit a pull request or open an issue.

## License

This project is licensed under the [MIT License](LICENSE).
