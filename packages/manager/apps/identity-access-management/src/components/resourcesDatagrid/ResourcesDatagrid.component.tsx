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

export type ResourcesListDatagridProps = {
  isSelectable?: boolean;
  topbar?: ReactNode;
};

export default function ResourcesListDatagrid({
  isSelectable,
  topbar,
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
  } = useIamResourceList({ pageSize: 20 });

  const { data: resourceTypeList } = useIamResourceTypeList();

  const columns: DatagridColumn<IamResource>[] = [
    {
      id: 'displayName',
      cell: (item: IamResource) => (
        <DataGridTextCell>{item.displayName}</DataGridTextCell>
      ),
      label: t('displayname'),
      type: FilterTypeCategories.String,
      isSearchable: true,
      isSortable: true,
      isFilterable: true,
    },
    {
      id: 'type',
      cell: (item: IamResource) => (
        <DataGridTextCell>{item.type}</DataGridTextCell>
      ),
      label: t('service'),
      type: FilterTypeCategories.Options,
      filterOptions: resourceTypeList || [],
      isSortable: true,
      isFilterable: true,
    },
    {
      id: 'tags',
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
