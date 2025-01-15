import { z } from 'zod';
import i18n from 'i18next';

export const EDIT_USERS_FORM_SCHEMA = z.object({
  firstname: z
    .string()
    .min(1, i18n?.t('common:common_field_error_required'))
    .max(
      255,
      i18n?.t('common:common_field_error_maxlength', { maxlength: 255 }),
    ),
  lastname: z
    .string()
    .min(1, i18n?.t('common:common_field_error_required'))
    .max(
      255,
      i18n?.t('common:common_field_error_maxlength', { maxlength: 255 }),
    ),
  login: z
    .string()
    .min(3, i18n?.t('common:common_field_error_minlength', { minlength: 3 }))
    .max(20, i18n?.t('common:common_field_error_maxlength', { maxlength: 20 }))
    .regex(
      /^(?!\.)(?:[-!#$%&'^_`{}~A-Za-z\d]|\.(?!\.))+(?!\.)$/,
      i18n?.t('common:common_field_error_pattern'),
    ),
});
