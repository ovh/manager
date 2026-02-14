import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import ManagedDashboardsBaseLayout from '@/pages/settings/managed-dashboards/ManagedDashboardsBase.layout';

export default function ManagedDashboardsLayout() {
  const { t } = useTranslation('managed-dashboards');
  return (
    <ManagedDashboardsBaseLayout>
      <Text preset={TEXT_PRESET.paragraph}>{t('managed-dashboards:description')}</Text>
      <Text preset={TEXT_PRESET.paragraph} className="mb-6">
        {t('managed-dashboards:description_bis')}
      </Text>
    </ManagedDashboardsBaseLayout>
  );
}
