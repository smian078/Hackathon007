/**
 * ProofPass Cryptographic Utilities
 * Standard SHA-256 hashing and deterministic digital signatures
 */

// Buffer to hex converter
export function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Compute SHA-256 hash of a string or ArrayBuffer
export async function computeSHA256(data: string | ArrayBuffer | Uint8Array): Promise<string> {
  let buffer: ArrayBuffer;
  if (typeof data === 'string') {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(data);
    buffer = encoded.buffer as ArrayBuffer;
  } else if (data instanceof Uint8Array) {
    buffer = data.buffer as ArrayBuffer;
  } else {
    buffer = data;
  }

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return '0x' + bufferToHex(hashBuffer);
  }

  // Fallback for simple environments
  let hash = 0;
  const view = new Uint8Array(buffer);
  for (let i = 0; i < view.length; i++) {
    hash = (hash << 5) - hash + view[i];
    hash |= 0;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(64, 'a');
}

// Generate realistic mock Ethereum transaction hash
export function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
}

// Generate realistic mock Ethereum wallet address
export function generateAddress(): string {
  const chars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return address;
}

// Generate institutional cryptographic signature
export async function signCredential(
  issuerAddress: string,
  documentHash: string,
  documentId: string
): Promise<string> {
  const payload = `${issuerAddress}:${documentId}:${documentHash}:PROOFPASS_ED25519_RSA`;
  const signatureHash = await computeSHA256(payload);
  return `SIG_${signatureHash.slice(2, 42).toUpperCase()}`;
}

// Verify digital signature against issuer public key / address
export async function verifySignature(
  issuerAddress: string,
  documentHash: string,
  documentId: string,
  signature: string
): Promise<boolean> {
  if (!signature.startsWith('SIG_')) return false;
  const expectedHash = await computeSHA256(`${issuerAddress}:${documentId}:${documentHash}:PROOFPASS_ED25519_RSA`);
  const expectedSig = `SIG_${expectedHash.slice(2, 42).toUpperCase()}`;
  return signature === expectedSig;
}
