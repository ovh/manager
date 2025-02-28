import { z } from 'zod';
import i18n from 'i18next';

const customErrorMap: z.ZodErrorMap = (error, ctx) => {
  switch (error.code) {
    case z.ZodIssueCode.too_big:
      if (error.type === 'string') {
        return {
          message: i18n?.t('common:form_max_chars', { value: error.maximum }),
        };
      }
      break;
    case z.ZodIssueCode.too_small:
      if (error.type === 'string') {
        return {
          message: i18n?.t('common:form_min_chars', { value: error.minimum }),
        };
      }
      break;
    default:
      break;
  }

  if (ctx.defaultError === 'Required' || ctx.defaultError === 'Invalid') {
    return { message: i18n?.t('common:form_required_field') };
  }

  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);

export const ACCOUNT_REGEX = /^(?:[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*)(?:(?:[.|+])(?:[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*))*$/;

export const PASSWORD_REGEX = /^(?=.*[!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*\d)(?=.*[A-Z])(?=(.*)).{10,64}$/;

export const OWNER_REGEX = /^[A-Za-z0-9]{2,20}$/;

export const DOMAIN_REGEX = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const containsUppercase = (s: string) => !!(s && /[A-Z]/.test(s));
export const containsDigit = (s: string) => !!(s && /\d/.test(s));
export const containsSpecial = (s: string) =>
  !!(s && /[!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?]/.test(s));

export const password = z
  .string()
  .min(10)
  .max(64)
  .superRefine((pwd, ctx) => {
    const uppercase = containsUppercase(pwd);
    const digit = containsDigit(pwd);
    const special = containsSpecial(pwd);

    if (!uppercase) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18n?.t('common:form_min_uppercase'),
      });
    }

    if (!digit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18n?.t('common:form_min_digit'),
      });
    }

    if (!special) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18n?.t('common:form_min_special'),
      });
    }
  });

export const withPassword = z.object({ password });
export const withOptionalPassword = z.object({
  password: password.or(z.literal('')),
});

export const account = z
  .string()
  .regex(ACCOUNT_REGEX, i18n?.t('common:form_valid_account'));

export const domain = z
  .string()
  .regex(DOMAIN_REGEX, i18n?.t('common:form_valid_domain'));

export const email = z.string().email(i18n?.t('common:form_valid_email'));

export const date = z.date({ message: i18n?.t('common:form_valid_date') });

export const requiredString = z
  .string()
  .min(1, i18n?.t('common:form_required_field'));

export const baseEmailAccountSchema = z.object({
  account,
  domain,
  lastName: z.string().optional(),
  firstName: z.string().optional(),
  displayName: z.string().optional(),
});

export const addEmailAccountSchema = baseEmailAccountSchema.merge(withPassword);
export const editEmailAccountSchema = baseEmailAccountSchema.merge(
  withOptionalPassword,
);

export type AddEmailAccountSchema = z.infer<typeof addEmailAccountSchema>;
export type EditEmailAccountSchema = z.infer<typeof editEmailAccountSchema>;

export const organizationSchema = z.object({
  name: z.string(),
  label: z
    .string()
    .min(2)
    .max(12),
});

export type OrganizationSchema = z.infer<typeof organizationSchema>;

export const domainSchema = z.object({
  organizationId: requiredString,
  name: domain,
  autoConfigureMX: z.boolean(),
  autoConfigureSPF: z.boolean(),
  autoConfigureDKIM: z.boolean(),
});

export type DomainSchema = z.infer<typeof domainSchema>;

export const editDomainSchema = z.object({
  domainId: requiredString,
  organizationId: requiredString,
});

export type EditDomainSchema = z.infer<typeof editDomainSchema>;

export const aliasSchema = z.object({
  account,
  domain,
});

export type AliasSchema = z.infer<typeof aliasSchema>;

export const redirectionSchema = z.object({
  account,
  domain,
  to: email,
  keepCopy: z.boolean(),
});

export type RedirectionSchema = z.infer<typeof redirectionSchema>;

export const baseAutoReplySchema = z.object({
  account,
  domain,
  message: requiredString,
});

export const temporaryAutoReplySchema = z.object({
  duration: z.literal('temporary'),
  from: date,
  until: date,
});

export const permanentAutoReplySchema = z.object({
  duration: z.literal('permanent'),
  from: date.nullable().optional(),
  until: date.nullable().optional(),
});

export const withCopyAutoReplySchema = z.object({
  sendCopy: z.literal(true),
  sendCopyTo: email,
});

export const withoutCopyAutoReplySchema = z.object({
  sendCopy: z.literal(false),
  sendCopyTo: z.string(),
});

export const autoReplySchema = z
  .discriminatedUnion('duration', [
    temporaryAutoReplySchema,
    permanentAutoReplySchema,
  ])
  .and(
    z.discriminatedUnion('sendCopy', [
      withCopyAutoReplySchema,
      withoutCopyAutoReplySchema,
    ]),
  )
  .and(baseAutoReplySchema);

export type AutoReplySchema = z.infer<typeof autoReplySchema>;

export const mailingListSchema = z.object({
  account,
  domain,
  defaultReplyTo: requiredString,
  owner: z.string().regex(OWNER_REGEX),
  language: requiredString,
  moderationOption: requiredString,
  subscriberModeration: z.boolean(),
});

export type MailingListSchema = z.infer<typeof mailingListSchema>;
