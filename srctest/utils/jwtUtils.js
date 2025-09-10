export const decodeBase64 = (str) => {
    try {
        return decodeURIComponent(atob(str).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    } catch {
        return null;
    }
};

// Split and decode JWT
export const decodeJWT = (token) => {
    try {
        const [header, payload, signature] = token.split('.');
        if (!header || !payload) return { decoded: null, error: "Invalid JWT format" };
        const decodedHeader = JSON.parse(decodeBase64(header));
        const decodedPayload = JSON.parse(decodeBase64(payload));
        return { decoded: { header: decodedHeader, payload: decodedPayload, signature: signature || '' }, error: null };
    } catch (error) {
        return { decoded: null, error: error.message };
    }
};
