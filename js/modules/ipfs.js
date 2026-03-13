// js/modules/: File handling and IPFS-ready abstractions for browser-only pages.

// BACKEND_INTEGRATION_POINT
// Purpose: upload certificate PDFs and student photos to IPFS before blockchain issuance is finalized.
// Expected technology: Pinata IPFS API
// Data required: browser `File` object, Pinata API credentials or signed upload token, optional metadata/tags
// Output expected: IPFS CID, gateway URL, pin metadata response
export async function uploadFileToIpfs(file) {
    if (!file) {
        return '';
    }

    return readFileAsDataUrl(file);
}

export function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve('');
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            resolve(typeof reader.result === 'string' ? reader.result : '');
        };

        reader.onerror = () => {
            reject(new Error(`Unable to read file: ${file.name || 'unknown file'}`));
        };

        reader.readAsDataURL(file);
    });
}

export function downloadDataUrl(dataUrl, filename) {
    if (!dataUrl) return;

    const anchor = document.createElement('a');
    anchor.href = dataUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
}

function openDataUrlInWindow(dataUrl, buildMarkup, fallbackTitle) {
    if (!dataUrl) return;

    const newWindow = window.open('', '_blank', 'noopener');

    if (!newWindow) {
        window.location.href = dataUrl;
        return;
    }

    newWindow.document.title = fallbackTitle;
    newWindow.document.body.style.margin = '0';
    newWindow.document.body.innerHTML = buildMarkup(dataUrl);
}

export function openPdfDataUrl(dataUrl, filename = 'Certificate PDF') {
    openDataUrlInWindow(
        dataUrl,
        (safeUrl) => {
            const bodyStyle = 'margin:0;background:#081633;';
            const markup = `<iframe src="${safeUrl}" title="${filename}" style="width:100vw;height:100vh;border:0;"></iframe>`;
            return `<div style="${bodyStyle}">${markup}</div>`;
        },
        filename
    );
}

export function openImageDataUrl(dataUrl, title = 'Image', options = {}) {
    const background = options.background || '#081633';
    const imgStyle = options.imgStyle || 'width:min(88vw,420px);height:auto;border-radius:20px;box-shadow:0 22px 48px rgba(0, 0, 0, 0.35);';

    openDataUrlInWindow(
        dataUrl,
        (safeUrl) => `
            <div style="margin:0;display:grid;place-items:center;min-height:100vh;background:${background};">
                <img src="${safeUrl}" alt="${title}" style="${imgStyle}">
            </div>
        `,
        title
    );
}
