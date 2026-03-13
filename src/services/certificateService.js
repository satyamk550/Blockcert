export async function registerStudent(studentData) {
    // BACKEND_INTEGRATION_POINT
    // Purpose: create a student record before certificate issuance begins.
    // Expected technology: API
    // Data required: roll number, email, temporary password, full name, department, graduation year, final grade, CGPA/percentage
    // Output expected: created student record ID, registration status, normalized student profile
    throw new Error(`registerStudent is not implemented yet for ${studentData?.rollNumber || 'unknown student'}.`);
}

export async function issueCertificate(issuePayload) {
    // BACKEND_INTEGRATION_POINT
    // Purpose: orchestrate certificate issuance, persistence, and response normalization.
    // Expected technology: API
    // Data required: student metadata, IPFS asset references, connected issuer wallet, contract transaction metadata
    // Output expected: issued certificate record, certificate hash, transaction hash, issuance status
    throw new Error(`issueCertificate is not implemented yet for ${issuePayload?.rollNumber || 'unknown student'}.`);
}

export async function verifyCertificate(verificationPayload) {
    // BACKEND_INTEGRATION_POINT
    // Purpose: verify a certificate using a manual hash or QR-derived payload.
    // Expected technology: API
    // Data required: certificate hash or QR payload, optional institution scope, optional chain/network metadata
    // Output expected: verification status, matched certificate record, backend validation message
    throw new Error('verifyCertificate is not implemented yet.');
}

export async function getCertificateHistory(filters = {}) {
    // BACKEND_INTEGRATION_POINT
    // Purpose: retrieve certificate issuance history for admin dashboards and student dashboards.
    // Expected technology: API
    // Data required: institution ID, student roll number, pagination cursor, search filters
    // Output expected: paginated certificate records, totals, status metadata
    throw new Error(`getCertificateHistory is not implemented yet for ${JSON.stringify(filters)}.`);
}
