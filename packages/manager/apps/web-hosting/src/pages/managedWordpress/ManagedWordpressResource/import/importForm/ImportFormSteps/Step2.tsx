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
  RadioControl,
  RadioGroup,
  RadioLabel,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { Tile } from '@ovh-ux/muk';

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
  const { control, watch, setValue, trigger } = step2Form;
  const wholeDatabase = watch('wholeDatabase');
  const themes = watch('themes');
  const hasActiveTheme = themes?.length > 0 ? themes.some((t) => t.active) : true;

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col">
        <h2 className="sr-only">
          {t('managedWordpress:web_hosting_managed_wordpress_import_select_element')}
        </h2>
        <Text preset={TEXT_PRESET.heading3} className="mb-4">
          {t('managedWordpress:web_hosting_managed_wordpress_import_select_element')}
        </Text>
        <Text preset={TEXT_PRESET.span}>
          {t('managedWordpress:web_hosting_managed_wordpress_import_select_element_description')}
        </Text>
      </div>

      <div className="mt-4 grid gap-4 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
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
              <div className="mt-2 flex flex-row">
                <Checkbox
                  checked={watch('plugins').every((p) => p.enabled)}
                  onCheckedChange={() => {
                    const allEnabled = watch('plugins').every((p) => p.enabled);
                    setValue(
                      'plugins',
                      watch('plugins').map((p) => ({
                        ...p,
                        enabled: !allEnabled,
                      })),
                      { shouldValidate: true },
                    );
                    void trigger('plugins');
                  }}
                  data-testid="all_plugins"
                >
                  <CheckboxControl />
                  <CheckboxLabel>
                    <Text>
                      {t(
                        'managedWordpress:web_hosting_managed_wordpress_import_select_plugins_all',
                      )}
                    </Text>
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
                        <div className="mt-4 flex flex-row">
                          <Checkbox
                            name={`plugins.${index}.enabled`}
                            id={plugin.name}
                            checked={value}
                            onBlur={onBlur}
                            onCheckedChange={(detail) => onChange(detail.checked)}
                          >
                            <CheckboxControl />
                            <CheckboxLabel>
                              <Text>{plugin.name}</Text>
                            </CheckboxLabel>
                          </Checkbox>
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
              <div className="mt-2 flex flex-row">
                <Checkbox
                  checked={watch('themes').every((p) => p.active)}
                  onCheckedChange={() => {
                    const allActive = watch('themes').every((p) => p.active);
                    setValue(
                      'themes',
                      watch('themes').map((p) => ({
                        ...p,
                        active: !allActive,
                      })),
                      { shouldValidate: true },
                    );
                    void trigger('themes');
                  }}
                >
                  <CheckboxControl />
                  <CheckboxLabel>
                    <Text preset={TEXT_PRESET.span}>
                      {t('managedWordpress:web_hosting_managed_wordpress_import_select_themes_all')}
                    </Text>
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
                        <div className="mt-4 flex flex-row">
                          <Checkbox
                            name={`themes.${index}.active`}
                            id={theme.name}
                            checked={value}
                            onBlur={onBlur}
                            onCheckedChange={(detail) => onChange(detail.checked)}
                          >
                            <CheckboxControl />
                            <CheckboxLabel>
                              <Text>{theme.name}</Text>
                            </CheckboxLabel>
                          </Checkbox>
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
                  <div className="mt-4 flex flex-row">
                    <Checkbox
                      data-testid="import-media"
                      checked={value}
                      onBlur={onBlur}
                      onCheckedChange={(detail) => onChange(detail.checked)}
                      name={name}
                    >
                      <CheckboxControl />
                      <CheckboxLabel>
                        <Text>{t('common:web_hosting_common_media_all')}</Text>
                      </CheckboxLabel>
                    </Checkbox>
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
            <div className="mb-4 flex flex-col items-start justify-between">
              <Text preset={TEXT_PRESET.span}>
                {t(
                  'managedWordpress:web_hosting_managed_wordpress_import_select_database_description',
                )}
              </Text>
            </div>
            <Controller
              name="wholeDatabase"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <RadioGroup
                  value={value ? 'true' : 'false'}
                  onValueChange={(detail) => {
                    onChange(detail.value === 'true');
                    onBlur();
                  }}
                >
                  <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
                    <Tile.Root
                      title={t(
                        'managedWordpress:web_hosting_managed_wordpress_import_select_wholedatabase_select',
                      )}
                      color={CARD_COLOR.neutral}
                    >
                      <Tile.Item.Root>
                        <Tile.Item.Description>
                          <Radio
                            id="import-all-database"
                            value="true"
                            className="w-full break-words"
                          >
                            <RadioControl />
                            <RadioLabel className="flex w-full min-w-0 flex-row flex-wrap items-start gap-3">
                              <div className="min-w-0 flex-1 break-words">
                                <Text preset={TEXT_PRESET.span}>
                                  {t(
                                    'managedWordpress:web_hosting_managed_wordpress_import_select_wholedatabase_description',
                                  )}
                                </Text>
                              </div>
                            </RadioLabel>
                          </Radio>
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
                          <Radio id="import-database" value="false" className="w-full break-words">
                            <RadioControl />
                            <RadioLabel className="flex w-full min-w-0 flex-row flex-wrap items-start gap-3">
                              <div className="min-w-0 flex-1 break-words">
                                <Text
                                  preset={TEXT_PRESET.span}
                                  className="block whitespace-normal break-words"
                                >
                                  {t(
                                    'managedWordpress:web_hosting_managed_wordpress_import_select_database_category_description',
                                  )}
                                </Text>
                              </div>
                            </RadioLabel>
                          </Radio>
                        </Tile.Item.Description>
                      </Tile.Item.Root>
                    </Tile.Root>
                  </div>
                </RadioGroup>
              )}
            />
            <Text preset={TEXT_PRESET.span}>
              {t(
                'managedWordpress:web_hosting_managed_wordpress_import_select_category_description',
              )}
            </Text>

            <div className="mt-4 flex flex-row">
              <Controller
                name="posts"
                control={control}
                render={({ field: { name, value, onBlur, onChange } }) => (
                  <div className="mt-4 flex flex-row">
                    <Checkbox
                      id="import-posts"
                      name={name}
                      checked={value}
                      disabled={wholeDatabase}
                      onBlur={onBlur}
                      onCheckedChange={(detail) => onChange(detail.checked)}
                    >
                      <CheckboxControl />
                      <CheckboxLabel>
                        <Text>{t('common:web_hosting_common_posts')}</Text>
                      </CheckboxLabel>
                    </Checkbox>
                  </div>
                )}
              />
            </div>
            <div className="mt-4 flex flex-row">
              <Controller
                name="pages"
                control={control}
                render={({ field: { name, value, onBlur, onChange } }) => (
                  <div className="mt-4 flex flex-row">
                    <Checkbox
                      id="import-pages"
                      name={name}
                      checked={value}
                      disabled={wholeDatabase}
                      onBlur={onBlur}
                      onCheckedChange={(detail) => onChange(detail.checked)}
                    >
                      <CheckboxControl />
                      <CheckboxLabel>
                        <Text>{t('common:web_hosting_common_pages')}</Text>
                      </CheckboxLabel>
                    </Checkbox>
                  </div>
                )}
              />
            </div>
            <div className="mt-4 flex flex-row">
              <Controller
                name="comments"
                control={control}
                render={({ field: { name, value, onBlur, onChange } }) => (
                  <div className="mt-4 flex flex-row">
                    <Checkbox
                      id="import-comments"
                      name={name}
                      checked={value}
                      disabled={wholeDatabase}
                      onBlur={onBlur}
                      onCheckedChange={(detail) => onChange(detail.checked)}
                    >
                      <CheckboxControl />
                      <CheckboxLabel>
                        <Text>{t('common:web_hosting_common_comments')}</Text>
                      </CheckboxLabel>
                    </Checkbox>
                  </div>
                )}
              />
            </div>
            <div className="mt-4 flex flex-row">
              <Controller
                name="tags"
                control={control}
                render={({ field: { name, value, onBlur, onChange } }) => (
                  <div className="mt-4 flex flex-row">
                    <Checkbox
                      id="import-tags"
                      name={name}
                      checked={value}
                      disabled={wholeDatabase}
                      onBlur={onBlur}
                      onCheckedChange={(detail) => onChange(detail.checked)}
                    >
                      <CheckboxControl />
                      <CheckboxLabel>
                        <Text>{t('common:web_hosting_common_tags')}</Text>
                      </CheckboxLabel>
                    </Checkbox>
                  </div>
                )}
              />
            </div>
            <div className="mt-4 flex flex-row">
              <Controller
                name="users"
                control={control}
                render={({ field: { name, value, onBlur, onChange } }) => (
                  <div className="mt-4 flex flex-row">
                    <Checkbox
                      id="import-users"
                      name={name}
                      checked={value}
                      disabled={wholeDatabase}
                      onBlur={onBlur}
                      onCheckedChange={(detail) => onChange(detail.checked)}
                    >
                      <CheckboxControl />
                      <CheckboxLabel>
                        <Text>{t('common:web_hosting_common_users')}</Text>
                      </CheckboxLabel>
                    </Checkbox>
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
          data-testid="import-step2"
        >
          {t('common:web_hosting_common_action_launch_import')}
        </Button>
      </FormField>
    </form>
  );
}
