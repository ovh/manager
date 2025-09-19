import { z } from 'zod';

export const useSettingsSchema = () =>
  z.object({
    country: z
      .string({
        required_error: 'required_field',
        invalid_type_error: 'required_field',
      })
      .trim(),
    currency: z
      .string({
        required_error: 'required_field',
      })
      .trim(),
    language: z
      .string({
        required_error: 'required_field',
      })
      .trim(),
  });
