import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import {
  Datagrid,
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IamResource } from '@/data/api/iam-resources';
import {
  useIamResourceList,
  useIamResourceTypeList,
} from '@/data/hooks/useIamResources';
import DatagridTagsCell from '../datagridTagsCell/TagsCell.component';
import { useResourcesDatagridContext } from './ResourcesDatagridContext';

export enum ResourceDatagridColumn {
  DISPLAYNAME = 'displayName',
  TYPE = 'type',
  TAGS = 'tags',
}

export type ResourcesListDatagridProps = {
  isSelectable?: boolean;
  topbar?: ReactNode;
  hideColumn?: ResourceDatagridColumn[];
  filterWithTags?: string[];
};

export default function ResourcesListDatagrid({
  isSelectable,
  topbar,
  hideColumn = [],
  filterWithTags = [],
}: ResourcesListDatagridProps) {
  const { t } = useTranslation('tag-manager');
  const [rowSelection, setRowSelection] = useState({});
  const { setSelectedResourcesList } = useResourcesDatagridContext();

  const {
    flattenData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    sorting,
    setSorting,
    search,
    filters,
  } = useIamResourceList({ pageSize: 20, filterWithTags });

  const { data: resourceTypeList } = useIamResourceTypeList();

  const columns: DatagridColumn<IamResource>[] = [
    ...(!hideColumn.includes(ResourceDatagridColumn.DISPLAYNAME)
      ? [
          {
            id: ResourceDatagridColumn.DISPLAYNAME,
            cell: (item: IamResource) => (
              <DataGridTextCell>{item.displayName}</DataGridTextCell>
            ),
            label: t('displayname'),
            type: FilterTypeCategories.String,
            isSearchable: true,
            isSortable: true,
            isFilterable: true,
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
            label: t('service'),
            type: FilterTypeCategories.Options,
            filterOptions: resourceTypeList || [],
            isSortable: true,
            isFilterable: true,
          },
        ]
      : []),
    ...(!hideColumn.includes(ResourceDatagridColumn.TAGS)
      ? [
          {
            id: ResourceDatagridColumn.TAGS,
            label: t('tags'),
            cell: (item: IamResource) => (
              <DatagridTagsCell
                tags={item.tags}
                resourceName={item.displayName}
                displayInternalTags={true}
              />
            ),
            isSortable: false,
            type: FilterTypeCategories.Tags,
            isFilterable: true,
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
        topbar={topbar || undefined}
        isLoading={isLoading}
        columns={columns}
        items={flattenData || []}
        totalItems={10}
        onFetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage && !isLoading}
        sorting={sorting}
        onSortChange={setSorting}
        manualSorting={false}
        search={search}
        filters={filters}
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
