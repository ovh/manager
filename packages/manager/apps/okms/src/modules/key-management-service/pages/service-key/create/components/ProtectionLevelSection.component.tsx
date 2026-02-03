import React from 'react';

import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { PriceTile } from '@/common/components/price-tile/PriceTile';

export const ProtectionLevelSection: React.FC = () => {
  const { t } = useTranslation('key-management-service/serviceKeys');

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <Text preset="heading-3">
        {t('key_management_service_service-keys_create_protection_level_title')}
      </Text>
      <Text preset="paragraph">
        {t('key_management_service_service-keys_create_protection_level_subtitle')}
      </Text>
      <PriceTile
        title={t('key_management_service_service-keys_create_software_protection_title')}
        subtitle={t('key_management_service_service-keys_create_software_protection_subtitle')}
        productCode="servicekey"
      />
    </div>
  );
};
