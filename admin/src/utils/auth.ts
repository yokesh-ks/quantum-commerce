import { redirect } from 'react-router';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token;
};

export const requireAuth = (request: Request) => {
  const token = getAuthToken();

  if (!token) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams();
    searchParams.set('redirect', url.pathname);
    throw redirect(`/login?${searchParams.toString()}`);
  }

  return token;
};
