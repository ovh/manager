import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_CARD_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsCard, OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { IntervalUnitType, OvhSubsidiary, Price, Subtitle } from '@ovh-ux/manager-react-components';

import { useOrderCatalogOkms } from '@/common/data/hooks/useOrderCatalogOkms';
import { useShellContext } from '@/common/hooks/useShellContext';

export const ProtectionLevelSection: React.FC = () => {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const { environment } = useShellContext();
  const { ovhSubsidiary } = environment.getUser();
  const userLocale = environment.getUserLocale();
  const { data: catalog, isLoading, isPending } = useOrderCatalogOkms();

  // Computed pricing data from catalog
  const plan = catalog?.plans.find((p) => p.planCode === 'okms');
  const addon = catalog?.addons.find((a) => a.planCode === 'okms-servicekey-monthly-consumption');

  const pricingData = {
    price: addon?.pricings[0]?.price || 0,
    tax: addon?.pricings[0]?.tax || 0,
    intervalUnit: plan?.pricings[0]?.intervalUnit || IntervalUnitType.none,
  };

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <Subtitle>{t('key_management_service_service-keys_create_protection_level_title')}</Subtitle>
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {t('key_management_service_service-keys_create_protection_level_subtitle')}
      </OdsText>
      <OdsCard color={ODS_CARD_COLOR.primary} className="flex h-fit w-full flex-col px-3 pt-3">
        <div className="flex flex-col justify-center gap-3 pb-4 text-center align-middle">
          <OdsText className="block" preset={ODS_TEXT_PRESET.heading5}>
            {t('key_management_service_service-keys_create_software_protection_title')}
          </OdsText>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('key_management_service_service-keys_create_software_protection_subtitle')}
          </OdsText>
          {!isLoading && !isPending ? (
            <Price
              value={pricingData.price}
              tax={pricingData.tax}
              ovhSubsidiary={OvhSubsidiary[ovhSubsidiary as keyof typeof OvhSubsidiary]}
              locale={userLocale}
              intervalUnit={pricingData.intervalUnit}
            />
          ) : (
            <OdsSkeleton />
          )}
        </div>
      </OdsCard>
    </div>
  );
};
