import { z } from 'zod';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { CmsType } from '@/data/types/product/managedWordpress/cms';
import { AssociationType } from '@/data/types/product/website';

import { ADVANCED_INSTALL_PASSWORD_REGEX, PASSWORD_REGEX } from './form';

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
        language: z.string().optional(),
      }),
    }),
    phpVersion: z.string().min(1, t(`${NAMESPACES.FORM}:required_field`)),
  });
  return {
    ADD_SITE_FORM_SCHEMA,
    CREATE_SITE_FORM_SCHEMA,
  };
};

export const websiteFormSchema = z
  .object({
    associationType: z.enum([
      AssociationType.EXISTING,
      AssociationType.EXTERNAL,
      AssociationType.ORDER,
    ]),
    cdn: z.boolean().optional(),
    firewall: z.boolean().optional(),
    name: z.string(),
    path: z.string().optional(),
    autoConfigureDns: z.boolean().optional(),
    fqdn: z.string(),
    ip: z.boolean().optional(),
    selectedIp: z.string().optional(),
    advancedInstallation: z.boolean().optional(),
    selectedDatabase: z.string().optional(),
    databaseServer: z.string().optional(),
    databaseName: z.string().optional(),
    databasePort: z.string().optional(),
    databaseUser: z.string().optional(),
    databasePassword: z.string().optional(),
    adminName: z.string().optional(),
    adminPassword: z.string().optional(),
    moduleDomain: z.string().optional(),
    moduleLanguage: z.string().optional(),
    moduleInstallPath: z.string().optional(),
    module: z
      .enum([CmsType.PRESTASHOP, CmsType.WORDPRESS, CmsType.DRUPAL, CmsType.JOOMLA, CmsType.NONE])
      .optional(),
    advancedConfiguration: z.boolean().optional(),
    wwwNeeded: z.boolean().optional(),
    hasSubdomain: z.boolean().optional(),
    subdomain: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    const shouldValidateAdvancedInstallation =
      values.associationType === AssociationType.EXISTING && values.advancedInstallation;

    if (!shouldValidateAdvancedInstallation) {
      return;
    }

    const requireField = (field: keyof typeof values, message: string) => {
      if (!values[field]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message,
        });
      }
    };

    if (!values.module || values.module === CmsType.NONE) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['module'],
        message: 'Module selection is required for advanced installation.',
      });
    }

    requireField('selectedDatabase', 'Database selection is required.');
    requireField('databaseServer', 'Server address is required.');
    requireField('databaseName', 'Database name is required.');
    requireField('databasePort', 'Database port is required.');
    requireField('databaseUser', 'Database user is required.');
    requireField('databasePassword', 'Database password is required.');

    requireField('adminName', 'Administrator is required.');
    requireField('adminPassword', 'Administrator password is required.');
    requireField('moduleDomain', 'Domain selection is required.');
    requireField('moduleLanguage', 'Language selection is required.');
    requireField('moduleInstallPath', 'Install path is required.');

    const validatePassword = (password: string | undefined, path: string[]) => {
      if (!password) {
        return;
      }
      if (!ADVANCED_INSTALL_PASSWORD_REGEX.test(password)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path,
          message:
            'Password must contain 8-31 characters, at least 1 uppercase, 1 lowercase and 2 digits with no special characters.',
        });
      }
    };

    validatePassword(values.databasePassword, ['databasePassword']);
    validatePassword(values.adminPassword, ['adminPassword']);
  });
