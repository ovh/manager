import { urls } from '../../src/router/constants';

export const appUrl = 'http://localhost:9001/app/';

export const getUrl = (route: keyof typeof urls, id?: string) => {
  const suffix = urls[route].replace(':id', id);
  return `${appUrl}#${suffix}`;
};
