// Decode JWT token and check if expired
export const isTokenExpired = (token) => {
    if (!token)
        return true;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        const decoded = JSON.parse(jsonPayload);
        const expirationTime = decoded.exp * 1000; // exp is in seconds
        const currentTime = Date.now();

        return currentTime >= expirationTime;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return true;
    }
};

// Clear auth data from localStorage
export const clearAuthData = () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('role');
    window.localStorage.removeItem('user');
};
