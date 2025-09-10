// src/utils/jsonUtils.js

/**
 * Validates if a string is valid JSON
 * @param {string} jsonString - The JSON string to validate
 * @throws {Error} - Throws error if JSON is invalid
 * @returns {object} - Parsed JSON object
 */
export const validateJSON = (jsonString) => {
    try {
        const parsed = JSON.parse(jsonString);
        return parsed;
    } catch (error) {
        throw new Error(`Invalid JSON: ${error.message}`);
    }
};

/**
 * Formats JSON string with proper indentation
 * @param {string} jsonString - The JSON string to format
 * @param {number} spaces - Number of spaces for indentation (default: 2)
 * @returns {string} - Formatted JSON string
 */
export const formatJSON = (jsonString, spaces = 2) => {
    try {
        const parsed = validateJSON(jsonString);
        return JSON.stringify(parsed, null, spaces);
    } catch (error) {
        throw error;
    }
};

/**
 * Minifies JSON string by removing whitespace
 * @param {string} jsonString - The JSON string to minify
 * @returns {string} - Minified JSON string
 */
export const minifyJSON = (jsonString) => {
    try {
        const parsed = validateJSON(jsonString);
        return JSON.stringify(parsed);
    } catch (error) {
        throw error;
    }
};

/**
 * Gets the size of JSON data in bytes
 * @param {string} jsonString - The JSON string
 * @returns {number} - Size in bytes
 */
export const getJSONSize = (jsonString) => {
    return new Blob([jsonString]).size;
};

/**
 * Counts the number of keys in a JSON object
 * @param {string} jsonString - The JSON string
 * @returns {number} - Number of keys
 */
export const countJSONKeys = (jsonString) => {
    try {
        const parsed = validateJSON(jsonString);
        const countKeys = (obj) => {
            let count = 0;
            for (const key in obj) {
                count++;
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    count += countKeys(obj[key]);
                }
            }
            return count;
        };
        return countKeys(parsed);
    } catch (error) {
        return 0;
    }
};

/**
 * Flattens nested JSON object
 * @param {object} obj - Object to flatten
 * @param {string} prefix - Prefix for keys
 * @returns {object} - Flattened object
 */
export const flattenJSON = (obj, prefix = '') => {
    const flattened = {};

    for (const key in obj) {
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(flattened, flattenJSON(obj[key], newKey));
        } else {
            flattened[newKey] = obj[key];
        }
    }

    return flattened;
};

/**
 * Sorts JSON object keys alphabetically
 * @param {string} jsonString - The JSON string
 * @returns {string} - JSON with sorted keys
 */
export const sortJSONKeys = (jsonString) => {
    try {
        const parsed = validateJSON(jsonString);

        const sortKeys = (obj) => {
            if (typeof obj !== 'object' || obj === null) {
                return obj;
            }

            if (Array.isArray(obj)) {
                return obj.map(sortKeys);
            }

            const sorted = {};
            Object.keys(obj).sort().forEach(key => {
                sorted[key] = sortKeys(obj[key]);
            });

            return sorted;
        };

        return JSON.stringify(sortKeys(parsed), null, 2);
    } catch (error) {
        throw error;
    }
};