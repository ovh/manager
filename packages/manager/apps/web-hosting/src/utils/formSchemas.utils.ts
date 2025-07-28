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

// @todo: to verify with requester for schemas
export const zForm = (t: string) => {
  const ADD_SITE_FORM_SCHEMA = z.object({
    login: looseOptional(
      z
        .string()
        .min(3, t(`${NAMESPACES.FORM}:min_chars`, { value: 3 }))
        .max(50, t(`${NAMESPACES.FORM}:max_chars`, { value: 60 }))
        .refine(
          (val) =>
            /^(?!\.)(?!.*\.\.)(?:[-_.'A-Za-z\d])+(?!\.)$/.test(val) ||
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
          t(`${NAMESPACES.FORM}:error_between_min_max_chars`, {
            min: 3,
            max: 50,
          }),
        ),
    ),
    password: looseOptional(
      z
        .string()
        .regex(PASSWORD_REGEX, t(`${NAMESPACES.FORM}:error_pattern`))
        .min(8, t(`${NAMESPACES.FORM}:min_chars`, { minlength: 8 }))
        .max(50, t(`${NAMESPACES.FORM}:max_chars`, { maxlength: 50 })),
    ),
    url: looseOptional(z.string().url(t(`${NAMESPACES.FORM}:error_pattern`))),
  });
  return {
    ADD_SITE_FORM_SCHEMA,
  };
};
