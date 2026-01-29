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
  const WEBSITE_FORM_SCHEMA = z.discriminatedUnion('advancedInstallation', [
    z.object({
      associationType: z.enum([
        AssociationType.EXISTING,
        AssociationType.EXTERNAL,
        AssociationType.ORDER,
      ]),
      advancedInstallation: z.literal(false).optional(),

      cdn: z.boolean().optional(),
      firewall: z.boolean().optional(),
      name: z.string(),
      path: z.string().optional(),
      autoConfigureDns: z.boolean().optional(),
      fqdn: z.string(),
      ip: z.boolean().optional(),
      selectedIp: z.string().optional(),

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
    }),

    z.object({
      associationType: z.enum([AssociationType.EXISTING, AssociationType.EXTERNAL]),
      advancedInstallation: z.literal(true),

      cdn: z.boolean().optional(),
      firewall: z.boolean().optional(),
      name: z.string(),
      path: z.string().optional(),
      autoConfigureDns: z.boolean().optional(),
      fqdn: z.string(),
      ip: z.boolean().optional(),
      selectedIp: z.string().optional(),

      module: z.enum([CmsType.PRESTASHOP, CmsType.WORDPRESS, CmsType.DRUPAL, CmsType.JOOMLA]),

      selectedDatabase: z.string().min(1, t(`${NAMESPACES.FORM}:error_required_field`)),
      databaseServer: z.string().min(1, t(`${NAMESPACES.FORM}:error_required_field`)),
      databaseName: z.string().min(1, t(`${NAMESPACES.FORM}:error_required_field`)),
      databasePort: z.string().min(1, t(`${NAMESPACES.FORM}:error_required_field`)),
      databaseUser: z.string().min(1, t(`${NAMESPACES.FORM}:error_required_field`)),
      databasePassword: z
        .string()
        .min(1, t(`${NAMESPACES.FORM}:error_required_field`))
        .regex(ADVANCED_INSTALL_PASSWORD_REGEX, t(`${NAMESPACES.FORM}:error_pattern`)),

      adminName: z.string().min(1, t(`${NAMESPACES.FORM}:error_required_field`)),
      adminPassword: z
        .string()
        .min(1, t(`${NAMESPACES.FORM}:error_required_field`))
        .regex(ADVANCED_INSTALL_PASSWORD_REGEX, t(`${NAMESPACES.FORM}:error_pattern`)),

      moduleDomain: z.string().min(1, t(`${NAMESPACES.FORM}:error_required_field`)),
      moduleLanguage: z.string().min(1, t(`${NAMESPACES.FORM}:error_required_field`)),
      moduleInstallPath: z.string().min(1, t(`${NAMESPACES.FORM}:error_required_field`)),

      advancedConfiguration: z.boolean().optional(),
      wwwNeeded: z.boolean().optional(),
      hasSubdomain: z.boolean().optional(),
      subdomain: z.string().optional(),
    }),
  ]);
  return {
    ADD_SITE_FORM_SCHEMA,
    CREATE_SITE_FORM_SCHEMA,
    GIT_ASSOCIATION_FORM_SCHEMA,
    WEBSITE_FORM_SCHEMA,
  };
};
export type WebsiteFormData = z.infer<ReturnType<typeof zForm>['WEBSITE_FORM_SCHEMA']>;
