// js/modules/: Contract-facing helpers and blockchain registration placeholders.

export function pseudoBlockchainHash(input) {
    const normalized = String(input || '');
    let hash = 0;

    for (let index = 0; index < normalized.length; index += 1) {
        hash = (hash << 5) - hash + normalized.charCodeAt(index);
        hash |= 0;
    }

    const hexChunk = Math.abs(hash).toString(16).padStart(8, '0');
    return `0x${(hexChunk + hexChunk + hexChunk).slice(0, 24)}`;
}

export function buildIssueRecordId(dateValue = new Date()) {
    const year = dateValue.getFullYear();
    const serial = String(dateValue.getTime()).slice(-6);
    return `BC-${year}-${serial}`;
}

export function formatIssueTimestamp(dateValue = new Date()) {
    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(dateValue);
}

// BACKEND_INTEGRATION_POINT
// Purpose: submit certificate metadata to the deployed smart contract and wait for the transaction receipt.
// Expected technology: ethers.js + Solidity smart contract
// Data required: certificate payload/hash seed, certificate asset reference, issuer wallet/signer, optional gas/network settings
// Output expected: on-chain certificate hash, transaction hash, mined transaction receipt/status
export async function registerCertificateOnChain(payload, certificateSize = 0) {
    return {
        certificateHash: pseudoBlockchainHash(`CERT|${payload}|${certificateSize}`),
        transactionHash: pseudoBlockchainHash(`TX|${payload}|${Date.now()}`)
    };
}
