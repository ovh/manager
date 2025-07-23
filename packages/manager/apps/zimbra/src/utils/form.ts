import i18n from 'i18next';
import { z } from 'zod';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { ZimbraOffer, ZimbraPlanCodes } from '@/data/api/type';

const customErrorMap: z.ZodErrorMap = (error, ctx) => {
  switch (error.code) {
    case z.ZodIssueCode.too_big:
      if (error.type === 'string') {
        return {
          message: i18n?.t(`${NAMESPACES.FORM}:error_max_chars`, {
            value: error.maximum,
          }),
        };
      }
      break;
    case z.ZodIssueCode.too_small:
      if (error.type === 'string') {
        return {
          message: i18n?.t(`${NAMESPACES.FORM}:error_min_chars`, {
            value: error.minimum,
          }),
        };
      }
      break;
    case z.ZodIssueCode.invalid_type:
      if (error.expected === 'number') {
        return {
          message: i18n?.t('common:form_valid_number'),
        };
      }
      break;
    default:
      break;
  }

  if (ctx.defaultError === 'Required' || ctx.defaultError === 'Invalid') {
    return { message: i18n?.t(`${NAMESPACES.FORM}:required_field`) };
  }

  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);

export const ACCOUNT_REGEX =
  /^(?:[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*)(?:(?:[.|+])(?:[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*))*$/;

export const OWNER_REGEX = /^[A-Za-z0-9]+$/;

export const DOMAIN_REGEX = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const containsLowercase = (s: string) => !!(s && /[a-z]/.test(s));
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
        message: i18n?.t('common:form_at_least_one_uppercase'),
      });
    }

    if (!digit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18n?.t('common:form_at_least_one_digit'),
      });
    }

    if (!special) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18n?.t('common:form_at_least_one_special'),
      });
    }
  });

export const withPassword = z.object({ password });
export const withOptionalPassword = z.object({
  password: password.or(z.literal('')),
});

export const account = z.string().regex(ACCOUNT_REGEX, i18n?.t('common:form_valid_account'));

export const domain = z.string().regex(DOMAIN_REGEX, i18n?.t('common:form_valid_domain'));

export const email = z.string().toLowerCase().email(i18n?.t('common:form_valid_email'));

export const date = z.date({ message: i18n?.t('common:form_valid_date') });

export const requiredString = z.string().min(1, i18n?.t(`${NAMESPACES.FORM}:required_field`));

export const withSlotId = z.object({
  slotId: z.string(),
});

// @TODO: remove when backend doesn't require that anymore
export const withOffer = z.object({
  offer: z.enum([ZimbraOffer.STARTER, ZimbraOffer.PRO]),
});

export const baseEmailAccountSchema = z.object({
  account,
  domain,
  lastName: z.string().optional(),
  firstName: z.string().optional(),
  displayName: z.string().optional(),
  offer: z.enum([ZimbraOffer.STARTER, ZimbraOffer.PRO]).optional(),
  hideInGal: z.boolean().optional(),
  forceChangePasswordAfterLogin: z.boolean().optional(),
  slotId: z.string().optional(),
});

export const addEmailAccountSchema = baseEmailAccountSchema
  .merge(withPassword)
  .merge(withSlotId)
  .merge(withOffer);

export const addEmailAccountsSchema = z
  .object({
    accounts: z
      .array(
        // in this schema first and last names are required
        baseEmailAccountSchema
          .merge(withPassword)
          .merge(withOffer)
          .merge(
            z.object({
              firstName: requiredString,
              lastName: requiredString,
            }),
          ),
      )
      .min(1),
  })
  .superRefine((data, ctx) => {
    const emails = data.accounts.map((item) => `${item.account}@${item.domain}`);
    const uniqueEmails = new Set(emails);

    if (emails.length !== uniqueEmails.size) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const editEmailAccountSchema = baseEmailAccountSchema.merge(withOptionalPassword);

export type AddEmailAccountSchema = z.infer<typeof addEmailAccountSchema>;
export type AddEmailAccountsSchema = z.infer<typeof addEmailAccountsSchema>;
export type EditEmailAccountSchema = z.infer<typeof editEmailAccountSchema>;

export const orderEmailAccountSchema = z.object({
  consent: z.literal<boolean>(true),
  [ZimbraPlanCodes.ZIMBRA_STARTER]: z.number().positive().min(1).max(1000),
  commitment: z.enum(['1', '12']),
});

export type OrderEmailAccountSchema = z.infer<typeof orderEmailAccountSchema>;

export const organizationSchema = z.object({
  name: requiredString.min(2),
  label: requiredString.min(2).max(12),
});

export type OrganizationSchema = z.infer<typeof organizationSchema>;

export const simpleOrganizationSchema = z.object({
  name: requiredString.min(2),
});

export type SimpleOrganizationSchema = z.infer<typeof simpleOrganizationSchema>;

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
  .discriminatedUnion('duration', [temporaryAutoReplySchema, permanentAutoReplySchema])
  .and(z.discriminatedUnion('sendCopy', [withCopyAutoReplySchema, withoutCopyAutoReplySchema]))
  .and(baseAutoReplySchema);

export type AutoReplySchema = z.infer<typeof autoReplySchema>;

export const mailingListSchema = z.object({
  account,
  domain,
  defaultReplyTo: requiredString,
  owner: z.string().regex(OWNER_REGEX).min(2).max(20),
  language: requiredString,
  moderationOption: requiredString,
  subscriberModeration: z.boolean(),
});

export type MailingListSchema = z.infer<typeof mailingListSchema>;
