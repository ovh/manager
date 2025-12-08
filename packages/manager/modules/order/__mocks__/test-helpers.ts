import { Request as PlaywrightRequest } from '@playwright/test';

export const getParamsFromUrl = (
  request: Request,
  params: Record<string, number>,
): Record<string, string> => {
  const splittedUrl = ((request as unknown) as PlaywrightRequest)
    .url()
    .split('/');
  return Object.entries(params).reduce<Record<string, string>>(
    (result, [name, index]) => ({
      ...result,
      [name]: splittedUrl[index < 0 ? splittedUrl.length + index : index] ?? '',
    }),
    {},
  );
};
