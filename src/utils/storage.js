export function getSafeItem(key, defaultValue = []) {
    try {
        const val = localStorage.getItem(key);
        if (!val || val === 'undefined') return defaultValue;
        return JSON.parse(val);
    } catch {
        return defaultValue;
    }
}

export function setSafeItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}