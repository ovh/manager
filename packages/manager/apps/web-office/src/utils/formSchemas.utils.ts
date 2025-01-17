import { z } from 'zod';
import i18n from 'i18next';
import { PASSWORD_REGEX } from './form';

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

export const CHANGE_PASSWORD_USERS_FORM_SCHEMA = z
  .object({
    password: z
      .string()
      .regex(PASSWORD_REGEX, i18n?.t('Mot de passe invalide'))
      .min(8, i18n?.t('common:common_field_error_minlength', { minlength: 8 }))
      .max(
        16,
        i18n?.t('common:common_field_error_maxlength', { maxlength: 16 }),
      )
      .optional(),
    confirmPassword: z
      .string()
      .regex(
        PASSWORD_REGEX,
        i18n?.t('Les mots de passe doivent être identiques'),
      )
      .min(8, i18n?.t('common:common_field_error_minlength', { minlength: 8 }))
      .max(
        16,
        i18n?.t('common:common_field_error_maxlength', { maxlength: 16 }),
      )
      .optional(),
    email: z
      .string()
      .email()
      .max(255)
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword)
  .superRefine((data, ctx) => {
    if (!data.password || !data.email) {
      ctx.addIssue({
        path: [],
        message: i18n?.t('common:common_field_error_invalid'),
        code: z.ZodIssueCode.custom,
      });
    }
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: [],
        message: i18n?.t('common:common_field_error_invalid'),
        code: z.ZodIssueCode.custom,
      });
    }
    if (!data.email) {
      ctx.addIssue({
        path: [],
        message: i18n?.t('common:common_field_error_invalid'),
        code: z.ZodIssueCode.custom,
      });
    }
  });
