// js/modules/: Wallet-facing integrations and UI behavior for Web3 entry points.

import { BLOCKCHAIN_CONFIG, SIMULATED_WALLET_ADDRESS } from '../../config/blockchainConfig.js';

// BACKEND_INTEGRATION_POINT
// Purpose: connect the user's MetaMask wallet, validate the active network, and expose a signer/provider for Web3 actions.
// Expected technology: ethers.js
// Data required: browser wallet provider (`window.ethereum`), required chain configuration from `BLOCKCHAIN_CONFIG`
// Output expected: connected wallet address, active chain/network, ethers provider, ethers signer
export async function connectWallet() {
    return {
        address: SIMULATED_WALLET_ADDRESS,
        network: BLOCKCHAIN_CONFIG.networkName,
        provider: BLOCKCHAIN_CONFIG.walletProvider
    };
}

export function initializeWalletUi() {
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    const walletAddressSpan = document.getElementById('walletAddress');

    if (!connectWalletBtn) {
        return;
    }

    let isWalletConnected = false;

    const renderWalletStatus = () => {
        if (!walletAddressSpan) return;

        if (!isWalletConnected) {
            walletAddressSpan.textContent = 'Wallet not connected.';
            return;
        }

        walletAddressSpan.innerHTML = 'Total Credentials: 4 | Wallet Address: 0xAbC...dEf9 <i class="fa-regular fa-copy copy-icon" title="Copy"></i>';
        const copyIcon = walletAddressSpan.querySelector('.copy-icon');

        if (copyIcon) {
            copyIcon.addEventListener('click', () => {
                navigator.clipboard.writeText(SIMULATED_WALLET_ADDRESS).then(() => {
                    const previousMarkup = walletAddressSpan.innerHTML;
                    walletAddressSpan.innerHTML = 'Address Copied! <i class="fa-solid fa-check"></i>';

                    setTimeout(() => {
                        walletAddressSpan.innerHTML = previousMarkup;
                        renderWalletStatus();
                    }, 1200);
                }).catch((error) => {
                    console.error('Failed to copy wallet address:', error);
                });
            });
        }
    };

    // BACKEND_INTEGRATION_POINT
    // Purpose: handle the wallet connection button click and update the UI with the real wallet state returned by MetaMask.
    // Expected technology: ethers.js
    // Data required: wallet button click event, connected wallet metadata from `connectWallet()`
    // Output expected: authenticated wallet session in UI, address display, connected button state, error state if rejected
    connectWalletBtn.addEventListener('click', async () => {
        await connectWallet();
        isWalletConnected = true;
        connectWalletBtn.textContent = 'Wallet Connected';
        renderWalletStatus();
    });

    renderWalletStatus();
}
