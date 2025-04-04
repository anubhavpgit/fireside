# Fireside

A decentralized, real-time chat platform built with GunJS and Svelte that offers end-to-end encryption and high-performance messaging.

## Overview

Fireside leverages decentralized architecture to create a secure, fast, and private communication experience. Using GunJS for peer-to-peer data synchronization and Svelte for a reactive UI, the platform maintains both performance and privacy.

## Features

- **Decentralized Communication**: Peer-to-peer messaging with no central server
- **End-to-end Encryption**: Secure conversations only visible to participants
- **High Performance**: Svelte's reactive UI ensures smooth operation
- **Offline Support**: Continue conversations even without internet
- **Cross-platform**: Works on web, mobile, and desktop

## Installation

### Prerequisites

- Node.js (v18.0 or higher)
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/fireside.git
cd fireside

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Project Structure

```
fireside/
├── src/               # Application source
│   ├── components/    # Svelte components
│   ├── stores/        # Svelte stores & GunJS connections
│   └── lib            # ShadCn components
├── public/            # Static assets
└── docs/              # Documentation
```

## Usage

Visit `http://localhost:3000` to start using Fireside locally. Your data stays on your device and syncs directly with peers.

## Contributing

Contributions to Fireside are welcome! Please check out our [Contributing Guide](CONTRIBUTING.md) to get started.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
