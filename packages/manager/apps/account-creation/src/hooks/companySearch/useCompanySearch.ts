import { z } from 'zod';

export const useCompanySearchSchema = () => {
  const search = z
    .string({
      required_error: 'invalid_format',
    })
    .trim()
    .regex(/^\d{14}$/, 'invalid_format');

  return z.object({
    search,
  });
};
