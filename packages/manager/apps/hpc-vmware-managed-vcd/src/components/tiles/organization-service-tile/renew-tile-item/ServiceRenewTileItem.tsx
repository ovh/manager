import React from 'react';
import { useParams } from 'react-router-dom';
import {
  DateFormat,
  Description,
  useFormattedDate,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';
import { OsdsSkeleton } from '@ovhcloud/ods-components/react';

export default function ServiceRenewTileItem() {
  const { id } = useParams();
  const { data: serviceDetails, isLoading, isError } = useServiceDetails({
    resourceName: id,
  });
  const nextBillingDate = useFormattedDate({
    dateString: serviceDetails?.data?.billing?.nextBillingDate,
    format: DateFormat.fullDisplay,
  });

  if (isLoading) return <OsdsSkeleton />;
  if (isError || !nextBillingDate) return <Description>-</Description>;

  return <Description>{nextBillingDate}</Description>;
}
