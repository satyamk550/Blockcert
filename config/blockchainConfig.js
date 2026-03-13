// config/: Centralized runtime configuration for blockchain, storage, and network values.

export const BLOCKCHAIN_CONFIG = {
    appName: 'BlockCert',
    walletProvider: 'MetaMask',
    networkName: 'Polygon Amoy',
    chainId: '0x13882',
    contractAddress: '0x0000000000000000000000000000000000000000',
    ipfsGateway: 'https://ipfs.io/ipfs/'
};

export const SESSION_STORAGE_KEYS = {
    issueResult: 'blockcertIssueResult',
    issueRecords: 'blockcertIssuedRecords',
    studentRollNumber: 'studentRollNumber'
};

export const SIMULATED_WALLET_ADDRESS = '0xAbC123dEf9876543210';
