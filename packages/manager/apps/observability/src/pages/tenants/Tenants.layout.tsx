import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import TenantsBaseLayout from '@/pages/tenants/TenantsBase.layout';

export default function TenantsLayout() {
  const { t } = useTranslation('tenants');
  return (
    <TenantsBaseLayout>
      <Text preset={TEXT_PRESET.paragraph}>{t('listing.description')}</Text>
      <Text preset={TEXT_PRESET.paragraph} className="mb-6">
        {t('listing.description_bis')}
      </Text>
    </TenantsBaseLayout>
  );
}
