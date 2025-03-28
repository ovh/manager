import { z } from 'zod';
import i18n from 'i18next';
import { PASSWORD_REGEX } from './form';

const looseOptional = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(
    (value: unknown) =>
      value === null || (typeof value === 'string' && value === '')
        ? undefined
        : value,
    schema.optional(),
  );

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
      /^(?!\.)(?!.*\.\.)(?:[-_.'A-Za-z\d])+(?!\.)$/,
      i18n?.t('common:common_field_error_pattern'),
    ),
});
export const POST_USERS_FORM_SCHEMA = z.object({
  firstName: z
    .string()
    .min(1, i18n?.t('common:common_field_error_required'))
    .max(
      255,
      i18n?.t('common:common_field_error_maxlength', { maxlength: 255 }),
    ),

  lastName: z
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
      /^(?!\.)(?!.*\.\.)(?:[-_.'A-Za-z\d])+(?!\.)$/,
      i18n?.t('common:common_field_error_pattern'),
    ),

  licence: z.string(),
  usageLocation: z.string(),
  domain: z.string(),
});
export const CHANGE_PASSWORD_USERS_FORM_SCHEMA = z
  .object({
    password: looseOptional(
      z
        .string()
        .regex(PASSWORD_REGEX, i18n?.t('common:common_field_error_password'))
        .min(
          8,
          i18n?.t('common:common_field_error_minlength', { minlength: 8 }),
        )
        .max(
          16,
          i18n?.t('common:common_field_error_maxlength', { maxlength: 16 }),
        ),
    ),
    confirmPassword: looseOptional(
      z
        .string()
        .min(
          8,
          i18n?.t('common:common_field_error_minlength', { minlength: 8 }),
        )
        .max(
          16,
          i18n?.t('common:common_field_error_maxlength', { maxlength: 16 }),
        ),
    ),
    email: looseOptional(
      z
        .string()
        .email(i18n?.t('common:common_field_error_email'))
        .max(255)
        .nullable(),
    ),
  })
  .refine(
    (data) =>
      data.confirmPassword === undefined ||
      data.confirmPassword === data.password,
    {
      message: i18n?.t('common:common_field_error_confirm_password'),
      path: ['confirmPassword'],
    },
  );
