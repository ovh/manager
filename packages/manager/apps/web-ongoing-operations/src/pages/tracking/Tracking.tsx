import { BaseLayout } from '@ovh-ux/manager-react-components';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { TrackingEnum } from '@/enum/tracking.enum';
import Loading from '@/components/Loading/Loading';
import SubHeader from '@/components/SubHeader/SubHeader';
import TrackingMessage from '@/components/Tracking/TrackingMessage';
import TrackingFinalized from '@/components/Tracking/TrackingFinalized';
import TrackingCard from '@/components/Tracking/TrackingCard';
import { useDomain, useTracking } from '@/hooks/data/query';

export default function TrackingTranfert() {
  const { t } = useTranslation('dashboard');
  const { id } = useParams<{ id: string }>();
  const paramId = useMemo(() => Number(id), [id]);

  const { data: tracking, isLoading: trackingLoading } = useTracking(paramId);
  const { data: domain, isLoading: domainLoading } = useDomain(paramId);

  const transfertFinalised = useMemo(() => {
    return tracking?.progress === 100;
  }, [tracking?.progress]);

  if (trackingLoading || domainLoading) {
    return (
      <div data-testid="listing-page-spinner">
        <Loading />
      </div>
    );
  }

  if (transfertFinalised) {
    return <TrackingFinalized />;
  }

  return (
    <BaseLayout
      header={{
        title: t('domain_operations_dashboard_title'),
      }}
    >
      <SubHeader
        title={t('tracking_transfert_domain_title', {
          t0: domain?.domain,
        })}
      />
      <div>
        <TrackingCard tracking={tracking} />
        {tracking.currentStep.step !== TrackingEnum.Finalization && (
          <TrackingMessage />
        )}
      </div>
    </BaseLayout>
  );
}
