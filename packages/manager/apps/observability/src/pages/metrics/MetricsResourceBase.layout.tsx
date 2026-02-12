import { ReactNode } from 'react';

import { Outlet } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovh-ux/muk';

import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import MetricsBaseLayout from '@/pages/metrics/MetricsBase.layout';

export type MetricsResourceBaseLayoutProps = {
  title: ReactNode;
};

export default function MetricsResourceBaseLayout({ title }: MetricsResourceBaseLayoutProps) {
  const { t } = useTranslation(['shared']);
  const { selectedService } = useObservabilityServiceContext();

  return (
    <MetricsBaseLayout title={title}>
      <Text preset={TEXT_PRESET.paragraph} className="mb-6">
        <Trans
          t={t}
          i18nKey="shared:service"
          values={{
            serviceName: selectedService?.currentState?.displayName || selectedService?.id,
          }}
        />
      </Text>
      <Outlet />
    </MetricsBaseLayout>
  );
}
