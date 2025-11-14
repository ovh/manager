import { useParams } from 'react-router-dom';

import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import {
  ODS_BUTTON_VARIANT,
  ODS_CARD_COLOR,
  ODS_INPUT_TYPE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  OdsBadge,
  OdsButton,
  OdsCard,
  OdsCheckbox,
  OdsDivider,
  OdsInput,
  OdsRadio,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { useGetHostingService } from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { websiteFormSchema } from '@/utils/formSchemas.utils';

type FormData = z.infer<typeof websiteFormSchema>;

interface DomainAdvancedConfigurationProps {
  control: Control<FormData, unknown, FormData>;
  controlValues: FormData;
  isAddingDomain?: boolean;
}

export const DomainAdvancedConfiguration: React.FC<DomainAdvancedConfigurationProps> = ({
  control,
  controlValues,
  isAddingDomain = false,
}: DomainAdvancedConfigurationProps) => {
  const { serviceName } = useParams();

  const { t } = useTranslation(['multisite', 'dashboard', NAMESPACES.COUNTRIES]);
  const hostingService = useGetHostingService(serviceName);

  return (
    <>
      <Controller
        name="path"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col">
            <OdsText>{t('dashboard:hosting_multisite_domain_configuration_home')}</OdsText>
            <div className="flex items-center space-x-2 w-1/3">
              <OdsButton
                size="sm"
                variant={ODS_BUTTON_VARIANT.outline}
                label="./"
                isDisabled={true}
              />
              <OdsInput
                type={ODS_INPUT_TYPE.text}
                className="w-full"
                name="website-path"
                isDisabled={isAddingDomain}
                value={field.value}
                onOdsChange={(e) => field.onChange(e.target.value)}
              />
            </div>

            <OdsText preset={ODS_TEXT_PRESET.caption}>
              {t('multisite:multisite_add_website_configure_domain_advanced_path_message')}
            </OdsText>
          </div>
        )}
      />
      <OdsDivider />
      <OdsText preset={ODS_TEXT_PRESET.heading4}>
        {t('multisite:multisite_add_website_advanced_options_title')}
      </OdsText>
      <div className="flex flex-row space-x-4">
        <OdsCard
          className="w-1/3 p-4"
          color={controlValues.ip ? ODS_CARD_COLOR.primary : ODS_CARD_COLOR.neutral}
        >
          <div className="flex flex-row">
            <Controller
              name="ip"
              control={control}
              render={({ field }) => (
                <OdsCheckbox
                  name="country-ip"
                  isChecked={field.value}
                  onOdsChange={() => field.onChange(!field.value)}
                />
              )}
            />
            <label className="ml-2 cursor-pointer">
              <OdsText preset={ODS_TEXT_PRESET.heading6}>
                {t('dashboard:hosting_multisite_domain_configuration_countriesIp')}
              </OdsText>
            </label>
          </div>
          <OdsText preset={ODS_TEXT_PRESET.caption}>
            {t('multisite:multisite_add_website_advanced_options_ip')}
          </OdsText>
          <Controller
            name="selectedIp"
            control={control}
            render={({ field }) => (
              <OdsSelect
                name="ip"
                value={field.value}
                onOdsChange={(e) => field.onChange(e.target.value)}
              >
                {hostingService?.data?.countriesIp?.map((item) => (
                  <optgroup
                    key={item.country}
                    label={t(`${NAMESPACES.COUNTRIES}:country_${item.country}`)}
                  >
                    <option value={item.country}>{item.ip}</option>
                  </optgroup>
                ))}
              </OdsSelect>
            )}
          />
        </OdsCard>
        <OdsCard
          className="w-1/3 p-4"
          color={controlValues.firewall ? ODS_CARD_COLOR.primary : ODS_CARD_COLOR.neutral}
        >
          <div className="flex flew-row">
            <Controller
              name="firewall"
              control={control}
              render={({ field }) => (
                <OdsCheckbox
                  name="firewall"
                  isChecked={field.value}
                  onOdsChange={() => field.onChange(!field.value)}
                />
              )}
            />
            <label className="ml-2 cursor-pointer">
              <OdsText preset={ODS_TEXT_PRESET.heading6}>
                {t('dashboard:hosting_add_step3_firewall')}
              </OdsText>
            </label>
          </div>
          <OdsText preset={ODS_TEXT_PRESET.caption}>
            {t('multisite:multisite_add_website_advanced_options_firewall')}
          </OdsText>
        </OdsCard>

        <OdsCard
          className="w-1/3 p-4"
          color={controlValues.cdn ? ODS_CARD_COLOR.primary : ODS_CARD_COLOR.neutral}
        >
          <div className="flex flew-row">
            <Controller
              name="cdn"
              control={control}
              render={({ field }) => (
                <OdsCheckbox
                  name="cdn"
                  isChecked={field.value}
                  onOdsChange={() => field.onChange(!field.value)}
                />
              )}
            />
            <label className="ml-2 cursor-pointer">
              <OdsText preset={ODS_TEXT_PRESET.heading6}>
                {t('dashboard:hosting_multisite_domain_configuration_cdn')}
              </OdsText>
            </label>
          </div>
          <OdsText preset={ODS_TEXT_PRESET.caption}>
            {t('multisite:multisite_add_website_advanced_options_cdn')}
          </OdsText>
        </OdsCard>
      </div>
      <OdsDivider />
      <OdsText preset={ODS_TEXT_PRESET.heading4}>
        {t('multisite:multisite_add_website_advanced_options_dns_title')}
      </OdsText>
      <Controller
        name="autoConfigureDns"
        control={control}
        render={({ field }) => (
          <div className="flex flex-row space-x-4">
            <OdsCard
              className="w-1/2 p-4"
              color={
                controlValues.autoConfigureDns ? ODS_CARD_COLOR.primary : ODS_CARD_COLOR.neutral
              }
            >
              <div className="flex gap-4 items-center">
                <OdsRadio
                  name="auto-configuration"
                  isChecked={field.value}
                  onOdsChange={() => field.onChange(true)}
                />
                <label>
                  <OdsText preset={ODS_TEXT_PRESET.heading6} className="mr-5">
                    {t('multisite:multisite_add_website_advanced_options_dns_auto')}
                  </OdsText>
                  <OdsBadge
                    label={t(
                      'multisite:multisite_add_website_advanced_options_dns_auto_recommanded',
                    )}
                  />
                </label>
              </div>
              <OdsText preset={ODS_TEXT_PRESET.caption} className="ml-8 m-4">
                {t('multisite:multisite_add_website_advanced_options_dns_auto_text')}
              </OdsText>
            </OdsCard>
            <OdsCard
              className="w-1/2 p-4"
              color={
                !controlValues.autoConfigureDns ? ODS_CARD_COLOR.primary : ODS_CARD_COLOR.neutral
              }
            >
              <div className="flex gap-4 items-center">
                <OdsRadio
                  name="manual-configuration"
                  isChecked={!field.value}
                  onOdsChange={() => field.onChange(false)}
                />
                <label>
                  <OdsText preset={ODS_TEXT_PRESET.heading6}>
                    {t('multisite:multisite_add_website_advanced_options_dns_manual')}
                  </OdsText>
                </label>
              </div>
              <OdsText preset={ODS_TEXT_PRESET.caption} className="ml-8 m-4">
                {t('multisite:multisite_add_website_advanced_options_dns_manual_text')}
              </OdsText>
            </OdsCard>
          </div>
        )}
      />
    </>
  );
};
