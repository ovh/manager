import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { ODS_INPUT_TYPE, ODS_MESSAGE_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsInput,
  OdsMessage,
  OdsSelect,
  OdsText,
  OdsToggle,
} from '@ovhcloud/ods-components/react';

import { useGetDomainZone } from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { AssociationType } from '@/data/types/product/website';
import { websiteFormSchema } from '@/utils/formSchemas.utils';
import { isValidDomain } from '@/utils/validator';

import { DomainAdvancedConfiguration } from './DomainAdvancedConfiguration';

type FormData = z.infer<typeof websiteFormSchema>;

interface DomainConfigurationProps {
  control: Control<FormData, unknown, FormData>;
  controlValues: FormData;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  isNextButtonVisible: boolean;
  isAddingDomain?: boolean;
}

export const DomainConfiguration: React.FC<DomainConfigurationProps> = ({
  control,
  controlValues,
  setStep,
  isNextButtonVisible,
  isAddingDomain = false,
}: DomainConfigurationProps) => {
  const { t } = useTranslation(['multisite', 'dashboard', 'common']);
  const { data } = useGetDomainZone();

  return (
    <div className="flex flex-col space-y-5">
      <OdsText preset={ODS_TEXT_PRESET.heading4}>
        {t('multisite:multisite_add_website_configure_domain_title')}
      </OdsText>
      {controlValues?.associationType === AssociationType.EXISTING ? (
        <>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col">
                <OdsText>{t('multisite_add_website_configure_domain_display_name')}</OdsText>
                <OdsInput
                  className="w-1/3"
                  type={ODS_INPUT_TYPE.text}
                  name="website-name"
                  isDisabled={isAddingDomain}
                  value={field.value}
                  onOdsChange={(e) => field.onChange(e.target.value)}
                />
                <OdsText preset={ODS_TEXT_PRESET.caption}>
                  {t('multisite_add_website_configure_domain_display_text')}
                </OdsText>
              </div>
            )}
          />
          <Controller
            name="fqdn"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col">
                <OdsText>{t('multisite_add_website_configure_domain_fqdn')}</OdsText>
                <OdsSelect
                  name="fqdn"
                  className="w-1/3"
                  value={field.value}
                  onOdsChange={(e) => field.onChange(e.target.value)}
                >
                  {data?.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </OdsSelect>
              </div>
            )}
          />

          <Controller
            name="advancedConfiguration"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-3">
                <OdsToggle
                  name="advanced-configuration"
                  id="advanced-configuration"
                  value={field.value}
                  onClick={(event) => {
                    event.preventDefault();
                    field.onChange(!field.value);
                  }}
                />
                <label htmlFor="rootAccount" slot="label">
                  <OdsText>{t('multisite_add_website_configure_domain_advanced')}</OdsText>
                </label>
              </div>
            )}
          />
          {controlValues?.advancedConfiguration ? (
            <DomainAdvancedConfiguration
              control={control}
              controlValues={controlValues}
              isAddingDomain={isAddingDomain}
            />
          ) : (
            <OdsMessage color={ODS_MESSAGE_COLOR.information} isDismissible={false}>
              {t('multisite_add_website_configure_domain_advanced_message')}
            </OdsMessage>
          )}
        </>
      ) : (
        <>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col">
                <OdsText>{t('multisite_add_website_configure_domain_display_name')}</OdsText>
                <OdsInput
                  className="w-1/3"
                  type={ODS_INPUT_TYPE.text}
                  name="website-name"
                  isDisabled={isAddingDomain}
                  value={field.value}
                  onOdsChange={(e) => field.onChange(e.target.value)}
                />
                <OdsText preset={ODS_TEXT_PRESET.caption}>
                  {t('multisite_add_website_configure_domain_display_text')}
                </OdsText>
              </div>
            )}
          />
          <Controller
            name="fqdn"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col">
                <OdsText>{t('multisite_add_website_configure_domain_fqdn')}</OdsText>
                <OdsInput
                  className="w-1/3"
                  type={ODS_INPUT_TYPE.text}
                  name="fqdn"
                  value={field.value}
                  onOdsChange={(e) => field.onChange(e.target.value)}
                />
              </div>
            )}
          />
        </>
      )}
      {isNextButtonVisible && (
        <OdsButton
          isDisabled={
            !controlValues.name ||
            !controlValues.fqdn ||
            (controlValues.associationType === AssociationType.EXTERNAL &&
              !isValidDomain(controlValues.fqdn)) ||
            (isAddingDomain && !isValidDomain(controlValues.fqdn))
          }
          label={t('common:web_hosting_common_action_continue')}
          onClick={() =>
            setStep(controlValues?.associationType === AssociationType.EXISTING ? 4 : 3)
          }
        ></OdsButton>
      )}
    </div>
  );
};
