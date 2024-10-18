import { urls } from '../../src/routes/routes.constant';

export const appUrl = 'http://localhost:9001/app';

export type AppRoute = keyof typeof urls;

export const getUrl = (route: AppRoute) => `${appUrl}/#${urls[route]}`;
