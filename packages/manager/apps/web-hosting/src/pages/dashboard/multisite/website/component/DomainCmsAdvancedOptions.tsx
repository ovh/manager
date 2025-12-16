import { useEffect } from 'react';

import { useParams } from 'react-router-dom';

import { Control, Controller, UseFormSetValue } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  Divider,
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

import { useGetAttachedDomains } from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import {
  useGetHostingDatabase,
  useGetHostingDatabases,
} from '@/data/hooks/webHostingDatabase/useWebHostingDatabase';
import { useGetModuleLanguages } from '@/data/hooks/webHostingModule/useWebHostingModule';
import { CmsType } from '@/data/types/product/managedWordpress/cms';
import { ADVANCED_INSTALL_PASSWORD_REGEX } from '@/utils/form';
import { websiteFormSchema } from '@/utils/formSchemas.utils';
import { getLanguageName } from '@/utils/languageMapping';

type FormData = z.infer<typeof websiteFormSchema>;

interface DomainCmsAdvancedOptionsProps {
  control: Control<FormData, unknown, FormData>;
  controlValues: FormData;
  setValue: UseFormSetValue<FormData>;
}

export const DomainCmsAdvancedOptions: React.FC<DomainCmsAdvancedOptionsProps> = ({
  control,
  controlValues,
  setValue,
}: DomainCmsAdvancedOptionsProps) => {
  const { t } = useTranslation(['multisite']);
  const { serviceName } = useParams();
  const isAdvanced = Boolean(controlValues.advancedInstallation);

  const { data: databases } = useGetHostingDatabases(serviceName, 'mysql');
  const { data: attachedDomains } = useGetAttachedDomains(serviceName);
  const { data: moduleLanguages = [], isLoading: isLoadingLanguages } = useGetModuleLanguages(
    controlValues.module as CmsType,
  );

  const { data: databaseDetails } = useGetHostingDatabase(
    serviceName,
    controlValues.selectedDatabase,
  );

  const databaseOptions =
    databases?.map((name) => ({
      value: name,
      label: name,
    })) ?? [];

  const domainOptions =
    attachedDomains?.map((domain) => ({
      value: domain,
      label: domain,
    })) ?? [];

  const languageOptions =
    moduleLanguages?.map((langCode) => ({
      value: langCode,
      label: getLanguageName(langCode),
    })) ?? [];

  useEffect(() => {
    if (!databaseDetails) {
      return;
    }
    // Values from API are injected and made non-editable
    setValue('databaseServer', databaseDetails.name ?? '');
    setValue('databaseName', databaseDetails.user ?? '');
    setValue('databasePort', databaseDetails.port ? String(databaseDetails.port) : '');
    setValue('databaseUser', databaseDetails.user ?? '');
  }, [databaseDetails, setValue]);

  useEffect(() => {
    // Reset language when CMS changes
    if (!controlValues.module || controlValues.module === CmsType.NONE) {
      setValue('moduleLanguage', '');
    }
  }, [controlValues.module, setValue]);

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col gap-1">
        <Controller
          name="advancedInstallation"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="advanced-installation"
              name="advanced-installation"
              checked={Boolean(field.value)}
              onCheckedChange={() => field.onChange(!field.value)}
              className="flex items-center gap-2"
            >
              <CheckboxControl />
              <CheckboxLabel className="flex items-center gap-2">
                <Text preset={TEXT_PRESET.heading6}>
                  {t('multisite_add_website_module_cms_advanced_toggle')}
                </Text>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icon name={ICON_NAME.circleInfo} className="cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-md space-y-1">
                    <Text preset={TEXT_PRESET.caption}>
                      {t('multisite_add_website_module_cms_advanced_info_intro')}
                    </Text>
                    <ul className="list-disc space-y-1 pl-4">
                      <li>
                        <Text preset={TEXT_PRESET.caption}>
                          {t('multisite_add_website_module_cms_advanced_info_database')}
                        </Text>
                      </li>
                      <li>
                        <Text preset={TEXT_PRESET.caption}>
                          {t('multisite_add_website_module_cms_advanced_info_admin')}
                        </Text>
                      </li>
                      <li>
                        <Text preset={TEXT_PRESET.caption}>
                          {t('multisite_add_website_module_cms_advanced_info_language')}
                        </Text>
                      </li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </CheckboxLabel>
            </Checkbox>
          )}
        />
      </div>
      <Text preset={TEXT_PRESET.caption}>
        {t('multisite_add_website_module_cms_advanced_toggle_helper')}
      </Text>

      {controlValues.advancedInstallation && (
        <>
          <Divider />
          <Text preset={TEXT_PRESET.heading4}>
            {t('multisite_add_website_module_cms_advanced_database_title')}
          </Text>
          <Text>{t('multisite_add_website_module_cms_advanced_database_helper')}</Text>
          <Controller
            name="selectedDatabase"
            control={control}
            render={({ field }) => (
              <div className="flex w-full max-w-xl flex-col">
                <Text>{t('multisite_add_website_module_cms_advanced_database_label')}</Text>
                <Select
                  name={field.name}
                  value={field.value ? [field.value] : []}
                  items={databaseOptions}
                  onValueChange={(detail) => {
                    const next = detail.value?.[0] ?? '';
                    field.onChange(next);
                    setValue('selectedDatabase', next);
                    setValue('databaseServer', '');
                    setValue('databaseName', '');
                    setValue('databasePort', '');
                    setValue('databaseUser', '');
                  }}
                >
                  <SelectControl
                    placeholder={t(
                      'multisite_add_website_module_cms_advanced_database_placeholder',
                    )}
                  />
                  <SelectContent />
                </Select>
              </div>
            )}
          />
          <div className="grid grid-cols-1 gap-4">
            <Controller
              name="databaseServer"
              control={control}
              render={({ field }) => (
                <div className="flex w-full max-w-xl flex-col">
                  <Text>{t('multisite_add_website_module_cms_advanced_server_label')}</Text>
                  <Input
                    type={INPUT_TYPE.text}
                    name={field.name}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled
                  />
                </div>
              )}
            />
            <Controller
              name="databaseName"
              control={control}
              render={({ field }) => (
                <div className="flex w-full max-w-xl flex-col">
                  <Text>{t('multisite_add_website_module_cms_advanced_database_name_label')}</Text>
                  <Input
                    type={INPUT_TYPE.text}
                    name={field.name}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled
                  />
                </div>
              )}
            />
            <Controller
              name="databasePort"
              control={control}
              render={({ field }) => (
                <div className="flex w-full max-w-xl flex-col">
                  <Text>{t('multisite_add_website_module_cms_advanced_port_label')}</Text>
                  <Input
                    type={INPUT_TYPE.text}
                    name={field.name}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled
                  />
                </div>
              )}
            />
            <Controller
              name="databaseUser"
              control={control}
              render={({ field }) => (
                <div className="flex w-full max-w-xl flex-col">
                  <Text>{t('multisite_add_website_module_cms_advanced_user_label')}</Text>
                  <Input
                    type={INPUT_TYPE.text}
                    name={field.name}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled
                  />
                </div>
              )}
            />
            <Controller
              name="databasePassword"
              control={control}
              render={({ field }) => (
                <div className="flex w-full max-w-xl flex-col">
                  <div className="flex items-center gap-2">
                    <Text>{t('multisite_add_website_module_cms_advanced_password_label')}</Text>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Icon name={ICON_NAME.circleInfo} className="cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm space-y-1">
                        <Text preset={TEXT_PRESET.caption}>
                          {t('multisite_add_website_module_cms_advanced_password_rules_intro')}
                        </Text>
                        <ul className="list-disc space-y-1 pl-4">
                          <li>
                            <Text preset={TEXT_PRESET.caption}>
                              {t('multisite_add_website_module_cms_advanced_password_rule_length')}
                            </Text>
                          </li>
                          <li>
                            <Text preset={TEXT_PRESET.caption}>
                              {t('multisite_add_website_module_cms_advanced_password_rule_letters')}
                            </Text>
                          </li>
                          <li>
                            <Text preset={TEXT_PRESET.caption}>
                              {t('multisite_add_website_module_cms_advanced_password_rule_digits')}
                            </Text>
                          </li>
                          <li>
                            <Text preset={TEXT_PRESET.caption}>
                              {t('multisite_add_website_module_cms_advanced_password_rule_special')}
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
                    invalid={
                      isAdvanced &&
                      (!field.value || !ADVANCED_INSTALL_PASSWORD_REGEX.test(field.value))
                    }
                    className={
                      isAdvanced &&
                      (!field.value || !ADVANCED_INSTALL_PASSWORD_REGEX.test(field.value))
                        ? 'bg-red-50'
                        : undefined
                    }
                  />
                </div>
              )}
            />
          </div>

          <Divider />
          <Text preset={TEXT_PRESET.heading4}>
            {t('multisite_add_website_module_cms_advanced_additional_title')}
          </Text>
          <Text>{t('multisite_add_website_module_cms_advanced_additional_helper')}</Text>
          <div className="grid grid-cols-1 gap-4">
            <Controller
              name="adminName"
              control={control}
              render={({ field }) => (
                <div className="flex w-full max-w-xl flex-col">
                  <Text>{t('multisite_add_website_module_cms_advanced_admin_label')}</Text>
                  <Input
                    type={INPUT_TYPE.text}
                    name={field.name}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </div>
              )}
            />
            <Controller
              name="adminPassword"
              control={control}
              render={({ field }) => (
                <div className="flex w-full max-w-xl flex-col">
                  <div className="flex items-center gap-2">
                    <Text>{t('multisite_add_website_module_cms_advanced_admin_password')}</Text>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Icon name={ICON_NAME.circleInfo} className="cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm space-y-1">
                        <Text preset={TEXT_PRESET.caption}>
                          {t('multisite_add_website_module_cms_advanced_password_rules_intro')}
                        </Text>
                        <ul className="list-disc space-y-1 pl-4">
                          <li>
                            <Text preset={TEXT_PRESET.caption}>
                              {t('multisite_add_website_module_cms_advanced_password_rule_length')}
                            </Text>
                          </li>
                          <li>
                            <Text preset={TEXT_PRESET.caption}>
                              {t('multisite_add_website_module_cms_advanced_password_rule_letters')}
                            </Text>
                          </li>
                          <li>
                            <Text preset={TEXT_PRESET.caption}>
                              {t('multisite_add_website_module_cms_advanced_password_rule_digits')}
                            </Text>
                          </li>
                          <li>
                            <Text preset={TEXT_PRESET.caption}>
                              {t('multisite_add_website_module_cms_advanced_password_rule_special')}
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
                    invalid={
                      isAdvanced &&
                      (!field.value || !ADVANCED_INSTALL_PASSWORD_REGEX.test(field.value))
                    }
                    className={
                      isAdvanced &&
                      (!field.value || !ADVANCED_INSTALL_PASSWORD_REGEX.test(field.value))
                        ? 'bg-red-50'
                        : undefined
                    }
                  />
                </div>
              )}
            />
            <Controller
              name="moduleDomain"
              control={control}
              render={({ field }) => (
                <div className="flex w-full max-w-xl flex-col">
                  <Text>{t('multisite_add_website_module_cms_advanced_domain_label')}</Text>
                  <Select
                    name={field.name}
                    value={field.value ? [field.value] : []}
                    items={domainOptions}
                    onValueChange={(detail) => field.onChange(detail.value?.[0] ?? '')}
                  >
                    <SelectControl
                      placeholder={t(
                        'multisite_add_website_module_cms_advanced_domain_placeholder',
                      )}
                    />
                    <SelectContent />
                  </Select>
                </div>
              )}
            />
            <Controller
              name="moduleLanguage"
              control={control}
              render={({ field }) => (
                <div className="flex w-full max-w-xl flex-col">
                  <Text>{t('multisite_add_website_module_cms_advanced_language_label')}</Text>
                  <Select
                    name={field.name}
                    value={field.value ? [field.value] : []}
                    items={languageOptions}
                    disabled={
                      isLoadingLanguages ||
                      !controlValues.module ||
                      controlValues.module === CmsType.NONE
                    }
                    onValueChange={(detail) => field.onChange(detail.value?.[0] ?? '')}
                  >
                    <SelectControl
                      placeholder={t(
                        'multisite_add_website_module_cms_advanced_language_placeholder',
                      )}
                    />
                    <SelectContent />
                  </Select>
                </div>
              )}
            />
            <Controller
              name="moduleInstallPath"
              control={control}
              render={({ field }) => (
                <div className="flex w-full max-w-xl flex-col">
                  <Text>{t('multisite_add_website_module_cms_advanced_path_label')}</Text>
                  <div className="flex w-full items-center">
                    <div className="flex items-center rounded-l border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-700">
                      ./www/
                    </div>
                    <Input
                      className="flex-1 rounded-l-none"
                      type={INPUT_TYPE.text}
                      name={field.name}
                      value={(field.value ?? '').replace(/^\.\/www\//, '')}
                      onChange={(e) => {
                        const rawValue = e.target.value ?? '';
                        const sanitized = rawValue.replace(/^\.\/www\//, '');
                        field.onChange(`./www/${sanitized}`);
                      }}
                    />
                  </div>
                </div>
              )}
            />
          </div>
        </>
      )}
    </div>
  );
};
