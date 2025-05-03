import {
  ActionMenu,
  ColumnSort,
  Datagrid,
  DatagridColumnTypes,
  useColumnFilters,
} from '@ovh-ux/manager-react-components';
import {
  ApiResponse,
  applyFilters,
  FilterCategories,
  FilterComparator,
} from '@ovh-ux/manager-core-api';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  mockVrackSegmentList,
  useVcdVrackNetworkOptions,
  VrackSegment,
} from '@ovh-ux/manager-module-vcd-api';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useHref } from 'react-router-dom';
import VrackNetworkDatagridSubDatagrid from './VrackNetworkDatagridSubDatagrid.component';
import { subRoutes, urls } from '@/routes/routes.constant';

export type VrackNetworkDatagridProps = {
  id: string;
  vdcId: string;
};

export default function VrackNetworkDatagrid({
  id,
  vdcId,
}: VrackNetworkDatagridProps) {
  const { t } = useTranslation('datacentres/vrack-segment');
  const [sorting, setSorting] = useState<ColumnSort>();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');

  const vcdVrackNetworkOptions = useVcdVrackNetworkOptions(id, vdcId);
  const { data: vrackNetworks, isLoading } = useQuery({
    ...vcdVrackNetworkOptions,
    queryFn: () =>
      Promise.resolve({
        data: mockVrackSegmentList,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as ApiResponse<VrackSegment[]>),
    select: (data) =>
      data.data.map((item) => ({
        ...item,
        searchableValue: `${t(
          'managed_vcd_dashboard_vrack_network_column_segment_vrack_label',
          { vlanId: item.targetSpec.vlanId },
        )} ${item.targetSpec.networks.map((network) => network).join(' ')}`,
      })),
  });

  const hrefEdit = useHref(
    urls.vrackSegmentEditVlanId
      .replace(subRoutes.dashboard, id)
      .replace(subRoutes.vdcId, vdcId),
  );

  const columns = [
    {
      id: 'searchableValue',
      label: t('managed_vcd_dashboard_vrack_network_segment'),
      cell: (item: VrackSegment) => {
        return (
          <OdsText preset="paragraph">
            {t(
              'managed_vcd_dashboard_vrack_network_column_segment_vrack_label',
              { vlanId: item.targetSpec.vlanId },
            )}
          </OdsText>
        );
      },
      isSearchable: true,
      isSortable: true,
      isFilterable: true,
      comparator: FilterCategories.String,
      type: DatagridColumnTypes.String,
    },
    {
      id: 'actions',
      label: '',
      isSearchable: false,
      isSortable: false,
      isFilterable: false,
      cell: (item: VrackSegment) => (
        <div className="flex items-center justify-end">
          <ActionMenu
            isCompact={true}
            variant={ODS_BUTTON_VARIANT.ghost}
            id={item.targetSpec.vlanId}
            items={[
              {
                id: 1,
                href: hrefEdit.replace(subRoutes.vrackSegmentId, item.id),
                label: t('managed_vcd_dashboard_vrack_network_edit_vlan'),
              },
              {
                id: 2,
                href: '_blank',
                label: t('managed_vcd_dashboard_vrack_network_add_subnet'),
              },
              ...(vrackNetworks?.length ?? 0 > 5
                ? [
                    {
                      id: 3,
                      href: '_blank',
                      label: t(
                        'managed_vcd_dashboard_vrack_network_delete_segment',
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col justify-between">
        <OdsText preset="heading-3" className="mb-4">
          {t('managed_vcd_dashboard_vrack_network_segments')}
        </OdsText>
        <OdsText preset="paragraph">
          {t('managed_vcd_dashboard_vrack_network_description')}
        </OdsText>
      </div>
      <React.Suspense>
        <Datagrid<VrackSegment>
          columns={columns}
          isLoading={isLoading}
          items={applyFilters(
            vrackNetworks ?? [],
            !searchInput || searchInput.length === 0
              ? filters
              : [
                  {
                    key: columns[0].id,
                    value: searchInput,
                    comparator: FilterComparator.Includes,
                  },
                  ...filters,
                ],
          )}
          totalItems={vrackNetworks?.length ?? 0}
          contentAlignLeft
          getRowCanExpand={(row) => row.original.targetSpec.networks.length > 0}
          renderSubComponent={(row) => (
            <VrackNetworkDatagridSubDatagrid
              networks={row.original.targetSpec.networks}
            />
          )}
          sorting={sorting}
          onSortChange={setSorting}
          manualSorting={false}
          filters={{ filters, add: addFilter, remove: removeFilter }}
          search={{
            searchInput,
            setSearchInput,
            onSearch: () => {},
          }}
        />
      </React.Suspense>
    </div>
  );
}
