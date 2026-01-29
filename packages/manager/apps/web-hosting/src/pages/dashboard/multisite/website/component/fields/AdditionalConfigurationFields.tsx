import { Control, Controller, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldError,
  FormFieldLabel,
  ICON_NAME,
  INPUT_TYPE,
  Icon,
  Input,
  Select,
  SelectContent,
  SelectControl,
  TEXT_PRESET,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { CmsType } from '@/data/types/product/managedWordpress/cms';
import { WebsiteFormData } from '@/utils/formSchemas.utils';

interface AdditionalConfigurationFieldsProps {
  control: Control<WebsiteFormData, unknown, WebsiteFormData>;
  controlValues: WebsiteFormData;
  domainOptions: Array<{ value: string; label: string }>;
  languageOptions: Array<{ value: string; label: string }>;
  isLoadingLanguages: boolean;
  errors: FieldErrors<WebsiteFormData>;
}

export const AdditionalConfigurationFields: React.FC<AdditionalConfigurationFieldsProps> = ({
  control,
  controlValues,
  domainOptions,
  languageOptions,
  isLoadingLanguages,
  errors,
}: AdditionalConfigurationFieldsProps) => {
  const { t } = useTranslation(['multisite', NAMESPACES.FORM]);

  return (
    <>
      <Text preset={TEXT_PRESET.heading4}>
        {t('multisite_add_website_module_cms_advanced_additional_title')}
      </Text>
      <Text>{t('multisite_add_website_module_cms_advanced_additional_helper')}</Text>
      <div className="grid grid-cols-1 gap-4">
        <Controller
          name="adminName"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <FormField className="w-full max-w-xl" invalid={!!error && invalid}>
              <FormFieldLabel>
                {t('multisite_add_website_module_cms_advanced_admin_label')}*
              </FormFieldLabel>
              <Input
                type={INPUT_TYPE.text}
                name={field.name}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value)}
                invalid={!!errors.adminName}
                data-testid="admin-name-input"
              />
              <FormFieldError>{errors?.adminName?.message}</FormFieldError>
            </FormField>
          )}
        />
        <Controller
          name="adminPassword"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <FormField className="w-full max-w-xl" invalid={!!error && invalid}>
              <div className="flex items-center gap-2">
                <FormFieldLabel>
                  {t('multisite_add_website_module_cms_advanced_admin_password')}*
                </FormFieldLabel>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icon name={ICON_NAME.circleInfo} className="cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm space-y-1">
                    <Text preset={TEXT_PRESET.caption}>
                      {t(`${NAMESPACES.FORM}:change_password_helper1`)}
                    </Text>
                    <ul className="list-disc space-y-1 pl-4">
                      <li>
                        <Text preset={TEXT_PRESET.caption}>
                          {t(`${NAMESPACES.FORM}:error_between_min_max_chars`, {
                            min: 8,
                            max: 31,
                          })}
                        </Text>
                      </li>
                      <li>
                        <Text preset={TEXT_PRESET.caption}>
                          {t(`${NAMESPACES.FORM}:change_password_helper2`)}
                        </Text>
                      </li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                type={INPUT_TYPE.password}
                name={field.name}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                invalid={!!errors.adminPassword}
                data-testid="admin-password-input"
              />
              <FormFieldError>{errors?.adminPassword?.message}</FormFieldError>
            </FormField>
          )}
        />
        <Controller
          name="moduleDomain"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <FormField className="w-full max-w-xl" invalid={!!error && invalid}>
              <FormFieldLabel>
                {t('multisite_add_website_module_cms_advanced_domain_label')}*
              </FormFieldLabel>
              <Select
                name={field.name}
                value={field.value ? [field.value] : []}
                items={domainOptions}
                invalid={!!errors.moduleDomain}
                onValueChange={(detail) => field.onChange(detail.value?.[0] ?? '')}
                data-testid="module-domain-select"
              >
                <SelectControl
                  placeholder={t('multisite_add_website_module_cms_advanced_domain_placeholder')}
                />
                <SelectContent />
              </Select>
              <FormFieldError>{errors?.moduleDomain?.message}</FormFieldError>
            </FormField>
          )}
        />
        <Controller
          name="moduleLanguage"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <FormField className="w-full max-w-xl" invalid={!!error && invalid}>
              <FormFieldLabel>
                {t('multisite_add_website_module_cms_advanced_language_label')}*
              </FormFieldLabel>
              <Select
                name={field.name}
                value={field.value ? [field.value] : []}
                items={languageOptions}
                invalid={!!errors.moduleLanguage}
                disabled={
                  isLoadingLanguages ||
                  !controlValues.module ||
                  controlValues.module === CmsType.NONE
                }
                onValueChange={(detail) => field.onChange(detail.value?.[0] ?? '')}
                data-testid="module-language-select"
              >
                <SelectControl
                  placeholder={t('multisite_add_website_module_cms_advanced_language_placeholder')}
                />
                <SelectContent />
              </Select>
              <FormFieldError>{errors?.moduleLanguage?.message}</FormFieldError>
            </FormField>
          )}
        />
        <Controller
          name="moduleInstallPath"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <FormField className="w-full max-w-xl" invalid={!!error && invalid}>
              <FormFieldLabel>
                {t('multisite_add_website_module_cms_advanced_path_label')}*
              </FormFieldLabel>
              <div className="flex w-full items-center">
                <div className="flex items-center rounded-l border border-r-0 border-gray-300 bg-gray-50 px-3">
                  <Text preset={TEXT_PRESET.span} className="text-sm text-gray-700">
                    ./www/
                  </Text>
                </div>
                <Input
                  className="flex-1 rounded-l-none"
                  type={INPUT_TYPE.text}
                  name={field.name}
                  value={(field.value ?? '').replace(/^\.\/www\//, '')}
                  invalid={!!errors.moduleInstallPath}
                  onChange={(e) => {
                    const rawValue = e.target.value ?? '';
                    const sanitized = rawValue.replace(/^\.\/www\//, '');
                    field.onChange(`./www/${sanitized}`);
                  }}
                  data-testid="module-install-path-input"
                />
              </div>
              <FormFieldError>{errors?.moduleInstallPath?.message}</FormFieldError>
            </FormField>
          )}
        />
      </div>
    </>
  );
};
