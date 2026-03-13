// js/modules/: Certificate storage, QR handling, and record lifecycle helpers.

import { SESSION_STORAGE_KEYS } from '../../config/blockchainConfig.js';
import { buildIssueRecordId, formatIssueTimestamp, registerCertificateOnChain } from './contract.js';
import { downloadDataUrl, openImageDataUrl, openPdfDataUrl } from './ipfs.js';

function escapeSvgContent(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function normalizeLookupValue(value) {
    return String(value || '').trim().toLowerCase();
}

export function stripIssueRecordDownload(record) {
    if (!record?.certificatePdfDataUrl) {
        return record;
    }

    return {
        ...record,
        certificatePdfDataUrl: '',
        downloadUnavailable: true
    };
}

export function stripIssueRecordMedia(record) {
    const sanitizedRecord = stripIssueRecordDownload(record);

    if (!sanitizedRecord?.studentPhotoDataUrl) {
        return sanitizedRecord;
    }

    return {
        ...sanitizedRecord,
        studentPhotoDataUrl: '',
        photoUnavailable: true
    };
}

export function saveIssueResult(result) {
    try {
        sessionStorage.setItem(SESSION_STORAGE_KEYS.issueResult, JSON.stringify(result));
        return true;
    } catch (error) {
        if (result?.certificatePdfDataUrl || result?.studentPhotoDataUrl) {
            try {
                sessionStorage.setItem(
                    SESSION_STORAGE_KEYS.issueResult,
                    JSON.stringify(stripIssueRecordDownload(result))
                );
                return true;
            } catch (fallbackError) {
                if (result?.studentPhotoDataUrl) {
                    try {
                        sessionStorage.setItem(
                            SESSION_STORAGE_KEYS.issueResult,
                            JSON.stringify(stripIssueRecordMedia(result))
                        );
                        return true;
                    } catch (mediaFallbackError) {
                        console.error('Unable to save media fallback issue result:', mediaFallbackError);
                    }
                }

                console.error('Unable to save fallback issue result:', fallbackError);
            }
        }

        console.error('Unable to save issue result:', error);
        return false;
    }
}

export function getSavedIssueResult() {
    try {
        const raw = sessionStorage.getItem(SESSION_STORAGE_KEYS.issueResult);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        console.error('Unable to read issue result:', error);
        return null;
    }
}

export function getIssueRecords() {
    // BACKEND_INTEGRATION_POINT
    // Purpose: load issued certificate history for admin dashboards, student dashboards, and verification flows.
    // Expected technology: certificate issuance API or transaction history API
    // Data required: current institution context, optional student roll number, pagination/filter parameters
    // Output expected: list of issued certificate records with student metadata, hashes, QR references, and status
    try {
        const raw = sessionStorage.getItem(SESSION_STORAGE_KEYS.issueRecords);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Unable to read issue records:', error);
        return [];
    }
}

function persistIssueRecords(records) {
    try {
        sessionStorage.setItem(SESSION_STORAGE_KEYS.issueRecords, JSON.stringify(records));
        return true;
    } catch (error) {
        console.error('Unable to persist issue records:', error);
        return false;
    }
}

export function appendIssueRecord(record) {
    const currentRecords = getIssueRecords();
    const nextRecords = [record, ...currentRecords];

    if (persistIssueRecords(nextRecords)) {
        return true;
    }

    const fallbackRecords = nextRecords.map((item, index) => (
        index === 0 ? item : stripIssueRecordDownload(item)
    ));
    if (persistIssueRecords(fallbackRecords)) {
        return true;
    }

    const mediaFallbackRecords = nextRecords.map((item, index) => (
        index === 0 ? stripIssueRecordDownload(item) : stripIssueRecordMedia(item)
    ));
    if (persistIssueRecords(mediaFallbackRecords)) {
        return true;
    }

    return persistIssueRecords(nextRecords.map(stripIssueRecordMedia));
}

export function buildQrPayload({ certificateHash = '', transactionHash = '', rollNumber = '' } = {}) {
    return JSON.stringify({
        type: 'blockcert-certificate',
        certificateHash,
        transactionHash,
        rollNumber
    });
}

export function parseQrPayload(payload) {
    const rawPayload = String(payload || '').trim();

    if (!rawPayload) {
        return null;
    }

    try {
        const parsed = JSON.parse(rawPayload);
        if (parsed && typeof parsed === 'object') {
            return {
                certificateHash: String(parsed.certificateHash || '').trim(),
                transactionHash: String(parsed.transactionHash || '').trim(),
                rollNumber: String(parsed.rollNumber || '').trim()
            };
        }
    } catch (error) {
        // Fall back to the legacy pipe-delimited payload format.
    }

    const [certificateHash = '', transactionHash = '', rollNumber = ''] = rawPayload.split('|');

    if (!certificateHash.trim()) {
        return null;
    }

    return {
        certificateHash: certificateHash.trim(),
        transactionHash: transactionHash.trim(),
        rollNumber: rollNumber.trim()
    };
}

export function findIssueRecordByCertificateHash(certificateHash, issueRecords = getIssueRecords()) {
    // BACKEND_INTEGRATION_POINT
    // Purpose: verify a certificate hash against trusted backend or on-chain records instead of only local session data.
    // Expected technology: certificate verification API or smart contract read call
    // Data required: certificate hash, optional institution scope, optional chain/network identifier
    // Output expected: matched certificate record, verification status, verification proof/source
    const normalizedHash = normalizeLookupValue(certificateHash);

    if (!normalizedHash) {
        return null;
    }

    return issueRecords.find((record) => normalizeLookupValue(record.certificateHash) === normalizedHash) || null;
}

export function findIssueRecordByQrPayload(payload, issueRecords = getIssueRecords()) {
    const parsedPayload = parseQrPayload(payload);

    if (!parsedPayload) {
        return null;
    }

    const normalizedCertificateHash = normalizeLookupValue(parsedPayload.certificateHash);
    const normalizedTransactionHash = normalizeLookupValue(parsedPayload.transactionHash);
    const normalizedRollNumber = normalizeLookupValue(parsedPayload.rollNumber);

    return issueRecords.find((record) => {
        const recordCertificateHash = normalizeLookupValue(record.certificateHash);
        const recordTransactionHash = normalizeLookupValue(record.transactionHash);
        const recordRollNumber = normalizeLookupValue(record.rollNumber);

        if (normalizedCertificateHash && recordCertificateHash === normalizedCertificateHash) {
            return true;
        }

        if (normalizedTransactionHash && recordTransactionHash === normalizedTransactionHash) {
            return !normalizedRollNumber || recordRollNumber === normalizedRollNumber;
        }

        return false;
    }) || null;
}

function decodeSvgDataUrl(dataUrl) {
    if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/svg+xml')) {
        return '';
    }

    const separatorIndex = dataUrl.indexOf(',');
    if (separatorIndex === -1) {
        return '';
    }

    try {
        return decodeURIComponent(dataUrl.slice(separatorIndex + 1));
    } catch (error) {
        return dataUrl.slice(separatorIndex + 1);
    }
}

function normalizeSvgMarkup(svgMarkup) {
    return String(svgMarkup || '')
        .replace(/\s+/g, ' ')
        .trim();
}

function extractQrPayloadFromSvgMarkup(svgMarkup) {
    if (!svgMarkup) {
        return '';
    }

    try {
        const parsedSvg = new DOMParser().parseFromString(svgMarkup, 'image/svg+xml');
        const svgRoot = parsedSvg.documentElement;

        if (!svgRoot || svgRoot.nodeName.toLowerCase() === 'parsererror') {
            return '';
        }

        const attributePayload = svgRoot.getAttribute('data-blockcert-payload') || '';
        const descPayload = svgRoot.querySelector('desc')?.textContent || '';
        return attributePayload.trim() || descPayload.trim();
    } catch (error) {
        console.error('Unable to parse SVG QR markup:', error);
        return '';
    }
}

function findIssueRecordByQrSvgMarkup(svgMarkup, issueRecords = getIssueRecords()) {
    const payloadMatch = findIssueRecordByQrPayload(extractQrPayloadFromSvgMarkup(svgMarkup), issueRecords);

    if (payloadMatch) {
        return payloadMatch;
    }

    const normalizedMarkup = normalizeSvgMarkup(svgMarkup);

    if (!normalizedMarkup) {
        return null;
    }

    return issueRecords.find((record) => normalizeSvgMarkup(decodeSvgDataUrl(record.qrCodeDataUrl)) === normalizedMarkup) || null;
}

export async function findIssueRecordByQrFile(file, issueRecords = getIssueRecords()) {
    // BACKEND_INTEGRATION_POINT
    // Purpose: send scanned/uploaded QR data through the backend verification pipeline after QR decoding.
    // Expected technology: certificate verification API
    // Data required: uploaded QR image file or decoded QR payload, optional institution scope
    // Output expected: matched certificate record, verification status, backend validation message
    if (!file) {
        return null;
    }

    const lowerFileName = String(file.name || '').toLowerCase();
    const isSvgFile = file.type === 'image/svg+xml' || lowerFileName.endsWith('.svg');

    if (isSvgFile) {
        try {
            const svgMarkup = await file.text();
            const svgMatch = findIssueRecordByQrSvgMarkup(svgMarkup, issueRecords);

            if (svgMatch) {
                return svgMatch;
            }
        } catch (error) {
            console.error('Unable to read SVG QR image:', error);
        }
    }

    if ('BarcodeDetector' in window) {
        try {
            const detector = new BarcodeDetector({ formats: ['qr_code'] });
            const bitmap = await createImageBitmap(file);
            const detections = await detector.detect(bitmap);

            if (typeof bitmap.close === 'function') {
                bitmap.close();
            }

            const detectedPayload = detections[0]?.rawValue || '';
            const qrMatch = findIssueRecordByQrPayload(detectedPayload, issueRecords);

            if (qrMatch) {
                return qrMatch;
            }
        } catch (error) {
            console.error('Unable to decode QR image with BarcodeDetector:', error);
        }
    }

    return null;
}

export function buildPseudoQrCodeDataUrl(content) {
    const qrSize = 29;
    const cellSize = 8;
    const quietZone = 4;
    const totalSize = (qrSize + quietZone * 2) * cellSize;
    const modules = Array.from({ length: qrSize }, () => Array(qrSize).fill(false));
    const reserved = Array.from({ length: qrSize }, () => Array(qrSize).fill(false));

    const markModule = (x, y, value, isReserved = true) => {
        if (x < 0 || x >= qrSize || y < 0 || y >= qrSize) return;
        modules[y][x] = value;
        if (isReserved) {
            reserved[y][x] = true;
        }
    };

    const drawFinder = (startX, startY) => {
        for (let y = -1; y <= 7; y += 1) {
            for (let x = -1; x <= 7; x += 1) {
                const globalX = startX + x;
                const globalY = startY + y;
                const isInside = x >= 0 && x <= 6 && y >= 0 && y <= 6;
                const isBorder = x === 0 || x === 6 || y === 0 || y === 6;
                const isCenter = x >= 2 && x <= 4 && y >= 2 && y <= 4;
                markModule(globalX, globalY, isInside && (isBorder || isCenter));
            }
        }
    };

    drawFinder(0, 0);
    drawFinder(qrSize - 7, 0);
    drawFinder(0, qrSize - 7);

    for (let index = 8; index < qrSize - 8; index += 1) {
        markModule(6, index, index % 2 === 0);
        markModule(index, 6, index % 2 === 0);
    }

    let seed = 0;
    const normalizedContent = String(content || '');

    for (let index = 0; index < normalizedContent.length; index += 1) {
        seed = (seed * 31 + normalizedContent.charCodeAt(index)) % 2147483647;
    }

    if (!seed) {
        seed = 1357911;
    }

    const nextRandom = () => {
        seed = (seed * 48271) % 2147483647;
        return seed / 2147483647;
    };

    for (let y = 0; y < qrSize; y += 1) {
        for (let x = 0; x < qrSize; x += 1) {
            if (reserved[y][x]) continue;
            modules[y][x] = nextRandom() > 0.5;
        }
    }

    const rects = [];

    for (let y = 0; y < qrSize; y += 1) {
        for (let x = 0; x < qrSize; x += 1) {
            if (!modules[y][x]) continue;
            const px = (x + quietZone) * cellSize;
            const py = (y + quietZone) * cellSize;
            rects.push(`<rect x="${px}" y="${py}" width="${cellSize}" height="${cellSize}" rx="1" ry="1" />`);
        }
    }

    const svgPayload = escapeSvgContent(normalizedContent);
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" role="img" aria-label="Generated QR Code" data-blockcert-payload="${svgPayload}">
            <desc>${svgPayload}</desc>
            <rect width="${totalSize}" height="${totalSize}" fill="#ffffff" rx="18" ry="18" />
            <g fill="#0d1838">
                ${rects.join('')}
            </g>
        </svg>
    `.trim();

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

// BACKEND_INTEGRATION_POINT
// Purpose: orchestrate certificate issuance by uploading files, issuing on-chain, and persisting the final certificate record.
// Expected technology: Pinata IPFS API + Solidity smart contract + certificate issuance API
// Data required: student form fields, uploaded certificate PDF, uploaded student photo, issuer identity/wallet context
// Output expected: saved certificate record containing IPFS references, certificate hash, transaction hash, QR payload, persisted record ID
export async function createIssuedCertificateRecord({ formState, files, certificatePdfDataUrl, studentPhotoDataUrl }) {
    const issuedDate = new Date();
    const payload = [
        formState.studentName,
        formState.rollNumber,
        formState.department,
        formState.yearOfPassing,
        formState.classDivision,
        formState.scoreValue,
        files.certificatePdf?.name || '',
        files.studentPhoto?.name || ''
    ].join('|');

    const { certificateHash, transactionHash } = await registerCertificateOnChain(payload, certificatePdfDataUrl.length);
    const qrPayload = buildQrPayload({
        certificateHash,
        transactionHash,
        rollNumber: formState.rollNumber
    });

    return {
        recordId: buildIssueRecordId(issuedDate),
        studentName: formState.studentName,
        rollNumber: formState.rollNumber,
        department: formState.department,
        yearOfPassing: formState.yearOfPassing,
        classDivision: formState.classDivision,
        scoreValue: formState.scoreValue,
        certificateHash,
        transactionHash,
        qrPayload,
        qrCodeDataUrl: buildPseudoQrCodeDataUrl(qrPayload),
        certificatePdfDataUrl,
        certificatePdfName: files.certificatePdf?.name || 'certificate.pdf',
        studentPhotoDataUrl,
        studentPhotoName: files.studentPhoto?.name || '',
        issuedAt: formatIssueTimestamp(issuedDate),
        issuedTimestamp: issuedDate.getTime()
    };
}

export function downloadIssueCertificate(record) {
    if (!record?.certificatePdfDataUrl) return;
    downloadDataUrl(record.certificatePdfDataUrl, record.certificatePdfName || 'certificate.pdf');
}

export function openIssuePdf(record) {
    if (!record?.certificatePdfDataUrl) return;
    openPdfDataUrl(record.certificatePdfDataUrl, record.certificatePdfName || 'Certificate PDF');
}

export function openIssuePhoto(record) {
    if (!record?.studentPhotoDataUrl) return;
    openImageDataUrl(record.studentPhotoDataUrl, record.studentPhotoName || 'Student Photo');
}

export function openIssueQrCode(record) {
    if (!record?.qrCodeDataUrl) return;
    openImageDataUrl(record.qrCodeDataUrl, 'Generated QR Code', {
        background: '#0d1838',
        imgStyle: 'width:min(88vw,420px);height:auto;background:#fff;padding:18px;border-radius:20px;'
    });
}
