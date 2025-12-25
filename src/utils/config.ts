export const getApiBaseUrl = (): string => {
  if (import.meta.env.DEV) {
    return '';
  }
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) {
    throw new Error(
      'VITE_API_BASE_URL is required in production. Please set it in your environment variables.'
    );
  }
  return baseUrl;
};

export const getApiUsername = (): string => {
  const username = import.meta.env.VITE_API_USERNAME;
  if (!username) {
    console.error('VITE_API_USERNAME is not defined in environment variables');
    return 'placeholder_user';
  }
  return username;
};

export const getApiPassword = (): string => {
  const password = import.meta.env.VITE_API_PASSWORD;
  if (!password) {
    console.error('VITE_API_PASSWORD is not defined in environment variables');
    return 'placeholder_password';
  }
  return password;
};

