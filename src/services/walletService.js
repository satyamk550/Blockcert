export async function connectWallet() {
    // BACKEND_INTEGRATION_POINT
    // Purpose: connect the user's MetaMask wallet and return the active signer session.
    // Expected technology: ethers.js
    // Data required: browser wallet provider (`window.ethereum`), required chain/network configuration
    // Output expected: wallet address, chain ID, ethers provider, ethers signer
    throw new Error('connectWallet is not implemented yet.');
}

export async function switchWalletNetwork(targetChainId) {
    // BACKEND_INTEGRATION_POINT
    // Purpose: switch or add the required blockchain network before contract calls are made.
    // Expected technology: ethers.js
    // Data required: target chain ID, chain metadata, browser wallet provider
    // Output expected: confirmed active chain ID, wallet switch status
    throw new Error(`switchWalletNetwork is not implemented yet for ${targetChainId}.`);
}

export async function getWalletSession() {
    // BACKEND_INTEGRATION_POINT
    // Purpose: restore an existing wallet session when the app reloads.
    // Expected technology: ethers.js
    // Data required: browser wallet provider, optional persisted wallet state
    // Output expected: current wallet address, chain ID, session status
    throw new Error('getWalletSession is not implemented yet.');
}
