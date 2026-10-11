/**
 * Netlify Function: upload-proof
 * Securely receives and validates payment screenshots.
 * Restricts file types to JPG, PNG, WebP, PDF and size to <= 5MB.
 */

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const { orderNumber, fileName, fileData, mimeType } = payload;

    if (!orderNumber || !fileData) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing order reference or file data' }),
      };
    }

    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (mimeType && !allowedMime.includes(mimeType)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid file format. Allowed: JPG, PNG, WebP, PDF' }),
      };
    }

    // Check size limit: base64 overhead ~ 1.33, so 5MB is ~6.8MB characters
    if (fileData.length > 7 * 1024 * 1024) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'File size exceeds maximum limit of 5 MB' }),
      };
    }

    const sanitizedFileName = (fileName || 'proof.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
    const secureStoragePath = `payment-proofs/${orderNumber}/${sanitizedFileName}`;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        storagePath: secureStoragePath,
        message: 'Payment proof received and validated.',
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message || 'File upload validation error' }),
    };
  }
};
