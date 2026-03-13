export async function uploadCertificatePdf(file, metadata = {}) {
    // BACKEND_INTEGRATION_POINT
    // Purpose: pin the certificate PDF to IPFS before issuing the certificate on-chain.
    // Expected technology: Pinata
    // Data required: certificate PDF file, pin metadata, signed upload credentials
    // Output expected: IPFS CID, gateway URL, pin response metadata
    throw new Error(`uploadCertificatePdf is not implemented yet for ${file?.name || 'unknown file'}.`);
}

export async function uploadStudentPhoto(file, metadata = {}) {
    // BACKEND_INTEGRATION_POINT
    // Purpose: pin the student photo to IPFS for later retrieval on the dashboard and verification flows.
    // Expected technology: Pinata
    // Data required: student photo file, pin metadata, signed upload credentials
    // Output expected: IPFS CID, gateway URL, pin response metadata
    throw new Error(`uploadStudentPhoto is not implemented yet for ${file?.name || 'unknown file'}.`);
}

export async function unpinAsset(cid) {
    // BACKEND_INTEGRATION_POINT
    // Purpose: remove or replace an IPFS asset when a certificate is revoked or reissued.
    // Expected technology: Pinata
    // Data required: IPFS CID, authorization credentials
    // Output expected: unpin confirmation status
    throw new Error(`unpinAsset is not implemented yet for ${cid || 'unknown cid'}.`);
}
