import { TFunction } from 'i18next';
import { Controller, UseFormReturn } from 'react-hook-form';

import {
  ODS_BUTTON_COLOR,
  ODS_CARD_COLOR,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  OdsCheckbox,
  OdsFormField,
  OdsMessage,
  OdsRadio,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { ManagerButton, ManagerTile } from '@ovh-ux/manager-react-components';

import { Step2FormValues } from './types';

type Step2Props = {
  t: TFunction;
  step2Form: UseFormReturn<Step2FormValues>;
  data: {
    currentState?: {
      import?: {
        checkResult?: {
          cmsSpecific?: {
            wordPress?: {
              plugins: Array<{
                name: string;
                [key: string]: unknown;
              }>;
              themes: Array<{
                name: string;
                [key: string]: unknown;
              }>;
            };
          };
        };
      };
    };
    [key: string]: unknown;
  };
  isValid: boolean;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function Step2({ t, step2Form, data, isValid, isSubmitting, onSubmit }: Step2Props) {
  const { control, watch } = step2Form;
  const wholeDatabase = watch('wholeDatabase');

  return (
    <form onSubmit={onSubmit}>
      <OdsText preset={ODS_TEXT_PRESET.heading3} className="mb-4">
        {t('managedWordpress:web_hosting_managed_wordpress_import_select_element')}
      </OdsText>
      <OdsText preset={ODS_TEXT_PRESET.span}>
        {t('managedWordpress:web_hosting_managed_wordpress_import_select_element_description')}
      </OdsText>
      <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <ManagerTile color={ODS_CARD_COLOR.neutral}>
          <ManagerTile.Title>{t('common:web_hosting_common_plugins')}</ManagerTile.Title>
          <OdsText preset={ODS_TEXT_PRESET.span}>
            {t('managedWordpress:web_hosting_managed_wordpress_import_select_plugins_description')}
          </OdsText>
          <div className="flex flex-row mt-2">
            <OdsCheckbox
              isChecked={watch('plugins').every((p) => p.enabled)}
              onOdsChange={(e) =>
                step2Form.setValue(
                  'plugins',
                  watch('plugins').map((p) => ({
                    ...p,
                    enabled: e.detail.checked,
                  })),
                )
              }
              name="all_plugins"
            />
            <label className="ml-4 cursor-pointer">
              <OdsText>
                {t('managedWordpress:web_hosting_managed_wordpress_import_select_plugins_all')}
              </OdsText>
            </label>
          </div>
          <div className="ml-8">
            {(data?.currentState?.import?.checkResult?.cmsSpecific?.wordPress?.plugins ?? []).map(
              (plugin: { name: string; version: string }, index: number) => (
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
                    control={control}
                    render={({ field: { value, onBlur, onChange } }) => (
                      <div className="flex flex-row mt-4">
                        <OdsCheckbox
                          name={`plugins.${index}.enabled`}
                          id={plugin.name}
                          isChecked={value}
                          onOdsBlur={onBlur}
                          onOdsChange={(e) => onChange(e.detail.checked)}
                        />
                        <label htmlFor={plugin.name} className="ml-4 cursor-pointer">
                          <OdsText>{plugin.name}</OdsText>
                        </label>
                      </div>
                    )}
                  />
                </div>
              ),
            )}
          </div>
        </ManagerTile>
        <ManagerTile color={ODS_CARD_COLOR.neutral}>
          <ManagerTile.Title>{t('common:web_hosting_common_themes')}</ManagerTile.Title>
          <OdsText preset={ODS_TEXT_PRESET.span}>
            {t('managedWordpress:web_hosting_managed_wordpress_import_select_themes_description')}*
          </OdsText>
          <div className="flex flex-row mt-2">
            <OdsCheckbox
              isChecked={watch('themes').every((p) => p.active)}
              onOdsChange={(e) =>
                step2Form.setValue(
                  'themes',
                  watch('themes').map((p) => ({
                    ...p,
                    active: e.detail.checked,
                  })),
                )
              }
              name="all_themes"
            />
            <label className="ml-4 cursor-pointer">
              <OdsText>
                {t('managedWordpress:web_hosting_managed_wordpress_import_select_themes_all')}
              </OdsText>
            </label>
          </div>
          <div className="ml-8">
            {(Array.isArray(data?.currentState?.import?.checkResult?.cmsSpecific?.wordPress?.themes)
              ? (data.currentState.import.checkResult.cmsSpecific.wordPress.themes as {
                  name: string;
                  version: string;
                }[])
              : []
            ).map((theme, index) => (
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
                  control={control}
                  render={({ field: { value, onBlur, onChange } }) => (
                    <div className="flex flex-row mt-4">
                      <OdsCheckbox
                        name={`themes.${index}.active`}
                        id={theme.name}
                        isChecked={value}
                        onOdsBlur={onBlur}
                        onOdsChange={(e) => onChange(e.detail.checked)}
                      />
                      <label htmlFor={theme.name} className="ml-4 cursor-pointer">
                        <OdsText>{theme.name}</OdsText>
                      </label>
                    </div>
                  )}
                />
              </div>
            ))}
          </div>
        </ManagerTile>
        <ManagerTile color={ODS_CARD_COLOR.neutral}>
          <ManagerTile.Title>{t('common:web_hosting_common_medias')}</ManagerTile.Title>
          <OdsText preset={ODS_TEXT_PRESET.span}>
            {t('managedWordpress:web_hosting_managed_wordpress_import_select_medias_description')}
          </OdsText>
          <Controller
            name="media"
            control={control}
            render={({ field: { name, value, onBlur, onChange } }) => (
              <div className="flex flex-row mt-4">
                <OdsCheckbox
                  data-testid="import-media"
                  isChecked={value}
                  onOdsBlur={onBlur}
                  onOdsChange={(e) => onChange(e.detail.checked)}
                  name={name}
                />
                <label htmlFor="import-media" className="ml-4 cursor-pointer">
                  <OdsText>{t('common:web_hosting_common_media_all')}</OdsText>
                </label>
              </div>
            )}
          />
        </ManagerTile>
      </div>
      <ManagerTile color={ODS_CARD_COLOR.neutral} className="mt-6">
        <div className="m-4">
          <div className="flex flex-col items-start justify-between mb-4">
            <ManagerTile.Title>{t('common:web_hosting_common_database')}</ManagerTile.Title>
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
                  control={control}
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
                <label htmlFor="import-all-database" className="ml-4 cursor-pointer">
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
                  control={control}
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
                <label htmlFor="import-database" className="ml-4 cursor-pointer">
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
          {t('managedWordpress:web_hosting_managed_wordpress_import_select_category_description')}
        </OdsText>
        <div className="flex flex-row mt-4">
          <Controller
            name="posts"
            control={control}
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
                <label htmlFor="import-posts" className="ml-4 cursor-pointer">
                  <OdsText>{t('common:web_hosting_common_posts')}</OdsText>
                </label>
              </div>
            )}
          />
        </div>
        <div className="flex flex-row mt-4">
          <Controller
            name="pages"
            control={control}
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
                <label htmlFor="import-pages" className="ml-4 cursor-pointer">
                  <OdsText>{t('common:web_hosting_common_pages')}</OdsText>
                </label>
              </div>
            )}
          />
        </div>
        <div className="flex flex-row mt-4">
          <Controller
            name="comments"
            control={control}
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
                <label htmlFor="import-comments" className="ml-4 cursor-pointer">
                  <OdsText>{t('common:web_hosting_common_comments')}</OdsText>
                </label>
              </div>
            )}
          />
        </div>
        <div className="flex flex-row mt-4">
          <Controller
            name="tags"
            control={control}
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
                <label htmlFor="import-tags" className="ml-4 cursor-pointer">
                  <OdsText>{t('common:web_hosting_common_tags')}</OdsText>
                </label>
              </div>
            )}
          />
        </div>
        <div className="flex flex-row mt-4">
          <Controller
            name="users"
            control={control}
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
                <label htmlFor="import-users" className="ml-4 cursor-pointer">
                  <OdsText>{t('common:web_hosting_common_users')}</OdsText>
                </label>
              </div>
            )}
          />
        </div>
      </ManagerTile>
      <OdsMessage color={ODS_MESSAGE_COLOR.warning} isDismissible={false} className="mt-4">
        <div className="flex flex-col space-y-2">
          <span>
            {t('managedWordpress:web_hosting_managed_wordpress_import_warning_message_part_1')}{' '}
          </span>
          <span>
            {t('managedWordpress:web_hosting_managed_wordpress_import_warning_message_part_2')}
          </span>
        </div>
      </OdsMessage>
      <OdsFormField>
        <ManagerButton
          type="submit"
          label={t('common:web_hosting_common_action_launch_import')}
          isDisabled={!isValid || isSubmitting}
          isLoading={isSubmitting}
          color={ODS_BUTTON_COLOR.primary}
          id="import-step2"
        />
      </OdsFormField>
    </form>
  );
}
