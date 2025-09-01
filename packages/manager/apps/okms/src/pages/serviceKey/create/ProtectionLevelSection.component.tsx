import React, { useEffect, useState } from 'react';
import {
  IntervalUnitType,
  OvhSubsidiary,
  Price,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import { ODS_CARD_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText, OdsCard, OdsSkeleton } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useOrderCatalogOkms } from '@/data/hooks/useOrderCatalogOkms';

export const ProtectionLevelSection: React.FC = () => {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const { environment } = React.useContext(ShellContext);
  const { ovhSubsidiary } = environment.getUser();
  const userLocale = environment.getUserLocale();
  const { data: catalog, isLoading, isPending } = useOrderCatalogOkms(
    ovhSubsidiary,
  );
  const [pricingData, setPricingData] = useState({
    price: 0,
    tax: 0,
    intervalUnit: IntervalUnitType.none,
  });

  const getServiceKeyPriceData = () => {
    const plan = catalog?.plans.find((p) => p.planCode === 'okms');
    const addon = catalog?.addons.find(
      (a) => a.planCode === 'okms-servicekey-monthly-consumption',
    );

    setPricingData({
      price: addon?.pricings[0]?.price || 0,
      tax: addon?.pricings[0]?.tax || 0,
      intervalUnit: plan?.pricings[0]?.intervalUnit || IntervalUnitType.none,
    });
  };

  useEffect(() => {
    getServiceKeyPriceData();
  }, [catalog]);

  return (
    <div className="flex flex-col gap-3 md:gap-4">
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
        <div className="flex flex-col gap-3 pb-4 justify-center align-middle text-center">
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
          {!isLoading && !isPending ? (
            <Price
              value={pricingData.price}
              tax={pricingData.tax}
              ovhSubsidiary={
                OvhSubsidiary[ovhSubsidiary as keyof typeof OvhSubsidiary]
              }
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
