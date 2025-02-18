import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BaseLayout,
  Datagrid,
  DataGridTextCell,
  useResourcesIcebergV2,
} from '@ovh-ux/manager-react-components';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';

type DomainType = {
  id: string;
  checksum: string;
  resourceStatus: string;
};

export default function Websites() {
  const { t } = useTranslation('common');
  const columns = useMemo(
    () => [
      {
        id: 'id',
        label: 'id',
        cell: (domain: DomainType) => {
          return <DataGridTextCell>{domain?.id}</DataGridTextCell>;
        },
      },
      {
        id: 'checksum',
        label: 'checksum',
        cell: (domain: DomainType) => {
          return <DataGridTextCell>{domain?.checksum}</DataGridTextCell>;
        },
      },
      {
        id: 'resourceStatus',
        label: 'resourceStatus',
        cell: (domain: DomainType) => {
          return <DataGridTextCell>{domain?.resourceStatus}</DataGridTextCell>;
        },
      },
    ],
    [],
  );

  const {
    fetchNextPage,
    hasNextPage,
    flattenData,
    isLoading,
    sorting,
    setSorting,
  } = useResourcesIcebergV2<DomainType>({
    route: `/domain/name`,
    queryKey: ['get', 'domain', 'name'],
  });

  return (
    <BaseLayout header={{ title: t('websites') }} breadcrumb={<Breadcrumb />}>
      <Datagrid
        data-testid="websites-page-datagrid"
        columns={columns}
        items={flattenData || []}
        totalItems={0}
        onFetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        sorting={sorting}
        onSortChange={setSorting}
        manualSorting={false}
        isLoading={isLoading}
        numberOfLoadingRows={10}
      />
    </BaseLayout>
  );
}
