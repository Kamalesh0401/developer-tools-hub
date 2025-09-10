// src/utils/jwtUtils.js

/**
 * Validates JWT token format
 * @param {string} token - JWT token to validate
 * @throws {Error} - Throws error if token is invalid
 */
export const validateJWT = (token) => {
    if (!token) {
        throw new Error('Token is required');
    }

    if (typeof token !== 'string') {
        throw new Error('Token must be a string');
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('JWT must contain exactly 3 parts separated by dots');
    }

    const [header, payload, signature] = parts;

    if (!header || !payload || !signature) {
        throw new Error('JWT parts cannot be empty');
    }
};

/**
 * Base64 URL decode function
 * @param {string} str - Base64 URL encoded string
 * @returns {string} - Decoded string
 */
const base64UrlDecode = (str) => {
    // Add padding if needed
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
        base64 += '=';
    }

    try {
        return atob(base64);
    } catch (error) {
        throw new Error('Invalid base64url encoding');
    }
};

/**
 * Decodes JWT token
 * @param {string} token - JWT token to decode
 * @returns {object} - Decoded JWT components
 */
export const decodeJWT = (token) => {
    validateJWT(token);

    const parts = token.split('.');
    const [headerB64, payloadB64, signatureB64] = parts;

    let header, payload;

    try {
        header = JSON.parse(base64UrlDecode(headerB64));
    } catch (error) {
        throw new Error('Invalid JWT header encoding');
    }

    try {
        payload = JSON.parse(base64UrlDecode(payloadB64));
    } catch (error) {
        throw new Error('Invalid JWT payload encoding');
    }

    // Extract token information
    const info = {
        algorithm: header.alg || 'Unknown',
        type: header.typ || 'Unknown',
        iat: payload.iat, // Issued at
        exp: payload.exp, // Expires at
        nbf: payload.nbf, // Not before
        sub: payload.sub, // Subject
        aud: payload.aud, // Audience
        iss: payload.iss  // Issuer
    };

    return {
        header,
        payload,
        signature: signatureB64,
        info,
        raw: {
            header: headerB64,
            payload: payloadB64,
            signature: signatureB64
        }
    };
};

/**
 * Checks if JWT token is expired
 * @param {object} payload - JWT payload
 * @returns {boolean} - True if token is expired
 */
export const isTokenExpired = (payload) => {
    if (!payload.exp) {
        return false; // No expiration claim
    }

    const now = Math.floor(Date.now() / 1000);
    return now >= payload.exp;
};

/**
 * Checks if JWT token is valid (not before time)
 * @param {object} payload - JWT payload
 * @returns {boolean} - True if token is valid now
 */
export const isTokenValidNow = (payload) => {
    if (!payload.nbf) {
        return true; // No "not before" claim
    }

    const now = Math.floor(Date.now() / 1000);
    return now >= payload.nbf;
};

/**
 * Gets token validity status
 * @param {object} payload - JWT payload
 * @returns {object} - Validity status
 */
export const getTokenStatus = (payload) => {
    const now = Math.floor(Date.now() / 1000);

    return {
        isExpired: isTokenExpired(payload),
        isValidNow: isTokenValidNow(payload),
        timeToExpiry: payload.exp ? payload.exp - now : null,
        age: payload.iat ? now - payload.iat : null
    };
};

/**
 * Formats timestamp to readable date
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - Formatted date string
 */
export const formatTimestamp = (timestamp) => {
    if (!timestamp) {
        return 'Not provided';
    }

    try {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
    } catch (error) {
        return 'Invalid timestamp';
    }
};

/**
 * Gets human readable time difference
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - Human readable time difference
 */
export const getTimeAgo = (timestamp) => {
    if (!timestamp) {
        return 'Unknown';
    }

    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;

    if (diff < 60) {
        return `${diff} seconds ago`;
    } else if (diff < 3600) {
        return `${Math.floor(diff / 60)} minutes ago`;
    } else if (diff < 86400) {
        return `${Math.floor(diff / 3600)} hours ago`;
    } else {
        return `${Math.floor(diff / 86400)} days ago`;
    }
};