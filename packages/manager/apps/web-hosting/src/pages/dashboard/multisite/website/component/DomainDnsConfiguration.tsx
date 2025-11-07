import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { ODS_CARD_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsButton, OdsCard, OdsDivider, OdsRadio, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { websiteFormSchema } from '@/utils/formSchemas.utils';

type FormData = z.infer<typeof websiteFormSchema>;

interface DomainDnsConfigurationProps {
  control: Control<FormData, unknown, FormData>;
  controlValues: FormData;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  isNextButtonVisible: boolean;
}

export const DomainDnsConfiguration: React.FC<DomainDnsConfigurationProps> = ({
  control,
  controlValues,
  setStep,
  isNextButtonVisible,
}: DomainDnsConfigurationProps) => {
  const { t } = useTranslation(['multisite', 'dashboard', NAMESPACES.COUNTRIES]);

  return (
    <>
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
                  <OdsText preset={ODS_TEXT_PRESET.heading6}>
                    {t('multisite:multisite_add_website_advanced_options_dns_auto')}
                  </OdsText>
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
      {isNextButtonVisible && (
        <OdsButton
          label={t('common:web_hosting_common_action_continue')}
          onClick={() => setStep(4)}
        ></OdsButton>
      )}
    </>
  );
};
