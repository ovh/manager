import { urls } from '../../src/routes/routes.constants';

export const appUrl = 'http://localhost:9001/app/';

export type AppRoute = keyof typeof urls;

export const getUrl = (
  route: AppRoute,
  params?: {
    id?: string;
    vrackId?: string;
    cidr?: string;
    urn?: string;
    region?: string;
  },
) => {
  const suffix = params
    ? Object.entries(params).reduce(
        (url, [key, value]) => url.replace(`:${key}`, value),
        urls[route],
      )
    : urls[route];
  return `${appUrl}#${suffix}`;
};
