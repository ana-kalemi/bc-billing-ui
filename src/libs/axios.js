const baseURL = process.env.NODE_ENV === 'production' ? window.location.href : process.env.VUE_APP_BASE_URL;

export default baseURL
