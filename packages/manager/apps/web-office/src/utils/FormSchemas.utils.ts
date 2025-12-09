import i18next from 'i18next';
import { z } from 'zod';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { CountriesEnum, LanguagesEnum } from '@/data/api/mca/type';

import { PASSWORD_REGEX } from './form';

const looseOptional = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(
    (value: unknown) =>
      value === null || (typeof value === 'string' && value === '') ? undefined : value,
    schema.optional(),
  );

// eslint-disable-next-line max-lines-per-function
export const zForm = (t: typeof i18next.t, login?: string, automatiqueMode?: boolean) => {
  const formFieldError = t(`${NAMESPACES.FORM}:error_required_field`);
  const formFieldErrorMin = `${NAMESPACES.FORM}:error_min_chars`;
  const formFieldErrorMax = `${NAMESPACES.FORM}:error_max_chars`;
  const formFieldErrorPattern = t(`${NAMESPACES.FORM}:error_pattern`);
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
      .regex(/^(?!\.)(?!.*\.\.)(?:[-_.'A-Za-z\d])+(?!\.)$/, formFieldErrorPattern),
  });
  const POST_USERS_FORM_SCHEMA = z.object({
    firstName: z
      .string()
      .min(1, formFieldError)
      .max(255, t(formFieldErrorMax, { value: 255 })),

    lastName: z
      .string()
      .min(1, formFieldError)
      .max(255, t(formFieldErrorMax, { value: 255 })),

    login: z
      .string()
      .min(3, t(formFieldErrorMin, { value: 3 }))
      .max(20, t(formFieldErrorMax, { value: 20 }))
      .regex(/^(?!\.)(?!.*\.\.)(?:[-_.'A-Za-z\d])+(?!\.)$/, formFieldErrorPattern),

    licence: z.string(),
    usageLocation: z.string(),
    domain: z.string(),
  });

  const passwordSchema = z
    .string()
    .regex(PASSWORD_REGEX, t(`${NAMESPACES.FORM}:error_password`))
    .regex(new RegExp(`^((?!${login}).)*$`), {
      message: t('dashboard_users_change_password_helper3'),
    })
    .min(8, t(formFieldErrorMin, { value: 8 }))
    .max(16, t(formFieldErrorMax, { value: 16 }));

  const emailSchema = z
    .string()
    .email(t(`${NAMESPACES.FORM}:error_email`))
    .max(255)
    .nullable();

  const CHANGE_PASSWORD_USERS_FORM_SCHEMA = z.object({
    password: automatiqueMode ? looseOptional(passwordSchema) : passwordSchema,
    email: automatiqueMode ? emailSchema : looseOptional(emailSchema),
  });

  const AGREEMENT_FORM_SCHEMA = z.object({
    country: z.nativeEnum(CountriesEnum),
    companyName: z.string().min(1, formFieldError),
    language: z.nativeEnum(LanguagesEnum),
    signatoryFirstName: z.string().min(1, formFieldError),
    signatoryLastName: z.string().min(1, formFieldError),
    emailAddress: z.string().email(t(`${NAMESPACES.FORM}:error_email`)),
    phoneNumber: z.string().min(1, formFieldError),
  });

  return {
    EDIT_USERS_FORM_SCHEMA,
    POST_USERS_FORM_SCHEMA,
    CHANGE_PASSWORD_USERS_FORM_SCHEMA,
    AGREEMENT_FORM_SCHEMA,
  };
};
