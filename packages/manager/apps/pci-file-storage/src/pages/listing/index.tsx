import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Datagrid,
  DataGridTextCell,
  useDatagridSearchParams,
  ActionMenu,
  ActionMenuItem,
} from '@ovhcloud/manager-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';

import { getShares } from '@/api';

import Loading from '@/components/Loading/Loading';
import ErrorBanner from '@/components/Error/Error';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

import CreateButton from './CreateButton';
import IdCell from './IdCell';
import StatusCell from './StatusCell';
import { COLUMNS } from './constants';

export default function Listing() {
  const [res, setRes] = useState([]);
  const [columns, setColumns] = useState([]);
  const { pagination, setPagination } = useDatagridSearchParams();
  const { pageIndex, pageSize } = pagination;
  const { t } = useTranslation('pci-file-storage/listing');
  const { projectId } = useParams();
  const { data, isError, error, isLoading, status }: any = useQuery({
    queryKey: [`servicesListingIceberg-${pageIndex + 1}-${pageSize}`],
    queryFn: () => getShares({ projectId, pageSize, page: pageIndex + 1 }),
    staleTime: Infinity,
    enabled: true,
  });
  const actionMenuItems: ActionMenuItem[] = [
    {
      id: 1,
      label: t('action_manage'),
    },
    {
      id: 2,
      label: t('action_delete'),
      color: ODS_THEME_COLOR_INTENT.error,
    },
  ];

  const cellContents: Record<string, (props: any) => any> = {
    id: ({ id, name, region }) => (
      <IdCell id={id} name={name} region={region} />
    ),
    region: ({ region }) => <DataGridTextCell>{region}</DataGridTextCell>,
    protocol: ({ protocol }) => <DataGridTextCell>{protocol}</DataGridTextCell>,
    size: ({ size }) => <DataGridTextCell>{size} GB</DataGridTextCell>,
    status: ({ status: shareStatus }) => <StatusCell status={shareStatus} />,
    actions: () => <ActionMenu isCompact items={actionMenuItems} />,
  };

  useEffect(() => {
    if (status === 'success' && data?.data) {
      setRes(data?.data);
      const newColumns = [...Object.keys(data?.data[0]), 'actions']
        .filter((element) => COLUMNS.includes(element))
        .sort((a, b) => COLUMNS.indexOf(a) - COLUMNS.indexOf(b))
        .map((element) => ({
          id: element,
          header: element,
          label: t(`title_${element}`),
          accessorKey: element,
          cell: (props: any) => cellContents[element](props) ?? <div>-</div>,
        }));
      setColumns(newColumns);
    }
  }, [data?.data]);

  if (isError) {
    return <ErrorBanner error={error.response} />;
  }

  if (isLoading && pageIndex === 0) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (data?.length === 0) return <Navigate to="onboarding" />;

  return (
    <>
      <div className="pt-5 pb-10">
        <Breadcrumb />
        <OsdsText
          class="block mt-8"
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          size={ODS_THEME_TYPOGRAPHY_SIZE._700}
          color={ODS_THEME_COLOR_INTENT.text}
          hue={ODS_THEME_COLOR_HUE._800}
        >
          {t('title')}
        </OsdsText>
        <React.Suspense>
          {columns && res && (
            <>
              <div className="my-3 mt-5">
                <CreateButton />
              </div>
              <Datagrid
                columns={columns}
                items={res || []}
                totalItems={data?.totalCount || 0}
                pagination={pagination}
                onPaginationChange={setPagination}
                contentAlignLeft
              />
            </>
          )}
        </React.Suspense>
      </div>
    </>
  );
}
