import { z } from 'zod';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { PASSWORD_REGEX } from './form';

const looseOptional = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(
    (value: unknown) =>
      value === null || (typeof value === 'string' && value === '')
        ? undefined
        : value,
    schema.optional(),
  );

export const zForm = (t: any) => {
  const formFieldError = t(`${NAMESPACES.FORM}:error_required_field`);
  const formFieldErrorMin = `${NAMESPACES.FORM}:error_min_chars`;
  const formFieldErrorMax = `${NAMESPACES.FORM}:error_max_chars`;
  const EDIT_USERS_FORM_SCHEMA = z.object({
    firstname: z
      .string()
      .min(1, formFieldError)
      .max(255, t(formFieldErrorMax, { value: 255 })),
    lastname: z
      .string()
      .min(1, formFieldError)
      .max(255, t(formFieldErrorMax, { value: 255 })),
    login: z
      .string()
      .min(3, t(formFieldErrorMin, { value: 3 }))
      .max(20, t(formFieldErrorMax, { value: 20 }))
      .regex(
        /^(?!\.)(?!.*\.\.)(?:[-_.'A-Za-z\d])+(?!\.)$/,
        t('common:common_field_error_pattern'),
      ),
  });
  const POST_USERS_FORM_SCHEMA = z.object({
    firstName: z
      .string()
      .min(1, formFieldError)
      .max(255, t(`${NAMESPACES.FORM}:error_max_chars`, { value: 255 })),

    lastName: z
      .string()
      .min(1, formFieldError)
      .max(255, t(formFieldErrorMax, { value: 255 })),

    login: z
      .string()
      .min(3, t(`${NAMESPACES.FORM}:error_min_chars`, { value: 3 }))
      .max(20, t(formFieldErrorMax, { value: 20 }))
      .regex(
        /^(?!\.)(?!.*\.\.)(?:[-_.'A-Za-z\d])+(?!\.)$/,
        t('common:common_field_error_pattern'),
      ),

    licence: z.string(),
    usageLocation: z.string(),
    domain: z.string(),
  });
  const CHANGE_PASSWORD_USERS_FORM_SCHEMA = z
    .object({
      password: looseOptional(
        z
          .string()
          .regex(PASSWORD_REGEX, t('common:common_field_error_password'))
          .min(8, t('common:common_field_error_minlength', { minlength: 8 }))
          .max(16, t('common:common_field_error_maxlength', { maxlength: 16 })),
      ),
      confirmPassword: looseOptional(
        z
          .string()
          .min(8, t('common:common_field_error_minlength', { minlength: 8 }))
          .max(16, t('common:common_field_error_maxlength', { maxlength: 16 })),
      ),
      email: looseOptional(
        z
          .string()
          .email(t('common:common_field_error_email'))
          .max(255)
          .nullable(),
      ),
    })
    .refine(
      (data) =>
        data.confirmPassword === undefined ||
        data.confirmPassword === data.password,
      {
        message: t('common:common_field_error_confirm_password'),
        path: ['confirmPassword'],
      },
    );
  return {
    EDIT_USERS_FORM_SCHEMA,
    POST_USERS_FORM_SCHEMA,
    CHANGE_PASSWORD_USERS_FORM_SCHEMA,
  };
};
