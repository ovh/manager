import {
  Links,
  LinkType,
  ManagerButton,
  Subtitle,
  Title,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  OdsInput,
  OdsFormField,
  OdsPassword,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_INPUT_TYPE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useGenerateUrl } from '@/hooks';
import { zForm } from '@/utils';
import { useManagedWordpressReferenceAvailableLanguages } from '@/data/hooks/managedWordpressReferenceAvailableLanguages/useManagedWordpressReferenceAvailableLanguages';
import { postManagedCmsResourceWebsite } from '@/data/api/managedWordpress';

export default function CreatePage() {
  const { t } = useTranslation([
    NAMESPACES.FORM,
    NAMESPACES.ERROR,
    'common',
    'managedWordpress',
  ]);
  const { serviceName } = useParams();
  const navigate = useNavigate();

  const goBackUrl = useGenerateUrl('..', 'href');
  const onCloseUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(onCloseUrl);
  const { data } = useManagedWordpressReferenceAvailableLanguages();
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
        wordPress: {
          language: '',
        },
      },
    },
    mode: 'onTouched',
    resolver: zodResolver(zForm(t).CREATE_SITE_FORM_SCHEMA),
  });

  const { mutate: createWebsite, isPending } = useMutation({
    mutationFn: async ({
      adminLogin,
      adminPassword,
      cmsSpecific: {
        wordPress: { language },
      },
    }: {
      adminLogin: string;
      adminPassword: string;
      cmsSpecific: {
        wordPress: { language: string };
      };
    }) => {
      return postManagedCmsResourceWebsite(serviceName, {
        adminLogin,
        adminPassword,
        cms: 'WORD_PRESS',
        cmsSpecific: {
          wordPress: { language },
        },
      });
    },
    onSuccess: () => {
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(
            'managedWordpress:web_hosting_managed_wordpress_create_webiste_success',
          )}
        </OdsText>,
        true,
      );
    },
    onError: () => {
      addError(
        <OdsText>
          {t(
            'managedWordpress:web_hosting_managed_wordpress_create_webiste_error',
          )}
        </OdsText>,
        true,
      );
    },
    onSettled: () => {
      onClose();
    },
  });

  const onCreateSubmit: SubmitHandler<{
    adminLogin: string;
    adminPassword: string;
    cmsSpecific: {
      wordPress: { language: string };
    };
  }> = ({
    adminLogin,
    adminPassword,
    cmsSpecific: {
      wordPress: { language },
    },
  }) => {
    createWebsite({
      adminLogin,
      adminPassword,
      cmsSpecific: {
        wordPress: { language },
      },
    });
  };

  return (
    <div className="flex flex-col items-start w-full md:w-1/2 gap-4 mt-4">
      <Title>{t('common:create_website')}</Title>
      <Links
        type={LinkType.back}
        href={goBackUrl}
        label={t('common:web_hosting_common_sites_backlink')}
        className="mb-4"
      />
      <OdsText preset={ODS_TEXT_PRESET.span}>
        {t(`${NAMESPACES.FORM}:mandatory_fields`)}
      </OdsText>
      <form onSubmit={handleSubmit(onCreateSubmit)}>
        <Subtitle>
          {t(
            'managedWordpress:web_hosting_managed_wordpress_create_webiste_create_login',
          )}
        </Subtitle>
        <Controller
          name="cmsSpecific.wordPress.language"
          control={control}
          render={({ field }) => (
            <OdsFormField className="w-full">
              <label slot="label">
                {t(
                  'managedWordpress:web_hosting_managed_wordpress_create_webiste_language_admin',
                )}
                *
              </label>
              <OdsSelect
                name={field.name}
                data-testid="input-language"
                value={field.value}
                placeholder={t(
                  'managedWordpress:web_hosting_managed_wordpress_create_webiste_select_language',
                )}
                onOdsChange={(e) => field.onChange(e.target?.value)}
              >
                {data?.map((option: any) => (
                  <option key={option.code} value={option.code}>
                    {option.name}
                  </option>
                ))}
              </OdsSelect>
            </OdsFormField>
          )}
        />

        <Controller
          name="adminLogin"
          control={control}
          render={({ field }) => (
            <OdsFormField
              className="w-full"
              error={errors?.adminLogin?.message}
            >
              <label slot="label">
                {t('common:web_hosting_common_admin_email')}*
              </label>
              <OdsInput
                type={ODS_INPUT_TYPE.text}
                name={field.name}
                value={field.value as string}
                data-testid="input-admin-login"
                hasError={!!errors.adminLogin}
                onOdsBlur={field.onBlur}
                onOdsChange={(e) => {
                  field.onChange(e.target?.value);
                }}
                isClearable
              />
            </OdsFormField>
          )}
        />

        <Controller
          name="adminPassword"
          control={control}
          render={({ field }) => (
            <OdsFormField
              className="w-full"
              error={errors?.adminPassword?.message}
            >
              <label slot="label">
                {t('common:web_hosting_common_admin_password')}*
              </label>
              <OdsPassword
                name={field.name}
                value={field.value as string}
                data-testid="input-admin-password"
                hasError={!!errors.adminPassword}
                onOdsBlur={field.onBlur}
                onOdsChange={(e) => field.onChange(e.target?.value)}
                className="w-full"
                isClearable
                isMasked
              />
              <OdsText preset={ODS_TEXT_PRESET.paragraph} className="mt-6">
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
              </OdsText>
            </OdsFormField>
          )}
        />

        <OdsFormField>
          <ManagerButton
            type="submit"
            label={t('common:web_hosting_common_action_continue')}
            id="create"
            isDisabled={!isDirty || !isValid}
            isLoading={isPending}
          />
        </OdsFormField>
      </form>
    </div>
  );
}
