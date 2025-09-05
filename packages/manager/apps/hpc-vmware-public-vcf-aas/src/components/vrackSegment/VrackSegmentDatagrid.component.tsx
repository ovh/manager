import {
  ColumnSort,
  Datagrid,
  DatagridColumnTypes,
  useColumnFilters,
} from '@ovh-ux/manager-react-components';
import {
  applyFilters,
  FilterCategories,
  FilterComparator,
} from '@ovh-ux/manager-core-api';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  isStatusTerminated,
  useVcdOrganization,
  useVcdVrackSegmentListOptions,
  VCDVrackSegment,
} from '@ovh-ux/manager-module-vcd-api';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useHref } from 'react-router-dom';
import { VrackSegmentSubDatagrid } from './VrackSegmentSubDatagrid.component';
import { subRoutes, urls } from '@/routes/routes.constant';
import { VRACK_SEGMENTS_MIN_LENGTH } from '@/pages/dashboard/datacentre/vrack-segment/datacentreVrack.constants';
import ActionMenu from '../action/Action.component';
import { VrackSegmentStatusBadge } from '../vrackSegmentStatusBadge/VrackSegmentStatusBadge.component';
import { TRACKING } from '@/tracking.constants';

export type VrackSegmentDatagridProps = {
  id: string;
  vdcId: string;
};

export const VrackSegmentDatagrid = ({
  id,
  vdcId,
}: VrackSegmentDatagridProps) => {
  const { t } = useTranslation([
    'datacentres/vrack-segment',
    NAMESPACES.STATUS,
  ]);
  const { trackClick } = useOvhTracking();
  const [sorting, setSorting] = useState<ColumnSort>();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const { data: vcdOrganization } = useVcdOrganization({ id });
  const isVcdTerminated = isStatusTerminated(
    vcdOrganization?.data?.resourceStatus,
  );

  const vcdVrackNetworkOptions = useVcdVrackSegmentListOptions(id, vdcId);
  const { data: vrackSegments, isLoading } = useQuery({
    ...vcdVrackNetworkOptions,
    refetchInterval: (query) =>
      query.state?.data?.data.find(
        ({ resourceStatus }) => !['READY', 'ERROR'].includes(resourceStatus),
      ) && 2000,
    select: (data) =>
      data.data.map((item) => ({
        ...item,
        searchableValue: `${t(
          'managed_vcd_dashboard_vrack_column_segment_vrack_label',
          { vlanId: item.targetSpec.vlanId },
        )} ${item.targetSpec.networks.map((network) => network).join(' ')}`,
      })),
  });

  const hrefEdit = useHref(
    urls.vrackSegmentEditVlanId
      .replace(subRoutes.dashboard, id)
      .replace(subRoutes.vdcId, vdcId),
  );

  const hrefAddNetwork = useHref(
    urls.vrackSegmentAddNetwork
      .replace(subRoutes.dashboard, id)
      .replace(subRoutes.vdcId, vdcId),
  );

  const hrefVrackSegmentDelete = useHref(
    urls.vrackSegmentDelete
      .replace(subRoutes.dashboard, id)
      .replace(subRoutes.vdcId, vdcId),
  );

  const hasExtraSegments =
    (vrackSegments?.length ?? 0) > VRACK_SEGMENTS_MIN_LENGTH;

  const columns = [
    {
      id: 'searchableValue',
      label: t('datacentres/vrack-segment:managed_vcd_dashboard_vrack_segment'),
      cell: (item: VCDVrackSegment) => {
        return (
          <OdsText preset="paragraph">
            {t(
              'datacentres/vrack-segment:managed_vcd_dashboard_vrack_column_segment_vrack_label',
              {
                vlanId: item.targetSpec.vlanId,
              },
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
      id: 'status',
      label: t(`${NAMESPACES.STATUS}:status`),
      cell: (item: VCDVrackSegment) => {
        return <VrackSegmentStatusBadge resourceStatus={item.resourceStatus} />;
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
      cell: (item: VCDVrackSegment) => {
        const isNotReadyForChange =
          !isVcdTerminated && !['READY', 'ERROR'].includes(item.resourceStatus);
        const itemId = item.targetSpec.vlanId;
        const isNotEditable = item.currentState.mode !== 'TAGGED';

        return (
          <div className="flex justify-end">
            <ActionMenu
              popover-position="bottom-end"
              id={itemId}
              isCompact
              isDisabled={isNotReadyForChange}
              variant={ODS_BUTTON_VARIANT.ghost}
              items={[
                {
                  id: 1,
                  onClick: () => trackClick(TRACKING.vrack.modifyVlanId),
                  href: hrefEdit.replace(subRoutes.vrackSegmentId, item.id),
                  label: t(
                    'datacentres/vrack-segment:managed_vcd_dashboard_vrack_edit_vlan',
                  ),
                  isDisabled: isNotEditable,
                  tooltipMessage:
                    isNotEditable &&
                    t(
                      'datacentres/vrack-segment:managed_vcd_dashboard_vrack_edit_vlan_not_available',
                    ),
                },
                {
                  id: 2,
                  onClick: () => trackClick(TRACKING.vrack.addNetwork),
                  href: hrefAddNetwork.replace(
                    subRoutes.vrackSegmentId,
                    item.id,
                  ),
                  label: t(
                    'datacentres/vrack-segment:managed_vcd_dashboard_vrack_add_network',
                  ),
                },
                ...(hasExtraSegments && item.targetSpec.type !== 'DEFAULT'
                  ? [
                      {
                        id: 3,
                        color: ODS_BUTTON_COLOR.critical,
                        label: t(
                          'datacentres/vrack-segment:managed_vcd_dashboard_vrack_delete_segment',
                        ),
                        onClick: () => trackClick(TRACKING.vrack.deleteSegment),
                        href: hrefVrackSegmentDelete.replace(
                          subRoutes.vrackSegmentId,
                          item.id,
                        ),
                      },
                    ]
                  : []),
              ]}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col justify-between">
        <OdsText preset="heading-3" className="mb-4">
          {t('datacentres/vrack-segment:managed_vcd_dashboard_vrack_segments')}
        </OdsText>
        <OdsText preset="paragraph">
          {t(
            'datacentres/vrack-segment:managed_vcd_dashboard_vrack_description',
          )}
        </OdsText>
      </div>
      <React.Suspense>
        <Datagrid<VCDVrackSegment>
          columns={columns}
          isLoading={isLoading}
          items={applyFilters(
            vrackSegments ?? [],
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
          totalItems={vrackSegments?.length ?? 0}
          contentAlignLeft
          getRowCanExpand={(row) => row.original.targetSpec.networks.length > 0}
          renderSubComponent={(row) => (
            <VrackSegmentSubDatagrid vrackSegment={row.original} />
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
};
