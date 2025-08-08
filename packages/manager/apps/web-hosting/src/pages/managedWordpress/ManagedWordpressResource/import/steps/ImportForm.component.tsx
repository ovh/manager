import {
  ManagerButton,
  ManagerTile,
  Subtitle,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import {
  OdsFormField,
  OdsInput,
  OdsPassword,
  OdsCheckbox,
  OdsText,
  OdsRadio,
  OdsMessage,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_CARD_COLOR,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext, useMemo, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  postManagedCmsResourceWebsite,
  putManagedCmsResourceWebsiteTasks,
} from '@/data/api/managedWordpress';
import { zForm } from '@/utils/formSchemas.utils';
import { useManagedWordpressWebsiteDetails } from '@/data/hooks/managedWordpressWebsiteDetails/useManagedWordpressWebsiteDetails';
import { useGenerateUrl } from '@/hooks';

export default function ImportForm() {
  const { t } = useTranslation([
    NAMESPACES.FORM,
    NAMESPACES.ERROR,
    'common',
    'managedWordpress',
  ]);
  const { serviceName } = useParams();
  const [step, setStep] = useState(1);
  const { environment } = useContext(ShellContext);
  const { language } = environment.getUser();
  const { addError, addSuccess } = useNotifications();

  // form control for step 1
  const {
    control,
    handleSubmit,
    formState: { isValid, errors, isDirty },
  } = useForm({
    defaultValues: {
      adminLogin: '',
      adminPassword: '',
      adminURL: '',
    },
    mode: 'onTouched',
    resolver: zodResolver(zForm(t).ADD_SITE_FORM_SCHEMA),
  });

  const [websiteId, setWebsiteId] = useState<string | null>(null);
  const { data } = useManagedWordpressWebsiteDetails(serviceName, websiteId);
  const navigate = useNavigate();
  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);

  const { mutate: createWebsite, isPending: isSubmittingStep1 } = useMutation({
    mutationFn: async ({
      adminLogin,
      adminPassword,
      adminURL,
    }: {
      adminLogin: string;
      adminPassword: string;
      adminURL: string;
    }) => {
      return postManagedCmsResourceWebsite(serviceName, {
        adminLogin,
        adminPassword,
        adminURL,
        cms: 'WORD_PRESS',
        cmsSpecific: {
          wordPress: { language },
        },
      });
    },
    onSuccess: (response) => {
      if (response?.id) {
        setWebsiteId(response.id);
        setStep(2);
      }
    },
    onError: (error: ApiError) => {
      addError(
        <OdsText>
          {t(`${NAMESPACES.ERROR}error_message`, {
            error: error?.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
  });

  const onStep1Submit: SubmitHandler<{
    adminLogin: string;
    adminPassword: string;
    adminURL: string;
  }> = ({ adminLogin, adminPassword, adminURL }) => {
    createWebsite({ adminLogin, adminPassword, adminURL });
  };

  // form control for step 2
  type Step2FormValues = {
    plugins: { name: string; version: string; enabled: boolean }[];
    themes: { name: string; version: string; active: boolean }[];
    media: boolean;
    wholeDatabase: boolean;
    posts: boolean;
    pages: boolean;
    comments: boolean;
    tags: boolean;
    users: boolean;
  };
  const defaultValuesStep2 = useMemo<Step2FormValues | null>(() => {
    if (!data?.currentState.import.checkResult.cmsSpecific.wordPress) {
      return null;
    }
    const plugins = data.currentState.import.checkResult.cmsSpecific.wordPress.plugins.map(
      (plugin) => ({
        name: plugin.name,
        version: plugin.version,
        enabled: false,
      }),
    );
    const themes = data.currentState.import.checkResult.cmsSpecific.wordPress.themes.map(
      (theme) => ({
        name: theme.name,
        version: theme.version,
        active: false,
      }),
    );
    return {
      plugins,
      themes,
      media: false,
      wholeDatabase: true,
      posts: false,
      pages: false,
      comments: false,
      tags: false,
      users: false,
    };
  }, [data]);

  const step2Form = useForm<Step2FormValues>({
    defaultValues: defaultValuesStep2 ?? {
      plugins: [],
      themes: [],
      media: false,
      wholeDatabase: true,
      posts: false,
      pages: false,
      comments: false,
      tags: false,
      users: false,
    },
    mode: 'onChange',
  });

  const {
    control: controlStep2,
    handleSubmit: handleSubmitStep2,
    watch: watchStep2,
    formState: { isValid: isValidStep2 },
  } = step2Form;

  const { mutate: launchImport, isPending: isSubmittingStep2 } = useMutation({
    mutationFn: async (values: Step2FormValues) => {
      const inputs = {
        'import.cmsSpecific.wordPress.selection': {
          plugins: values.plugins
            .filter((plugin) => plugin.enabled)
            .map(({ name, version, enabled }) => ({ name, version, enabled })),
          themes: values.themes
            .filter((theme) => theme.active)
            .map(({ name, version, active }) => ({ name, version, active })),
          wholeDatabase: values.wholeDatabase,
          media: values.media,
          posts: values.posts,
          pages: values.pages,
          comments: values.comments,
          tags: values.tags,
          users: values.users,
        },
      };
      const currentTaskId = data?.currentTasks?.[0]?.id;
      return putManagedCmsResourceWebsiteTasks(
        serviceName,
        inputs,
        currentTaskId,
      );
    },
    onSuccess: () => {
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(
            'managedWordpress:web_hosting_managed_wordpress_import_success_message',
          )}
        </OdsText>,
        true,
      );
      queryClient.invalidateQueries({
        queryKey: ['managedWordpressWebsiteDetails', serviceName, websiteId],
      });
    },
    onError: (error: ApiError) => {
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(`${NAMESPACES.ERROR}:error_message`, {
            message: error?.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
    onSettled: () => {
      onClose();
    },
  });
  const onStep2Submit: SubmitHandler<Step2FormValues> = (values) => {
    launchImport(values);
  };
  const wholeDatabase = watchStep2('wholeDatabase');
  return (
    <>
      {step === 1 && (
        <form onSubmit={handleSubmit(onStep1Submit)}>
          <Subtitle>{t('common:web_hosting_common_url_connexion')}</Subtitle>
          <Controller
            name="adminURL"
            control={control}
            render={({ field: { name, value, onBlur, onChange } }) => (
              <OdsFormField
                className="w-full"
                error={errors?.adminURL?.message}
              >
                <label slot="label">
                  {t('common:web_hosting_common_admin_url')}*
                </label>
                <OdsInput
                  type={ODS_INPUT_TYPE.text}
                  name={name}
                  value={value as string}
                  data-testid="input-admin-url"
                  hasError={!!errors.adminURL}
                  onOdsBlur={onBlur}
                  onOdsChange={onChange}
                  isClearable
                />
              </OdsFormField>
            )}
          />
          <Subtitle>{t('common:web_hosting_common_wordpress_login')}</Subtitle>
          <Controller
            name="adminLogin"
            control={control}
            render={({ field: { name, value, onBlur, onChange } }) => (
              <OdsFormField
                className="w-full"
                error={errors?.adminLogin?.message}
              >
                <label slot="label">
                  {t('common:web_hosting_common_admin_login')}*
                </label>
                <OdsInput
                  type={ODS_INPUT_TYPE.text}
                  name={name}
                  value={value as string}
                  data-testid="input-admin-login"
                  hasError={!!errors.adminLogin}
                  onOdsBlur={onBlur}
                  onOdsChange={onChange}
                  isClearable
                />
              </OdsFormField>
            )}
          />
          <Controller
            name="adminPassword"
            control={control}
            render={({ field: { name, value, onBlur, onChange } }) => (
              <OdsFormField
                className="w-full"
                error={errors?.adminPassword?.message}
              >
                <label slot="label">
                  {t('common:web_hosting_common_admin_password')}*
                </label>
                <OdsPassword
                  name={name}
                  value={value as string}
                  data-testid="input-admin-password"
                  hasError={!!errors.adminPassword}
                  onOdsBlur={onBlur}
                  onOdsChange={onChange}
                  className="w-full"
                  isClearable
                  isMasked
                />
              </OdsFormField>
            )}
          />
          <OdsFormField>
            <ManagerButton
              type="submit"
              label={t('common:web_hosting_common_action_continue')}
              isDisabled={!isDirty || !isValid || isSubmittingStep1}
              isLoading={isSubmittingStep1}
              color={ODS_BUTTON_COLOR.primary}
              id="import-step1"
              data-testid="import-step1"
            />
          </OdsFormField>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleSubmitStep2(onStep2Submit)}>
          <Subtitle>
            {t(
              'managedWordpress:web_hosting_managed_wordpress_import_select_element',
            )}
          </Subtitle>
          <OdsText preset={ODS_TEXT_PRESET.span}>
            {t(
              'managedWordpress:web_hosting_managed_wordpress_import_select_element_description',
            )}
          </OdsText>
          <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <ManagerTile color={ODS_CARD_COLOR.neutral}>
              <ManagerTile.Title>
                {t('common:web_hosting_common_plugins')}
              </ManagerTile.Title>
              <OdsText preset={ODS_TEXT_PRESET.span}>
                {t(
                  'managedWordpress:web_hosting_managed_wordpress_import_select_plugins_description',
                )}
              </OdsText>
              {data?.currentState.import.checkResult.cmsSpecific.wordPress.plugins.map(
                (plugin, index) => (
                  <div key={plugin.name}>
                    <input
                      type="hidden"
                      {...step2Form.register(`plugins.${index}.name`)}
                      value={plugin.name}
                    />
                    <input
                      type="hidden"
                      {...step2Form.register(`plugins.${index}.version`)}
                      value={plugin.version}
                    />
                    <Controller
                      name={`plugins.${index}.enabled`}
                      control={controlStep2}
                      render={({ field: { value, onBlur, onChange } }) => (
                        <div className="flex flex-row mt-4">
                          <OdsCheckbox
                            name={`plugins.${index}.enabled`}
                            id={plugin.name}
                            isChecked={value}
                            onOdsBlur={onBlur}
                            onOdsChange={(e) => onChange(e.detail.checked)}
                          />
                          <label
                            htmlFor={plugin.name}
                            className="ml-4 cursor-pointer"
                          >
                            <OdsText>{plugin.name}</OdsText>
                          </label>
                        </div>
                      )}
                    />
                  </div>
                ),
              )}
            </ManagerTile>
            <ManagerTile color={ODS_CARD_COLOR.neutral}>
              <ManagerTile.Title>
                {t('common:web_hosting_common_themes')}
              </ManagerTile.Title>
              <OdsText preset={ODS_TEXT_PRESET.span}>
                {t(
                  'managedWordpress:web_hosting_managed_wordpress_import_select_themes_description',
                )}
                *
              </OdsText>
              {data?.currentState.import.checkResult.cmsSpecific.wordPress.themes.map(
                (theme, index) => (
                  <div key={theme.name}>
                    <input
                      type="hidden"
                      {...step2Form.register(`themes.${index}.name`)}
                      value={theme.name}
                    />
                    <input
                      type="hidden"
                      {...step2Form.register(`themes.${index}.version`)}
                      value={theme.version}
                    />
                    <Controller
                      key={theme.name}
                      name={`themes.${index}.active`}
                      control={controlStep2}
                      render={({ field: { value, onBlur, onChange } }) => (
                        <div className="flex flex-row mt-4">
                          <OdsCheckbox
                            name={`themes.${index}.active`}
                            id={theme.name}
                            isChecked={value}
                            onOdsBlur={onBlur}
                            onOdsChange={(e) => onChange(e.detail.checked)}
                          />
                          <label
                            htmlFor={theme.name}
                            className="ml-4 cursor-pointer"
                          >
                            <OdsText>{theme.name}</OdsText>
                          </label>
                        </div>
                      )}
                    />
                  </div>
                ),
              )}
            </ManagerTile>
            <ManagerTile color={ODS_CARD_COLOR.neutral}>
              <ManagerTile.Title>
                {t('common:web_hosting_common_medias')}
              </ManagerTile.Title>
              <OdsText preset={ODS_TEXT_PRESET.span}>
                {t(
                  'managedWordpress:web_hosting_managed_wordpress_import_select_medias_description',
                )}
              </OdsText>
              <Controller
                name="media"
                control={controlStep2}
                render={({ field: { name, value, onBlur, onChange } }) => (
                  <div className="flex flex-row mt-4">
                    <OdsCheckbox
                      data-testid="import-media"
                      isChecked={value}
                      onOdsBlur={onBlur}
                      onOdsChange={(e) => onChange(e.detail.checked)}
                      name={name}
                    />
                    <label
                      htmlFor="import-media"
                      className="ml-4 cursor-pointer"
                    >
                      <OdsText>{t('common:web_hosting_common_media')}</OdsText>
                    </label>
                  </div>
                )}
              />
            </ManagerTile>
          </div>
          <ManagerTile color={ODS_CARD_COLOR.neutral} className="mt-6">
            <div className="m-4">
              <div className="flex flex-col items-start justify-between mb-4">
                <ManagerTile.Title>
                  {t('common:web_hosting_common_database')}
                </ManagerTile.Title>
                <OdsText preset={ODS_TEXT_PRESET.span}>
                  {t(
                    'managedWordpress:web_hosting_managed_wordpress_import_select_database_description',
                  )}
                </OdsText>
              </div>
              <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                <ManagerTile color={ODS_CARD_COLOR.neutral}>
                  <ManagerTile.Title>
                    <Controller
                      name="wholeDatabase"
                      control={controlStep2}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <OdsRadio
                          id="import-all-database"
                          name="databaseOption"
                          isChecked={value}
                          onOdsBlur={onBlur}
                          onOdsChange={(e) => onChange(e.detail.checked)}
                        />
                      )}
                    />
                    <label
                      htmlFor="import-all-database"
                      className="ml-4 cursor-pointer"
                    >
                      {t(
                        'managedWordpress:web_hosting_managed_wordpress_import_select_wholedatabase_select',
                      )}{' '}
                    </label>
                  </ManagerTile.Title>
                  <OdsText preset={ODS_TEXT_PRESET.span}>
                    {t(
                      'managedWordpress:web_hosting_managed_wordpress_import_select_wholedatabase_description',
                    )}
                  </OdsText>
                </ManagerTile>
                <ManagerTile color={ODS_CARD_COLOR.neutral}>
                  <ManagerTile.Title>
                    <Controller
                      name="wholeDatabase"
                      control={controlStep2}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <OdsRadio
                          id="import-database"
                          name="databaseOption"
                          isChecked={!value}
                          onOdsBlur={onBlur}
                          onOdsChange={onChange}
                        />
                      )}
                    />
                    <label
                      htmlFor="import-database"
                      className="ml-4 cursor-pointer"
                    >
                      {t(
                        'managedWordpress:web_hosting_managed_wordpress_import_select_database_category_select',
                      )}
                    </label>
                  </ManagerTile.Title>
                  <OdsText preset={ODS_TEXT_PRESET.span}>
                    {t(
                      'managedWordpress:web_hosting_managed_wordpress_import_select_database_category_description',
                    )}{' '}
                  </OdsText>
                </ManagerTile>
              </div>
            </div>
            <OdsText preset={ODS_TEXT_PRESET.span}>
              {t(
                'managedWordpress:web_hosting_managed_wordpress_import_select_database_category_description',
              )}
            </OdsText>
            <div className="flex flex-row mt-4">
              <Controller
                name="posts"
                control={controlStep2}
                render={({ field: { name, value, onBlur, onChange } }) => (
                  <div className="flex flex-row mt-4">
                    <OdsCheckbox
                      id="import-posts"
                      name={name}
                      isChecked={value}
                      isDisabled={wholeDatabase}
                      onOdsBlur={onBlur}
                      onOdsChange={onChange}
                    />
                    <label
                      htmlFor="import-posts"
                      className="ml-4 cursor-pointer"
                    >
                      <OdsText>{t('common:web_hosting_common_posts')}</OdsText>
                    </label>
                  </div>
                )}
              />
            </div>
            <div className="flex flex-row mt-4">
              <Controller
                name="pages"
                control={controlStep2}
                render={({ field: { name, value, onBlur, onChange } }) => (
                  <div className="flex flex-row mt-4">
                    <OdsCheckbox
                      id="import-pages"
                      name={name}
                      isChecked={value}
                      isDisabled={wholeDatabase}
                      onOdsBlur={onBlur}
                      onOdsChange={(e) => onChange(e.detail.checked)}
                    />
                    <label
                      htmlFor="import-pages"
                      className="ml-4 cursor-pointer"
                    >
                      <OdsText>{t('common:web_hosting_common_pages')}</OdsText>
                    </label>
                  </div>
                )}
              />
            </div>
            <div className="flex flex-row mt-4">
              <Controller
                name="comments"
                control={controlStep2}
                render={({ field: { name, value, onBlur, onChange } }) => (
                  <div className="flex flex-row mt-4">
                    <OdsCheckbox
                      id="import-comments"
                      name={name}
                      isChecked={value}
                      isDisabled={wholeDatabase}
                      onOdsBlur={onBlur}
                      onOdsChange={(e) => onChange(e.detail.checked)}
                    />
                    <label
                      htmlFor="import-comments"
                      className="ml-4 cursor-pointer"
                    >
                      <OdsText>
                        {t('common:web_hosting_common_comments')}
                      </OdsText>
                    </label>
                  </div>
                )}
              />
            </div>
            <div className="flex flex-row mt-4">
              <Controller
                name="tags"
                control={controlStep2}
                render={({ field: { name, value, onBlur, onChange } }) => (
                  <div className="flex flex-row mt-4">
                    <OdsCheckbox
                      id="import-tags"
                      name={name}
                      isChecked={value}
                      isDisabled={wholeDatabase}
                      onOdsBlur={onBlur}
                      onOdsChange={(e) => onChange(e.detail.checked)}
                    />
                    <label
                      htmlFor="import-tags"
                      className="ml-4 cursor-pointer"
                    >
                      <OdsText>{t('common:web_hosting_common_tags')}</OdsText>
                    </label>
                  </div>
                )}
              />
            </div>
            <div className="flex flex-row mt-4">
              <Controller
                name="users"
                control={controlStep2}
                render={({ field: { name, value, onBlur, onChange } }) => (
                  <div className="flex flex-row mt-4">
                    <OdsCheckbox
                      id="import-users"
                      name={name}
                      isChecked={value}
                      isDisabled={wholeDatabase}
                      onOdsBlur={onBlur}
                      onOdsChange={(e) => onChange(e.detail.checked)}
                    />
                    <label
                      htmlFor="import-users"
                      className="ml-4 cursor-pointer"
                    >
                      <OdsText>{t('common:web_hosting_common_users')}</OdsText>
                    </label>
                  </div>
                )}
              />
            </div>
          </ManagerTile>
          <OdsMessage
            color={ODS_MESSAGE_COLOR.warning}
            isDismissible={false}
            className="mt-4"
          >
            <div className="flex flex-col space-y-2">
              <span>
                {t(
                  'managedWordpress:web_hosting_managed_wordpress_import_warning_message_part_1',
                )}{' '}
              </span>
              <span>
                {t(
                  'managedWordpress:web_hosting_managed_wordpress_import_warning_message_part_2',
                )}
              </span>
            </div>
          </OdsMessage>
          <OdsFormField>
            <ManagerButton
              type="submit"
              label={t('common:web_hosting_common_action_launch_import')}
              isDisabled={!isValidStep2 || isSubmittingStep2}
              isLoading={isSubmittingStep2}
              color={ODS_BUTTON_COLOR.primary}
              id="import-step2"
            />
          </OdsFormField>
        </form>
      )}
    </>
  );
}
