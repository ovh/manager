import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Description,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';
import { OsdsSkeleton } from '@ovhcloud/ods-components/react';
import useCurrentUser from '@/hooks/user/useCurrentUser';

export default function ServiceRenewTileItem() {
  const { id } = useParams();
  const { data: serviceDetails, isLoading, isError } = useServiceDetails({
    resourceName: id,
  });
  const { dateTimeFormat } = useCurrentUser();
  const nextBillingDate = serviceDetails?.data?.billing?.nextBillingDate;

  if (isLoading) return <OsdsSkeleton />;
  if (isError || !nextBillingDate) return <Description>-</Description>;

  return (
    <Description>
      {dateTimeFormat?.format(new Date(nextBillingDate))}
    </Description>
  );
}
