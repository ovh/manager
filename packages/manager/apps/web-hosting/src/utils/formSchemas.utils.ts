import { z } from 'zod';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { PASSWORD_REGEX } from './form';

export const zForm = (t: (key: string, params?: Record<string, unknown>) => string) => {
  const ADD_SITE_FORM_SCHEMA = z.object({
    adminLogin: z
      .string()
      .min(1, t(`${NAMESPACES.FORM}:min_chars`, { value: 1 }))
      .max(60, t(`${NAMESPACES.FORM}:max_chars`, { value: 60 }))
      .regex(/^[\w.@\-\s]{1,60}$/, t(`${NAMESPACES.FORM}:error_email`)),
    adminPassword: z
      .string()
      .regex(
        PASSWORD_REGEX,
        t(`${NAMESPACES.FORM}:error_between_min_max_chars`, {
          min: 8,
          max: 50,
        }),
      )
      .min(8, t(`${NAMESPACES.FORM}:min_chars`, { value: 8 }))
      .max(50, t(`${NAMESPACES.FORM}:max_chars`, { value: 50 })),

    adminURL: z.string().url(t(`${NAMESPACES.FORM}:error_pattern`)),
  });
  const CREATE_SITE_FORM_SCHEMA = z.object({
    adminLogin: z
      .string()
      .min(1, t(`${NAMESPACES.FORM}:min_chars`, { value: 1 }))
      .max(60, t(`${NAMESPACES.FORM}:max_chars`, { value: 60 }))
      .email(t(`${NAMESPACES.FORM}:error_pattern`)),
    adminPassword: z
      .string()
      .regex(
        PASSWORD_REGEX,
        t(`${NAMESPACES.FORM}:error_between_min_max_chars`, {
          min: 8,
          max: 30,
        }),
      )
      .min(8, t(`${NAMESPACES.FORM}:min_chars`, { value: 8 }))
      .max(50, t(`${NAMESPACES.FORM}:max_chars`, { value: 30 })),

    cmsSpecific: z.object({
      wordpress: z.object({
        language: z.string().min(1, t(`${NAMESPACES.FORM}:required_field`)),
      }),
    }),
    phpVersion: z.string().min(1, t(`${NAMESPACES.FORM}:required_field`)),
  });
  return {
    ADD_SITE_FORM_SCHEMA,
    CREATE_SITE_FORM_SCHEMA,
  };
};
