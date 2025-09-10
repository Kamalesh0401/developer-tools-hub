// src/utils/base64Utils.js

/**
 * Encodes a string to Base64
 * @param {string} input - String to encode
 * @returns {string} - Base64 encoded string
 */
export const encodeBase64 = (input) => {
    try {
        return btoa(unescape(encodeURIComponent(input)));
    } catch (error) {
        throw new Error('Failed to encode to Base64');
    }
};

/**
 * Decodes a Base64 string
 * @param {string} input - Base64 string to decode
 * @returns {string} - Decoded string
 */
export const decodeBase64 = (input) => {
    try {
        return decodeURIComponent(escape(atob(input)));
    } catch (error) {
        throw new Error('Invalid Base64 string');
    }
};

/**
 * Validates if a string is valid Base64
 * @param {string} input - String to validate
 * @returns {boolean} - True if valid Base64
 */
export const isValidBase64 = (input) => {
    try {
        // Base64 regex pattern
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;

        if (!base64Regex.test(input)) {
            return false;
        }

        // Try to decode and re-encode
        const decoded = atob(input);
        const reencoded = btoa(decoded);

        return reencoded === input;
    } catch (error) {
        return false;
    }
};

/**
 * Detects the type of input data
 * @param {string} input - Input string
 * @returns {string} - Data type ('base64', 'text', 'url', 'json', 'xml')
 */
export const detectDataType = (input) => {
    if (!input || typeof input !== 'string') {
        return 'text';
    }

    // Check if it's valid Base64
    if (isValidBase64(input) && input.length > 10) {
        return 'base64';
    }

    // Check if it's a URL
    try {
        new URL(input);
        return 'url';
    } catch (e) {
        // Not a URL, continue checking
    }

    // Check if it's JSON
    try {
        JSON.parse(input);
        return 'json';
    } catch (e) {
        // Not JSON, continue checking
    }

    // Check if it's XML
    if (input.trim().startsWith('<') && input.trim().endsWith('>')) {
        return 'xml';
    }

    // Check if it looks like a data URL
    if (input.startsWith('data:')) {
        return 'dataurl';
    }

    return 'text';
};

/**
 * Calculates the size difference between original and encoded data
 * @param {string} original - Original string
 * @param {string} encoded - Encoded string
 * @returns {object} - Size information
 */
export const getSizeInfo = (original, encoded) => {
    const originalSize = new Blob([original]).size;
    const encodedSize = new Blob([encoded]).size;
    const difference = encodedSize - originalSize;
    const percentage = ((difference / originalSize) * 100).toFixed(1);

    return {
        originalSize,
        encodedSize,
        difference,
        percentage: parseFloat(percentage)
    };
};

/**
 * Encodes a file to Base64
 * @param {File} file - File object to encode
 * @returns {Promise<string>} - Base64 encoded file
 */
export const encodeFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result;
            // Remove data URL prefix if present
            const base64 = result.split(',')[1] || result;
            resolve(base64);
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
    });
};

/**
 * Decodes Base64 to a downloadable blob
 * @param {string} base64String - Base64 string
 * @param {string} mimeType - MIME type for the blob
 * @returns {Blob} - Decoded blob
 */
export const decodeBase64ToBlob = (base64String, mimeType = 'application/octet-stream') => {
    try {
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    } catch (error) {
        throw new Error('Failed to decode Base64 to blob');
    }
};

/**
 * Formats Base64 string with line breaks for readability
 * @param {string} base64String - Base64 string
 * @param {number} lineLength - Characters per line (default: 76)
 * @returns {string} - Formatted Base64 string
 */
export const formatBase64 = (base64String, lineLength = 76) => {
    const regex = new RegExp(`.{1,${lineLength}}`, 'g');
    return base64String.match(regex)?.join('\n') || base64String;
};

/**
 * Removes formatting from Base64 string
 * @param {string} formattedBase64 - Formatted Base64 string
 * @returns {string} - Clean Base64 string
 */
export const cleanBase64 = (formattedBase64) => {
    return formattedBase64.replace(/\s+/g, '');
};

/**
 * Gets information about Base64 encoded data
 * @param {string} base64String - Base64 string
 * @returns {object} - Information about the data
 */
export const getBase64Info = (base64String) => {
    const cleanBase64 = cleanBase64(base64String);
    const padding = (cleanBase64.match(/=/g) || []).length;
    const dataLength = (cleanBase64.length * 3) / 4 - padding;

    return {
        length: cleanBase64.length,
        padding,
        dataLength,
        isValid: isValidBase64(cleanBase64),
        efficiency: ((dataLength / cleanBase64.length) * 100).toFixed(1)
    };
};