export const encodeBase64 = (input) => {
    try {
        return btoa(unescape(encodeURIComponent(input)));
    } catch {
        return '';
    }
};

export const decodeBase64 = (input) => {
    try {
        return decodeURIComponent(escape(atob(input)));
    } catch {
        return '';
    }
};
