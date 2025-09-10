export const validateJSON = (jsonString) => {
    try {
        JSON.parse(jsonString);
        return { isValid: true, error: null };
    } catch (error) {
        return { isValid: false, error: error.message };
    }
};

export const formatJSON = (jsonString) => {
    try {
        const parsed = JSON.parse(jsonString);
        return JSON.stringify(parsed, null, 2);
    } catch {
        return '';
    }
};

export const minifyJSON = (jsonString) => {
    try {
        const parsed = JSON.parse(jsonString);
        return JSON.stringify(parsed);
    } catch {
        return '';
    }
};
