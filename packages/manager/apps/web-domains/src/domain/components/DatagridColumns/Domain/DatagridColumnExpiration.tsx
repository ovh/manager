import { Skeleton } from '@ovhcloud/ods-react';
import {
  DataGridTextCell,
  useFormatDate,
} from '@ovh-ux/manager-react-components';
import { ServiceRoutes } from '@/common/enum/common.enum';
import { useGetServiceInformation } from '@/common/hooks/data/query';

interface DatagridColumnExpirationProps {
  readonly serviceName: string;
}

export default function DatagridColumnExpiration({
  serviceName,
}: DatagridColumnExpirationProps) {
  const { serviceInfo, isServiceInfoLoading } = useGetServiceInformation(
    'domain',
    serviceName,
    ServiceRoutes.Domain,
  );
  const formatDate = useFormatDate();

  if (isServiceInfoLoading) {
    return (
      <div className="w-full">
        <Skeleton />
      </div>
    );
  }

  if (!serviceInfo?.billing?.expirationDate) {
    return <></>;
  }

  return (
    <DataGridTextCell>
      {formatDate({ date: serviceInfo.billing.expirationDate })}
    </DataGridTextCell>
  );
}
