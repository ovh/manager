export const appUrl = 'http://localhost:9001/app';

export const urls = {
  root: '/',
};

export type AppRoute = keyof typeof urls;

export const getUrl = (route: AppRoute) => `${appUrl}${urls[route]}`;
