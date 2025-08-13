import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import {
  ActionMenuItem,
  Datagrid,
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import React, { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IamResource } from '@/data/api/iam-resources';
import {
  useIamResourceList,
  useIamResourceTypeList,
} from '@/data/hooks/useIamResources';
import DatagridTagsCell from '../datagridTagsCell/TagsCell.component';
import { useResourcesDatagridContext } from './ResourcesDatagridContext';
import ResourcesDatagridTopbar, {
  ResourcesDatagridFilter,
} from '../resourcesDatagridTopbar/ResourcesDatagridTopbar.component';

export enum ResourceDatagridColumn {
  DISPLAYNAME = 'resourceName',
  TYPE = 'resourceType',
  TAGS = 'tags',
  ACTIONS = 'actions',
}

export type ResourcesListDatagridProps = {
  isSelectable?: boolean;
  topbar?: ReactNode;
  hideColumn?: ResourceDatagridColumn[];
  initFilters?: ResourcesDatagridFilter[];
  rowActions?: (item: IamResource) => JSX.Element;
};

export default function ResourcesListDatagrid({
  isSelectable,
  topbar,
  hideColumn = [],
  initFilters = [],
  rowActions,
}: ResourcesListDatagridProps) {
  const { t } = useTranslation('tag-manager');
  const [rowSelection, setRowSelection] = useState({});
  const {
    setSelectedResourcesList,
    filters,
    setFilters,
  } = useResourcesDatagridContext();

  useEffect(() => {
    if (initFilters.length !== 0) {
      setFilters(initFilters);
    }
  }, []);

  const {
    flattenData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    sorting,
    setSorting,
  } = useIamResourceList({ pageSize: 20, filters });

  const { data: resourceTypeList } = useIamResourceTypeList();

  const columns: DatagridColumn<IamResource>[] = [
    ...(!hideColumn.includes(ResourceDatagridColumn.DISPLAYNAME)
      ? [
          {
            id: ResourceDatagridColumn.DISPLAYNAME,
            cell: (item: IamResource) => (
              <DataGridTextCell>{item.displayName}</DataGridTextCell>
            ),
            label: t(
              `resourceDatagridColumn_${ResourceDatagridColumn.DISPLAYNAME}`,
            ),
            type: FilterTypeCategories.String,
            isSearchable: false,
            isSortable: false,
            isFilterable: false,
          },
        ]
      : []),
    ...(!hideColumn.includes(ResourceDatagridColumn.TYPE)
      ? [
          {
            id: ResourceDatagridColumn.TYPE,
            cell: (item: IamResource) => (
              <DataGridTextCell>{item.type}</DataGridTextCell>
            ),
            label: t(`resourceDatagridColumn_${ResourceDatagridColumn.TYPE}`),
            type: FilterTypeCategories.Options,
            filterOptions: resourceTypeList || [],
            isSortable: false,
            isFilterable: false,
          },
        ]
      : []),
    ...(!hideColumn.includes(ResourceDatagridColumn.TAGS)
      ? [
          {
            id: ResourceDatagridColumn.TAGS,
            label: t(`resourceDatagridColumn_${ResourceDatagridColumn.TAGS}`),
            cell: (item: IamResource) => (
              <DatagridTagsCell
                tags={item.tags}
                resourceName={item.displayName}
                displayInternalTags={true}
              />
            ),
            isSortable: false,
            type: FilterTypeCategories.Tags,
            isFilterable: false,
          },
        ]
      : []),
    ...(rowActions
      ? [
          {
            id: ResourceDatagridColumn.ACTIONS,
            label: t('actions'),
            cell: rowActions,
          },
        ]
      : []),
  ];

  const onRowSelectionChange = (selectedRows: IamResource[]) => {
    setSelectedResourcesList(selectedRows);
  };

  return (
    <React.Suspense>
      <Datagrid
        topbar={
          <ResourcesDatagridTopbar columns={columns}>
            {topbar}
          </ResourcesDatagridTopbar>
        }
        isLoading={isLoading}
        columns={columns}
        items={flattenData || []}
        totalItems={10}
        onFetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage && !isLoading}
        sorting={sorting}
        onSortChange={setSorting}
        manualSorting={false}
        contentAlignLeft
        {...(isSelectable
          ? {
              rowSelection: {
                rowSelection,
                setRowSelection,
                onRowSelectionChange,
              },
            }
          : {})}
        getRowId={(resource) => resource.urn}
        noResultLabel={t('noResourceAvailableForTagging')}
      />
    </React.Suspense>
  );
}
