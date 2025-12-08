import { OdsText } from '@ovhcloud/ods-components/react';

import { ApiResponse } from '@ovh-ux/manager-core-api';
import { ServiceDetails, useServiceDetails } from '@ovh-ux/manager-react-components';

import { DisplayStatus } from '@/components/status/DisplayStatus';
import { useOrganisationParams } from '@/hooks/params/useSafeParams';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';

export default function ServiceRenewTileItem() {
  const { id } = useOrganisationParams();
  const {
    data: serviceDetails,
    isLoading,
    isError,
  } = useServiceDetails({ resourceName: id }) as {
    data?: ApiResponse<ServiceDetails>;
    isLoading: boolean;
    isError: boolean;
  };
  const { dateTimeFormat } = useCurrentUser();
  const nextBillingDate = serviceDetails?.data?.billing?.nextBillingDate;

  if (isLoading) return <DisplayStatus variant="skeletonLoading" />;
  if (isError || !nextBillingDate) return <OdsText>-</OdsText>;

  return <OdsText>{dateTimeFormat?.format(new Date(nextBillingDate))}</OdsText>;
}
