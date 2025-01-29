import React from 'react';
import {
  IntervalUnitType,
  OvhSubsidiary,
  Price,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import { ODS_CARD_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText, OdsCard } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { KEY_SOFTWARE_PROTECTION_PRICE } from './CreateKey.constants';

export const ProtectionLevelSection: React.FC = () => {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const { environment } = React.useContext(ShellContext);
  const { ovhSubsidiary } = environment.getUser();
  const userLocale = environment.getUserLocale();

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <Subtitle>
        {t('key_management_service_service-keys_create_protection_level_title')}
      </Subtitle>
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {t(
          'key_management_service_service-keys_create_protection_level_subtitle',
        )}
      </OdsText>
      <OdsCard
        color={ODS_CARD_COLOR.primary}
        className="flex flex-col w-full h-fit px-3 pt-3"
      >
        <div className="flex flex-col gap-6 pb-4 justify-center align-middle text-center">
          <OdsText className="block" preset={ODS_TEXT_PRESET.heading5}>
            {t(
              'key_management_service_service-keys_create_software_protection_title',
            )}
          </OdsText>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t(
              'key_management_service_service-keys_create_software_protection_subtitle',
            )}
          </OdsText>
          <Price
            value={KEY_SOFTWARE_PROTECTION_PRICE}
            ovhSubsidiary={
              OvhSubsidiary[ovhSubsidiary as keyof typeof OvhSubsidiary]
            }
            locale={userLocale}
            intervalUnit={IntervalUnitType.month}
          />
        </div>
      </OdsCard>
    </div>
  );
};
