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
import VrackNetworkDatagridSubDatagrid from './VrackNetworkDatagridSubDatagrid.component';
import { LABELS } from '@/utils/labels.constants';

export type VrackNetworkDatagridProps = {
  id: string;
  vdcId: string;
};

export default function VrackNetworkDatagrid({
  id,
  vdcId,
}: VrackNetworkDatagridProps) {
  const { t } = useTranslation('datacentres/vrack-network');
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
  });

  const columns = [
    {
      id: 'targetSpec.vlanId',
      label: t('managed_vcd_dashboard_vrack_network_title'),
      cell: (item: VrackSegment) => {
        return (
          <OdsText preset="paragraph">
            {LABELS.vRackNetwork} - {LABELS.vlan} {item.targetSpec.vlanId}
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
      label: 'Actions',
      isSearchable: false,
      isSortable: false,
      isFilterable: false,
      cell: (item: VrackSegment) => (
        <div className="flex items-center justify-end">
          <ActionMenu
            isCompact={true}
            variant={ODS_BUTTON_VARIANT.ghost}
            id={item.targetSpec.vlanId.toString()}
            items={[
              {
                id: 1,
                target: '_blank',
                label: t('managed_vcd_dashboard_vrack_network_edit_vlan'),
              },
              {
                id: 2,
                target: '_blank',
                label: t('managed_vcd_dashboard_vrack_network_add_subnet'),
              },
              ...(vrackNetworks?.length ?? 0 > 5
                ? [
                    {
                      id: 3,
                      target: '_blank',
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
      <div className="flex flex-col justify-between mt-4">
        <OdsText preset="heading-1">
          {t('managed_vcd_dashboard_vrack_network_title')}
        </OdsText>
        <OdsText preset="paragraph" className="mb-8">
          {t('managed_vcd_dashboard_vrack_network_description')}
        </OdsText>
      </div>
      <React.Suspense>
        <Datagrid<VrackSegment>
          columns={columns}
          columnVisibility={['targetSpec.vlanId', 'actions']}
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
