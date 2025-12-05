import { useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Button,
  FormField,
  FormFieldError,
  FormFieldLabel,
  INPUT_TYPE,
  Input,
  Password,
  Select,
  SelectContent,
  SelectControl,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Link, LinkType, useNotifications } from '@ovh-ux/muk';

import { postManagedCmsResourceWebsite } from '@/data/api/managedWordpress';
import { useManagedWordpressReferenceAvailableLanguages } from '@/data/hooks/managedWordpress/managedWordpressReferenceAvailableLanguages/useManagedWordpressReferenceAvailableLanguages';
import { useManagedCmsLatestPhpVersion } from '@/data/hooks/managedWordpress/managedWordpressReferenceSupportedPHPVersions/managedWordpressReferenceSupportedPHPVersions';
import { useManagedWordpressResourceDetails } from '@/data/hooks/managedWordpress/managedWordpressResourceDetails/useManagedWordpressResourceDetails';
import { CmsType } from '@/data/types/product/managedWordpress/cms';
import { useGenerateUrl } from '@/hooks';
import { zForm } from '@/utils';

export default function CreatePage() {
  const { t } = useTranslation([NAMESPACES.FORM, NAMESPACES.ERROR, 'common', 'managedWordpress']);
  const { serviceName } = useParams();
  const navigate = useNavigate();

  const goBackUrl = useGenerateUrl('..', 'href');
  const onCloseUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(onCloseUrl);
  interface LanguageOption {
    code: string;
    name: string;
  }

  const { data } = useManagedWordpressReferenceAvailableLanguages() as {
    data: LanguageOption[] | undefined;
  };
  const { refetch } = useManagedWordpressResourceDetails(serviceName);
  const { data: phpVersion } = useManagedCmsLatestPhpVersion();
  const { addError, addSuccess } = useNotifications();
  const {
    control,
    handleSubmit,
    formState: { isValid, errors, isDirty },
  } = useForm({
    defaultValues: {
      adminLogin: '',
      adminPassword: '',
      cmsSpecific: {
        wordpress: {
          language: '',
        },
      },
      phpVersion: '',
    },
    mode: 'onTouched',
    resolver: zodResolver(zForm(t).CREATE_SITE_FORM_SCHEMA),
  });

  const { mutate: createWebsite, isPending } = useMutation({
    mutationFn: async ({
      adminLogin,
      adminPassword,
      cmsSpecific: {
        wordpress: { language },
      },
      phpVersion,
    }: {
      adminLogin: string;
      adminPassword: string;
      cmsSpecific: {
        wordpress: { language?: string };
      };
      phpVersion: string;
    }) => {
      const cmsSpecificPayload =
        language && language.trim()
          ? {
              wordpress: { language: language.trim() },
            }
          : undefined;

      return postManagedCmsResourceWebsite(serviceName, {
        targetSpec: {
          creation: {
            adminLogin,
            adminPassword,
            cms: CmsType.WORDPRESS,
            ...(cmsSpecificPayload && { cmsSpecific: cmsSpecificPayload }),
            phpVersion,
          },
        },
      });
    },
    onSuccess: () => {
      addSuccess(
        <Text preset={TEXT_PRESET.paragraph}>
          {t('managedWordpress:web_hosting_managed_wordpress_create_webiste_success')}
        </Text>,
        true,
      );
    },
    onError: () => {
      addError(
        <Text>{t('managedWordpress:web_hosting_managed_wordpress_create_webiste_error')}</Text>,
        true,
      );
    },
    onSettled: () => {
      void refetch();
      onClose();
    },
  });

  const onCreateSubmit: SubmitHandler<{
    adminLogin: string;
    adminPassword: string;
    cmsSpecific: {
      wordpress: { language?: string };
    };
    phpVersion: string;
  }> = ({
    adminLogin,
    adminPassword,
    cmsSpecific: {
      wordpress: { language },
    },
    phpVersion,
  }) => {
    createWebsite({
      adminLogin,
      adminPassword,
      cmsSpecific: {
        wordpress: { language: language || undefined },
      },
      phpVersion,
    });
  };

  return (
    <div className="mt-4 flex w-full flex-col items-start gap-4 md:w-1/2">
      <Text preset={TEXT_PRESET.heading1} className="mb-4">
        {t('common:create_website')}
      </Text>
      <Link type={LinkType.back} href={goBackUrl} className="mb-4">
        {t('common:web_hosting_common_sites_backlink')}
      </Link>
      <Text preset={TEXT_PRESET.span}>{t(`${NAMESPACES.FORM}:mandatory_fields`)}</Text>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit(onCreateSubmit)(e);
        }}
      >
        <Text preset={TEXT_PRESET.heading3} className="mb-4">
          {t('managedWordpress:web_hosting_managed_wordpress_create_webiste_create_login')}
        </Text>
        <Controller
          name="cmsSpecific.wordpress.language"
          control={control}
          render={({ field }) => (
            <FormField className="mb-4 w-full">
              <FormFieldLabel>
                {t('managedWordpress:web_hosting_managed_wordpress_create_webiste_language_admin')}
              </FormFieldLabel>
              <Select
                name={field.name}
                id="input-language"
                data-testid="input-language"
                value={field.value ? [field.value] : []}
                items={
                  data
                    ? data.map((option: LanguageOption) => ({
                        value: option.code,
                        label: option.name,
                      }))
                    : []
                }
                onValueChange={(detail) => field.onChange(detail.value[0] ?? '')}
                onBlur={() => field.onBlur?.()}
              >
                <SelectControl
                  placeholder={t(
                    'managedWordpress:web_hosting_managed_wordpress_create_webiste_select_language',
                  )}
                />
                <SelectContent />
              </Select>
            </FormField>
          )}
        />
        <Controller
          name="phpVersion"
          control={control}
          render={({ field }) => (
            <FormField className="mb-4 w-full">
              <FormFieldLabel>
                {t('managedWordpress:web_hosting_managed_wordpress_create_webiste_php_version')}*
              </FormFieldLabel>
              <Select
                name={field.name}
                data-testid="input-phpVersion"
                id="input-phpVersion"
                value={field.value ? [field.value] : []}
                items={
                  phpVersion
                    ? phpVersion.map((version) => ({ value: version, label: version }))
                    : []
                }
                onValueChange={(detail) => field.onChange(detail.value[0] ?? '')}
                onBlur={() => field.onBlur?.()}
              >
                <SelectControl
                  placeholder={t(
                    'managedWordpress:web_hosting_managed_wordpress_create_webiste_select_version',
                  )}
                />
                <SelectContent />
              </Select>
            </FormField>
          )}
        />
        <Controller
          name="adminLogin"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <FormField className="mb-4 w-full" invalid={!!error && invalid}>
              <FormFieldLabel>{t('common:web_hosting_common_admin_email')}*</FormFieldLabel>
              <Input
                type={INPUT_TYPE.text}
                name={field.name}
                value={field.value}
                data-testid="input-admin-login"
                invalid={!!errors.adminLogin}
                onBlur={field.onBlur}
                onChange={(e) => {
                  return field.onChange(e.target.value);
                }}
                clearable
              />
              <FormFieldError>{errors?.adminLogin?.message}</FormFieldError>
            </FormField>
          )}
        />
        <Controller
          name="adminPassword"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <FormField className="mb-4 w-full" invalid={!!error && invalid}>
              <FormFieldLabel>{t('common:web_hosting_common_admin_password')}*</FormFieldLabel>
              <Password
                name={field.name}
                value={field.value}
                data-testid="input-admin-password"
                invalid={!!errors.adminPassword}
                onBlur={field.onBlur}
                onChange={(e) => field.onChange(e.target?.value)}
                className="w-full"
                clearable
              />
              <Text preset={TEXT_PRESET.paragraph} className="mt-6">
                <div>{t(`${NAMESPACES.FORM}:change_password_helper1`)}</div>
                <ul className="mt-0">
                  <li>
                    {t(`${NAMESPACES.FORM}:min_chars`, {
                      value: 8,
                    })}
                  </li>
                  <li>
                    {t(`${NAMESPACES.FORM}:max_chars`, {
                      value: 30,
                    })}
                  </li>
                  <li>{t(`${NAMESPACES.FORM}:change_password_helper2`)}</li>
                </ul>
              </Text>
              <FormFieldError>{errors?.adminPassword?.message}</FormFieldError>
            </FormField>
          )}
        />
        <FormField>
          <Button
            type="submit"
            id="create"
            data-testid="create"
            disabled={!isDirty || !isValid}
            loading={isPending}
          >
            {t('common:web_hosting_common_action_continue')}
          </Button>
        </FormField>
      </form>
    </div>
  );
}
