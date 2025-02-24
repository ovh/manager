import { BaseLayout } from '@ovh-ux/manager-react-components';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { TrackingEnum } from '@/enum/tracking.enum';
import { getOperationTrackingStatus } from '@/data/api/tracking';
import Loading from '@/components/Loading/Loading';
import SubHeader from '@/components/SubHeader/SubHeader';
import { TOngoingOperations, TTracking } from '@/types';
import { getmeTaskDomainId } from '@/data/api/web-ongoing-operations';
import TrackingMessage from '@/components/Tracking/TrackingMessage';
import TrackingFinalized from '@/components/Tracking/TrackingFinalized';
import TrackingCard from '@/components/Tracking/TrackingCard';

export default function Track() {
  const { t } = useTranslation('dashboard');
  const { id } = useParams<{ id: string }>();
  const paramId = Number(id);

  const { data: tracking, isLoading: trackingLoading } = useQuery<TTracking>({
    queryKey: ['tracking'],
    queryFn: () => getOperationTrackingStatus(paramId),
  });

  const { data: domain, isLoading: domainLoading } = useQuery<
    TOngoingOperations
  >({
    queryKey: ['domain'],
    queryFn: () => getmeTaskDomainId(paramId),
  });

  const transfertFinalised = useMemo(() => {
    return tracking?.progress === 100;
  }, [tracking?.progress]);

  if (trackingLoading && domainLoading) {
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
      <SubHeader domain={domain} />
      <div>
        <TrackingCard tracking={tracking} />
        {tracking?.currentStep.step !== TrackingEnum.Finalization && (
          <TrackingMessage />
        )}
      </div>
    </BaseLayout>
  );
}
