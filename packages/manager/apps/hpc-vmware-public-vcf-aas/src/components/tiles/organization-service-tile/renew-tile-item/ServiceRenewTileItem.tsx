import React from 'react';
import { useParams } from 'react-router-dom';
import { useServiceDetails } from '@ovh-ux/manager-react-components';
import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';
import useCurrentUser from '@/hooks/user/useCurrentUser';

export default function ServiceRenewTileItem() {
  const { id } = useParams();
  const { data: serviceDetails, isLoading, isError } = useServiceDetails({
    resourceName: id,
  });
  const { dateTimeFormat } = useCurrentUser();
  const nextBillingDate = serviceDetails?.data?.billing?.nextBillingDate;

  if (isLoading) return <OdsSkeleton />;
  if (isError || !nextBillingDate) return <OdsText>-</OdsText>;

  return <OdsText>{dateTimeFormat?.format(new Date(nextBillingDate))}</OdsText>;
}
