/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect } from 'react';

import { useParams } from 'react-router-dom';

import { Control, Controller, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  Divider,
  ICON_NAME,
  Icon,
  TEXT_PRESET,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { useGetAttachedDomains } from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { useGetHostingDatabases } from '@/data/hooks/webHostingDatabase/useWebHostingDatabase';
import { useGetModuleLanguages } from '@/data/hooks/webHostingModule/useWebHostingModule';
import { CmsType } from '@/data/types/product/managedWordpress/cms';
import { WebsiteFormData } from '@/utils/formSchemas.utils';
import { getLanguageName } from '@/utils/languageMapping';

import { AdditionalConfigurationFields } from './fields/AdditionalConfigurationFields';
import { DatabaseConfigurationFields } from './fields/DatabaseConfigurationFields';

interface DomainCmsAdvancedOptionsProps {
  control: Control<WebsiteFormData, unknown, WebsiteFormData>;
  controlValues: WebsiteFormData;
  setValue: UseFormSetValue<WebsiteFormData>;
  errors: FieldErrors<WebsiteFormData>;
}

export const DomainCmsAdvancedOptions: React.FC<DomainCmsAdvancedOptionsProps> = ({
  control,
  controlValues,
  setValue,
  errors,
}: DomainCmsAdvancedOptionsProps) => {
  const { t } = useTranslation(['multisite', NAMESPACES.FORM]);
  const { serviceName } = useParams();

  const { data: databases } = useGetHostingDatabases(serviceName, 'mysql');
  const { data: attachedDomains } = useGetAttachedDomains(serviceName);
  const { data: moduleLanguages = [], isLoading: isLoadingLanguages } = useGetModuleLanguages(
    controlValues.module as CmsType,
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
          <Text preset={TEXT_PRESET.span}>{t(`${NAMESPACES.FORM}:mandatory_fields`)}</Text>
          <DatabaseConfigurationFields
            control={control}
            controlValues={controlValues}
            setValue={setValue}
            serviceName={serviceName}
            databaseOptions={databaseOptions}
            errors={errors}
          />
          <Divider />
          <AdditionalConfigurationFields
            control={control}
            controlValues={controlValues}
            domainOptions={domainOptions}
            languageOptions={languageOptions}
            isLoadingLanguages={isLoadingLanguages}
            errors={errors}
          />
        </>
      )}
    </div>
  );
};
