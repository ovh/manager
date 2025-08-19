import { z } from 'zod';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { PASSWORD_REGEX } from './form';

// @todo: to verify with requester for schemas
export const zForm = (t: any) => {
  const ADD_SITE_FORM_SCHEMA = z.object({
    adminLogin: z
      .string()
      .min(1, t(`${NAMESPACES.FORM}:min_chars`, { value: 1 }))
      .max(60, t(`${NAMESPACES.FORM}:max_chars`, { value: 60 }))
      .regex(/^[\w.@\-\s]{1,60}$/, t(`${NAMESPACES.FORM}:invalid_format`)),
    adminPassword: z
      .string()
      .regex(PASSWORD_REGEX, t(`${NAMESPACES.FORM}:error_pattern`))
      .min(8, t(`${NAMESPACES.FORM}:min_chars`, { value: 8 }))
      .max(50, t(`${NAMESPACES.FORM}:max_chars`, { value: 50 })),

    adminURL: z.string().url(t(`${NAMESPACES.FORM}:error_pattern`)),
  });
  const CREATE_SITE_FORM_SCHEMA = z.object({
    adminLogin: z
      .string()
      .min(1, t(`${NAMESPACES.FORM}:min_chars`, { value: 1 }))
      .max(60, t(`${NAMESPACES.FORM}:max_chars`, { value: 60 }))
      .email(t(`${NAMESPACES.FORM}:invalid_format`)),
    adminPassword: z
      .string()
      .regex(PASSWORD_REGEX, t(`${NAMESPACES.FORM}:error_pattern`))
      .min(8, t(`${NAMESPACES.FORM}:min_chars`, { value: 8 }))
      .max(50, t(`${NAMESPACES.FORM}:max_chars`, { value: 30 })),

    cmsSpecific: z.object({
      wordPress: z.object({
        language: z.string(),
      }),
    }),
  });
  return {
    ADD_SITE_FORM_SCHEMA,
    CREATE_SITE_FORM_SCHEMA,
  };
};
