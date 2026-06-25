import { PropsWithChildren } from 'react';
import { useParams } from 'react-router-dom';
import {
  RedirectionGuard,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';
import { FEATURES } from '@/utils/features.constants';
import { urls } from '@/routes/routes.constant';

export default function VcdaFeatureGuard({
  children,
}: Readonly<PropsWithChildren>) {
  const { id } = useParams();
  const { data: features, isLoading } = useFeatureAvailability([
    FEATURES.HPC_VCFAAS_VCDA,
  ]);

  return (
    <RedirectionGuard
      route={urls.dashboard.replace(':id', id ?? '')}
      isLoading={isLoading}
      condition={!features?.[FEATURES.HPC_VCFAAS_VCDA]}
    >
      {children}
    </RedirectionGuard>
  );
}
