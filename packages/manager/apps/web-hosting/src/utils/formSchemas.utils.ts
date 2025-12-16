/* eslint-disable max-lines-per-function */
import { z } from 'zod';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { REGEX_GIT_REPO } from '@/constants';
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
  const GIT_ASSOCIATION_FORM_SCHEMA = z.object({
    repositoryUrl: z
      .string()
      .regex(REGEX_GIT_REPO, t('multisite:multisite_git_association_incorrect_url_format')),
    branch: z.string().min(1, t(`${NAMESPACES.FORM}:min_chars`, { value: 1 })),
  });
  return {
    ADD_SITE_FORM_SCHEMA,
    CREATE_SITE_FORM_SCHEMA,
    GIT_ASSOCIATION_FORM_SCHEMA,
  };
};

export const websiteFormSchema = (t: (key: string, params?: Record<string, unknown>) => string) =>
  z
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
      const isAdvancedMode =
        values.advancedInstallation &&
        (values.associationType === AssociationType.EXISTING ||
          values.associationType === AssociationType.EXTERNAL) &&
        values.module &&
        values.module !== CmsType.NONE;

      if (!isAdvancedMode) {
        return;
      }

      if (!values.selectedDatabase) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['selectedDatabase'],
          message: t(`${NAMESPACES.FORM}:error_required_field`),
        });
      }
      if (!values.databaseServer) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['databaseServer'],
          message: t(`${NAMESPACES.FORM}:error_required_field`),
        });
      }
      if (!values.databaseName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['databaseName'],
          message: t(`${NAMESPACES.FORM}:error_required_field`),
        });
      }
      if (!values.databasePort) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['databasePort'],
          message: t(`${NAMESPACES.FORM}:error_required_field`),
        });
      }
      if (!values.databaseUser) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['databaseUser'],
          message: t(`${NAMESPACES.FORM}:error_required_field`),
        });
      }
      if (!values.databasePassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['databasePassword'],
          message: t(`${NAMESPACES.FORM}:error_required_field`),
        });
      } else if (!ADVANCED_INSTALL_PASSWORD_REGEX.test(values.databasePassword)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['databasePassword'],
          message: t(`${NAMESPACES.FORM}:error_pattern`),
        });
      }
      if (!values.adminName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['adminName'],
          message: t(`${NAMESPACES.FORM}:error_required_field`),
        });
      }
      if (!values.adminPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['adminPassword'],
          message: t(`${NAMESPACES.FORM}:error_required_field`),
        });
      } else if (!ADVANCED_INSTALL_PASSWORD_REGEX.test(values.adminPassword)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['adminPassword'],
          message: t(`${NAMESPACES.FORM}:error_pattern`),
        });
      }
      if (!values.moduleDomain) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['moduleDomain'],
          message: t(`${NAMESPACES.FORM}:error_required_field`),
        });
      }
      if (!values.moduleLanguage) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['moduleLanguage'],
          message: t(`${NAMESPACES.FORM}:error_required_field`),
        });
      }
      if (!values.moduleInstallPath) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['moduleInstallPath'],
          message: t(`${NAMESPACES.FORM}:error_required_field`),
        });
      }
    });
