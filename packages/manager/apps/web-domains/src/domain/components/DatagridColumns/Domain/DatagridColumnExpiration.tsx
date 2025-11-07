import { Skeleton, Text } from '@ovhcloud/ods-react';
import { useFormatDate } from '@ovh-ux/manager-react-components';
import { useGetServiceInformation } from '@/domain/hooks/data/query';
import { ServiceRoutes } from '@/alldoms/enum/service.enum';

interface DatagridColumnExpirationProps {
  serviceName: string;
}

export default function DatagridColumnExpiration({
  serviceName,
}: DatagridColumnExpirationProps) {
  const { serviceInfo, isServiceInfoLoading } = useGetServiceInformation(
    serviceName,
    ServiceRoutes.Domain,
  );
  const formatDate = useFormatDate();

  if (isServiceInfoLoading) {
    return <Skeleton />;
  }

  if (!serviceInfo && !serviceInfo?.billing?.expirationDate) {
    return <></>;
  }

  return (
    <>
      {serviceInfo && (
        <Text>{formatDate({ date: serviceInfo.billing?.expirationDate })}</Text>
      )}
    </>
  );
}
