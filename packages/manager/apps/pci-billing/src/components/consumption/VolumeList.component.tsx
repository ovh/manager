import {
  TVolume as TProjectVolume,
  useVolumes,
  useParam,
} from '@ovh-ux/manager-pci-common';
import { Datagrid, useDataGrid } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TVolume } from '@/api/hook/useConsumption';
import { paginateResults } from '@/api/data/consumption';
import NoDataMessage from './NoDataMessage.component';
import { useVolumeListColumns } from './useVolumeListColumns';

type VolumeListProps = {
  volumes: TVolume[];
};

export default function VolumeList({ volumes }: Readonly<VolumeListProps>) {
  const { t } = useTranslation('consumption/hourly-instance/volume');

  const { currency } = useContext(ShellContext).environment.getUser();
  const { projectId } = useParam('projectId');
  const { pagination, setPagination } = useDataGrid();
  const columns = useVolumeListColumns();

  const [volumeConsumptionDetails, setVolumeConsumptionDetails] = useState([]);

  const { data: allVolumes, isPending: allVolumesPending } = useVolumes(
    projectId,
  );

  const updateVolumeConsumptionDetails = (
    allProjectVolumes: TProjectVolume[],
    givenVolumes: TVolume[],
  ) =>
    givenVolumes.map((volume) => {
      const volumeConsumptionDetail = {
        totalPrice: `${volume.totalPrice.toFixed(2)} ${currency.symbol}`,
        volumeId: volume.volumeId,
        quantity: volume.quantity.value,
        region: volume.region,
        type: volume.type,
        amount: volume.quantity.value,
      };

      const projectVolume = allProjectVolumes.find(
        (projectVolumeItem) => projectVolumeItem.id === volume.volumeId,
      );

      if (projectVolume) {
        return {
          ...volumeConsumptionDetail,
          name: projectVolume.name,
          size: projectVolume.size,
          status: projectVolume.status,
        };
      }
      return {
        ...volumeConsumptionDetail,
        name: volume.volumeId,
        status: 'deleted',
      };
    });

  useEffect(() => {
    if (allVolumes?.length > 0 && volumes?.length > 0) {
      const result = updateVolumeConsumptionDetails(allVolumes, volumes);
      const sortedResult = result.sort((a, b) => a.name.localeCompare(b.name));
      setVolumeConsumptionDetails(sortedResult);
    }
  }, [allVolumes, volumes]);

  const paginatedVolumes = useMemo(
    () => paginateResults(volumeConsumptionDetails || [], pagination),
    [volumeConsumptionDetails, pagination, setPagination],
  );

  if (allVolumesPending) {
    return (
      <div className="flex justify-center">
        <OsdsSpinner size={ODS_SPINNER_SIZE.md} inline />
      </div>
    );
  }

  if (!allVolumesPending && paginatedVolumes.totalRows === 0) {
    return <NoDataMessage message={t('cpbc_no_consumption_data')} />;
  }

  return (
    <div className="my-3">
      <Datagrid
        columns={columns}
        items={paginatedVolumes.rows}
        totalItems={paginatedVolumes.totalRows}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  );
}
