import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { H2 } from '@/components/typography';
import { database } from '@/models/database';
import { getServiceType } from '@/utils/databaseUtils';
import AvailabilityTable from './_components/availabilities-table';
import { DataTable } from '@/components/ui/data-table';
import OrderFunnel from './_components/order-funnel';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import {
  useGetAvailabilities,
  useGetCapabilities,
} from '@/hooks/api/availabilities.api.hooks';

export const Handle = {
  breadcrumb: () => 'pci_cdb_breadcrumb_create',
};

export type AvailabilityWithType = database.Availability & {
  serviceType: database.ServiceTypeEnum;
};

const CreateServicePage = () => {
  const { t } = useTranslation('order_funnel');
  const [showTable, setShowTable] = useState(false);
  const { projectId, serviceType } = useRequiredParams<{
    projectId: string;
    serviceType: database.ServiceTypeEnum;
  }>();

  const availabilitiesQuery = useGetAvailabilities(projectId);
  const capabilitiesQuery = useGetCapabilities(projectId);

  const availabilities: AvailabilityWithType[] | undefined = useMemo(() => {
    if (!availabilitiesQuery.data) return undefined;
    return availabilitiesQuery.data
      .map((availability) => ({
        ...availability,
        serviceType: getServiceType(availability.engine as database.EngineEnum),
      }))
      .filter(
        (a) =>
          serviceType === database.ServiceTypeEnum.all ||
          a.serviceType === serviceType,
      );
  }, [availabilitiesQuery.data, serviceType]);

  if (availabilitiesQuery.error)
    return <pre>{JSON.stringify(availabilitiesQuery.error)}</pre>;

  return (
    <>
      <H2>{t('pci_cdb_order_funnel_title')}</H2>

      {(availabilitiesQuery.isLoading || capabilitiesQuery.isLoading) && (
        <DataTable.Skeleton />
      )}
      {availabilities && capabilitiesQuery.data && (
        <>
          <div className="flex items-center space-x-2 mb-2">
            <Switch
              className="rounded-xl"
              id="availabilities-table"
              checked={showTable}
              onCheckedChange={(checked) => setShowTable(checked)}
            />
            <Label htmlFor="availabilities-table">Table view</Label>
          </div>
          {showTable ? (
            <AvailabilityTable availabilities={availabilities} />
          ) : (
            <OrderFunnel
              availabilities={availabilities}
              capabilities={capabilitiesQuery.data}
            />
          )}
        </>
      )}
    </>
  );
};

export default CreateServicePage;
