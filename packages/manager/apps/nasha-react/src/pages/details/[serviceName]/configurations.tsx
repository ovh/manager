import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  OsdsInput,
  OsdsLink,
  OsdsIcon,
  OsdsSpinner,
} from '@ovhcloud/ods-stencil/components/react/';
import { useTranslation } from 'react-i18next';
import { OdsIconName, OdsIconSize } from '@ovhcloud/ods-core';
import { OdsThemeColorIntent } from '@ovhcloud/ods-theming';
import { createNashaPartition, service } from '@/api/nasha-react';

function Configurations(props: { serviceName: string }) {
  const { serviceName } = props;
  const [partitionData, setPartitionData] = useState({
    partitionDescription: '',
    partitionName: 'partition-name',
    size: 10,
    protocol: 'NFS',
  });
  const { t } = useTranslation('nasha-react/details/dashboard');

  const { isLoading, isError, data } = useQuery(
    ['informations', { serviceName }],
    service,
  );

  if (isLoading) return <OsdsSpinner />;
  if (isError) return <span>{t('nasha_dashboard_suscriptions_error')}</span>;
  if (data?.length === 0) return <></>;

  const handleClickPartition = async () => {
    await createNashaPartition({
      queryKey: [
        'createPartition',
        {
          serviceName,
          data: partitionData,
        },
      ],
    });
    // handle successful response here
  };

  return (
    <>
      <div>
        {data.use.used.value} / {data.use.size.value} {data.use.size.unit}
      </div>

      <div>
        <OsdsInput
          value={partitionData.partitionName}
          onChange={(e: any) =>
            setPartitionData((currentPartitionData) => ({
              ...currentPartitionData,
              partitionName: e.target?.value,
            }))
          }
        />
        <OsdsInput
          value={partitionData.partitionDescription}
          onChange={(e: any) =>
            setPartitionData((currentPartitionData) => ({
              ...currentPartitionData,
              partitionDescription: e.target?.value,
            }))
          }
        />
        <OsdsInput
          value={partitionData.size}
          onChange={(e: any) =>
            setPartitionData((currentPartitionData) => ({
              ...currentPartitionData,
              size: Number(e.target.value),
            }))
          }
        />
        <OsdsInput
          value={partitionData.protocol}
          onChange={(e: any) =>
            setPartitionData((currentPartitionData) => ({
              ...currentPartitionData,
              protocol: e.target?.value as string,
            }))
          }
        />
      </div>
      <OsdsLink
        onClick={handleClickPartition}
        color={OdsThemeColorIntent.primary}
      >
        {t('nasha_dashboard_partitions_create')}
        <span slot="end">
          <OsdsIcon
            name={OdsIconName.ARROW_RIGHT}
            size={OdsIconSize.xs}
            color={OdsThemeColorIntent.primary}
          />
        </span>
      </OsdsLink>
    </>
  );
}

export default Configurations;
