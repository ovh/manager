import { TFunction } from 'i18next';
import { Controller, UseFormReturn } from 'react-hook-form';

import {
  BUTTON_COLOR,
  Button,
  CARD_COLOR,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  FormField,
  MESSAGE_COLOR,
  Message,
  Radio,
  RadioGroup,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { CheckboxProps, Tile } from '@ovh-ux/muk';

import { Step2FormValues } from './types';

type Step2Props = {
  t: TFunction;
  step2Form: UseFormReturn<Step2FormValues>;
  data: {
    currentState?: {
      import?: {
        checkResult?: {
          cmsSpecific?: {
            wordpress?: {
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
  const themes = watch('themes');
  const hasActiveTheme = themes?.length > 0 ? themes.some((t) => t.active) : true;

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col">
        <Text preset={TEXT_PRESET.heading3} className="mb-4">
          {t('managedWordpress:web_hosting_managed_wordpress_import_select_element')}
        </Text>
        <Text preset={TEXT_PRESET.span}>
          {t('managedWordpress:web_hosting_managed_wordpress_import_select_element_description')}
        </Text>
      </div>

      <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {/* === Plugins === */}
        <Tile.Root title={t('common:web_hosting_common_plugins')} color={CARD_COLOR.neutral}>
          <Tile.Item.Root>
            <Tile.Item.Description>
              <Text preset={TEXT_PRESET.span}>
                {t(
                  'managedWordpress:web_hosting_managed_wordpress_import_select_plugins_description',
                )}
              </Text>
            </Tile.Item.Description>
          </Tile.Item.Root>

          <Tile.Item.Root>
            <Tile.Item.Description>
              <div className="flex flex-row mt-2">
                <Checkbox
                  checked={watch('plugins').every((p) => p.enabled)}
                  onCheckedChange={(detail: CheckboxProps) =>
                    step2Form.setValue(
                      'plugins',
                      watch('plugins').map((p) => ({
                        ...p,
                        enabled: Boolean(detail.checked),
                      })),
                    )
                  }
                  data-testid="all_plugins"
                >
                  <CheckboxControl />
                  <CheckboxLabel>
                    {t('managedWordpress:web_hosting_managed_wordpress_import_select_plugins_all')}
                  </CheckboxLabel>
                </Checkbox>
              </div>

              <div className="ml-8">
                {(
                  data?.currentState?.import?.checkResult?.cmsSpecific?.wordpress?.plugins ?? []
                ).map((plugin: { name: string; version: string }, index: number) => (
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
                          <Checkbox
                            name={`plugins.${index}.enabled`}
                            id={plugin.name}
                            checked={value}
                            onBlur={onBlur}
                            onChange={onChange}
                          />
                          <label htmlFor={plugin.name} className="ml-4 cursor-pointer">
                            <Text>{plugin.name}</Text>
                          </label>
                        </div>
                      )}
                    />
                  </div>
                ))}
              </div>
            </Tile.Item.Description>
          </Tile.Item.Root>
        </Tile.Root>

        {/* === Themes === */}
        <Tile.Root title={t('common:web_hosting_common_themes')} color={CARD_COLOR.neutral}>
          <Tile.Item.Root>
            <Tile.Item.Description>
              <Text preset={TEXT_PRESET.span}>
                {t(
                  'managedWordpress:web_hosting_managed_wordpress_import_select_themes_description',
                )}
              </Text>
            </Tile.Item.Description>
          </Tile.Item.Root>

          <Tile.Item.Root>
            <Tile.Item.Description>
              <div className="flex flex-row mt-2">
                <Checkbox
                  checked={watch('themes').every((p) => p.active)}
                  onCheckedChange={(detail: CheckboxProps) =>
                    step2Form.setValue(
                      'themes',
                      watch('themes').map((p) => ({
                        ...p,
                        active: Boolean(detail.checked),
                      })),
                    )
                  }
                >
                  <CheckboxControl />
                  <CheckboxLabel>
                    {t('managedWordpress:web_hosting_managed_wordpress_import_select_themes_all')}
                  </CheckboxLabel>
                </Checkbox>
              </div>

              <div className="ml-8">
                {(Array.isArray(
                  data?.currentState?.import?.checkResult?.cmsSpecific?.wordpress?.themes,
                )
                  ? (data.currentState.import.checkResult.cmsSpecific.wordpress.themes as {
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
                          <Checkbox
                            name={`themes.${index}.active`}
                            id={theme.name}
                            checked={value}
                            onBlur={onBlur}
                            onChange={onChange}
                          />
                          <label htmlFor={theme.name} className="ml-4 cursor-pointer">
                            <Text>{theme.name}</Text>
                          </label>
                        </div>
                      )}
                    />
                  </div>
                ))}
              </div>
            </Tile.Item.Description>
          </Tile.Item.Root>
        </Tile.Root>

        {/* === Médias === */}
        <Tile.Root title={t('common:web_hosting_common_medias')} color={CARD_COLOR.neutral}>
          <Tile.Item.Root>
            <Tile.Item.Description>
              <Text preset={TEXT_PRESET.span}>
                {t(
                  'managedWordpress:web_hosting_managed_wordpress_import_select_medias_description',
                )}
              </Text>
              <Controller
                name="media"
                control={control}
                render={({ field: { name, value, onBlur, onChange } }) => (
                  <div className="flex flex-row mt-4">
                    <Checkbox
                      data-testid="import-media"
                      checked={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      name={name}
                    />
                    <label htmlFor="import-media" className="ml-4 cursor-pointer">
                      <Text>{t('common:web_hosting_common_media_all')}</Text>
                    </label>
                  </div>
                )}
              />
            </Tile.Item.Description>
          </Tile.Item.Root>
        </Tile.Root>
      </div>

      {/* === Base de données === */}
      <Tile.Root
        title={t('common:web_hosting_common_database')}
        color={CARD_COLOR.neutral}
        className="mt-6"
      >
        <Tile.Item.Root>
          <Tile.Item.Description>
            <div className="flex flex-col items-start justify-between mb-4">
              <Text preset={TEXT_PRESET.span}>
                {t(
                  'managedWordpress:web_hosting_managed_wordpress_import_select_database_description',
                )}
              </Text>
            </div>

            <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
              <Tile.Root
                title={t(
                  'managedWordpress:web_hosting_managed_wordpress_import_select_wholedatabase_select',
                )}
                color={CARD_COLOR.neutral}
              >
                <Tile.Item.Root>
                  <Tile.Item.Description>
                    <Controller
                      name="wholeDatabase"
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <RadioGroup>
                          <Radio
                            id="import-all-database"
                            aria-checked={value}
                            onBlur={onBlur}
                            onChange={() => onChange(true)}
                            value="true"
                          />
                        </RadioGroup>
                      )}
                    />
                    <Text preset={TEXT_PRESET.span}>
                      {t(
                        'managedWordpress:web_hosting_managed_wordpress_import_select_wholedatabase_description',
                      )}
                    </Text>
                  </Tile.Item.Description>
                </Tile.Item.Root>
              </Tile.Root>

              <Tile.Root
                title={t(
                  'managedWordpress:web_hosting_managed_wordpress_import_select_database_category_select',
                )}
                color={CARD_COLOR.neutral}
              >
                <Tile.Item.Root>
                  <Tile.Item.Description>
                    <Controller
                      name="wholeDatabase"
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <RadioGroup>
                          <Radio
                            id="import-database"
                            value=""
                            aria-checked={!value}
                            onBlur={onBlur}
                            onChange={onChange}
                          />
                        </RadioGroup>
                      )}
                    />
                    <Text preset={TEXT_PRESET.span}>
                      {t(
                        'managedWordpress:web_hosting_managed_wordpress_import_select_database_category_description',
                      )}
                    </Text>
                  </Tile.Item.Description>
                </Tile.Item.Root>
              </Tile.Root>
            </div>

            <Text preset={TEXT_PRESET.span}>
              {t(
                'managedWordpress:web_hosting_managed_wordpress_import_select_category_description',
              )}
            </Text>

            <div className="flex flex-row mt-4">
              <Controller
                name="posts"
                control={control}
                render={({ field: { name, value, onBlur, onChange } }) => (
                  <div className="flex flex-row mt-4">
                    <Checkbox
                      id="import-posts"
                      name={name}
                      checked={value}
                      disabled={wholeDatabase}
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                    <label htmlFor="import-posts" className="ml-4 cursor-pointer">
                      <Text>{t('common:web_hosting_common_posts')}</Text>
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
                    <Checkbox
                      id="import-pages"
                      name={name}
                      checked={value}
                      disabled={wholeDatabase}
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                    <label htmlFor="import-pages" className="ml-4 cursor-pointer">
                      <Text>{t('common:web_hosting_common_pages')}</Text>
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
                    <Checkbox
                      id="import-comments"
                      name={name}
                      checked={value}
                      disabled={wholeDatabase}
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                    <label htmlFor="import-comments" className="ml-4 cursor-pointer">
                      <Text>{t('common:web_hosting_common_comments')}</Text>
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
                    <Checkbox
                      id="import-tags"
                      name={name}
                      checked={value}
                      disabled={wholeDatabase}
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                    <label htmlFor="import-tags" className="ml-4 cursor-pointer">
                      <Text>{t('common:web_hosting_common_tags')}</Text>
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
                    <Checkbox
                      id="import-users"
                      name={name}
                      checked={value}
                      disabled={wholeDatabase}
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                    <label htmlFor="import-users" className="ml-4 cursor-pointer">
                      <Text>{t('common:web_hosting_common_users')}</Text>
                    </label>
                  </div>
                )}
              />
            </div>
          </Tile.Item.Description>
        </Tile.Item.Root>
      </Tile.Root>

      <Message color={MESSAGE_COLOR.warning} dismissible={false} className="mt-4">
        <div className="flex flex-col space-y-2">
          <span>
            {t('managedWordpress:web_hosting_managed_wordpress_import_warning_message_part_1')}
          </span>
          <span>
            {t('managedWordpress:web_hosting_managed_wordpress_import_warning_message_part_2')}
          </span>
        </div>
      </Message>

      <FormField>
        <Button
          type="submit"
          disabled={!isValid || isSubmitting || (themes?.length > 0 && !hasActiveTheme)}
          loading={isSubmitting}
          color={BUTTON_COLOR.primary}
          id="import-step2"
        >
          {t('common:web_hosting_common_action_launch_import')}
        </Button>
      </FormField>
    </form>
  );
}
