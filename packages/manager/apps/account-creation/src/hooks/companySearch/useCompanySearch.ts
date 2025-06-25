import { z } from 'zod';
import { searchMinlength } from '@/pages/company/company.constants';

export const useCompanySearchSchema = () => {
  const search = z
    .string({
      required_error: 'required_field',
    })
    .trim()
    .min(1, 'required_field')
    .min(searchMinlength, 'error_min_chars');

  return z.object({
    search,
  });
};
