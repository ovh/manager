import React, { useEffect, useState } from 'react';
import {
  DataGridTextCell,
  Datagrid,
  DatagridColumn,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OdsButton, OdsLink } from '@ovhcloud/ods-components/react';
import { ButtonType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import TagsListTopbar from './tagsListTopBar/TagsListTopbar.component';
import { IamTagListItem } from '@/data/api/get-iam-tags';
import TagTypeCell from './tagTypeCell/TagTypeCell.component';
import TagsListActions from './tagsListActions/TagsListActions.component';
import DatagridItemsCounter from '@/components/datagridItemsCounter/DatagridItemsCounter.component';
import { useGetIamTags } from '@/data/hooks/useGetIamTags';
import { useTagManagerContext } from '../../TagManagerContext';
import { SortTagsParams, sortTags } from './utils/sortTags';
import { urls } from '@/routes/routes.constant';

const PAGE_SIZE = 10;

export type TagsListDatagridProps = {
  tagsList: IamTagListItem[];
  isLoading: boolean;
};

export default function TagsListDatagrid() {
  const [search, setSearch] = useState<string>(); // Needed for datagrid search
  const [filter, setFilter] = useState<string>('');
  const [filteredTags, setFilteredTags] = useState<IamTagListItem[]>([]);
  const [paginatedTagList, setPaginatedTagList] = useState<IamTagListItem[]>(
    [],
  );
  const [rowSelection, setRowSelection] = useState({});
  const [page, setPage] = useState(1);
  const { t } = useTranslation(['tag-manager', NAMESPACES.ERROR]);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const { addError } = useNotifications();
  const {
    isShowSystemChecked,
    isShowUnassignedResourcesChecked,
    setSelectedTagsList,
  } = useTagManagerContext();

  const goToTagDetail = (item: IamTagListItem) => {
    trackClick({
      actionType: 'action',
      actions: ['datagrid', ButtonType.link, 'detail_tag'],
    });
    navigate(urls.tagDetail.replace(':tag', item.name));
  };

  const columns: DatagridColumn<IamTagListItem>[] = [
    {
      id: 'name',
      cell: (item: IamTagListItem) => (
        <OdsButton
          variant={ODS_BUTTON_VARIANT.ghost}
          onClick={() => goToTagDetail(item)}
          label={item.name}
        />
      ),
      label: t('tag'),
      type: FilterTypeCategories.String,
      isSearchable: true,
      isSortable: true,
    },
    {
      id: 'count',
      cell: (item: IamTagListItem) => (
        <DataGridTextCell>{item.count}</DataGridTextCell>
      ),
      label: t('assignedResources'),
      type: FilterTypeCategories.Numeric,
      isSortable: true,
    },
    {
      id: 'type',
      label: t('tagType'),
      cell: TagTypeCell,
      isSortable: false,
    },
    {
      id: 'actions',
      label: t('actions'),
      cell: TagsListActions,
    },
  ];

  const { tags, isLoading, error, isError } = useGetIamTags({
    internalTags: isShowSystemChecked,
    unassignedResources: isShowUnassignedResourcesChecked,
  });

  useEffect(() => {
    if (isError) {
      addError(
        t(`${NAMESPACES.ERROR}:error_message`, {
          message: error?.response?.data?.message,
        }),
      );
    }
  }, [isError, error]);

  useEffect(() => {
    if (!tags?.list || tags?.list.length === 0) return;
    const filtered = filter
      ? tags?.list.filter((tag) => tag.name.includes(filter))
      : tags?.list;

    setFilteredTags(filtered);
    setPaginatedTagList(filtered.slice(0, PAGE_SIZE * page));
  }, [tags?.list, filter, page]);

  const onSearch = (newSearch: string) => {
    setFilter(newSearch);
  };

  const displayMoreTags = () => {
    setPage(page + 1);
  };

  const sortItems = ({
    id,
    desc,
  }: {
    id: SortTagsParams['columnId'];
    desc: boolean;
  }) => {
    const sorted = sortTags({ tags: filteredTags, columnId: id, desc });

    setFilteredTags(sorted);
    setPaginatedTagList(sorted.slice(0, PAGE_SIZE * page));
  };

  const getRowId = (item: IamTagListItem) => item.name;

  const onRowSelectionChange = (selectedRows: IamTagListItem[]) => {
    setSelectedTagsList(selectedRows);
  };

  return (
    <>
      <Datagrid
        topbar={<TagsListTopbar />}
        columns={columns}
        items={paginatedTagList}
        totalItems={filteredTags.length}
        hasNextPage={page * PAGE_SIZE < filteredTags?.length}
        onFetchNextPage={displayMoreTags}
        search={{
          searchInput: search,
          setSearchInput: setSearch,
          onSearch,
        }}
        isLoading={isLoading}
        numberOfLoadingRows={10}
        onSortChange={sortItems}
        rowSelection={{
          rowSelection,
          setRowSelection,
          onRowSelectionChange,
        }}
        getRowId={getRowId}
      />
      <DatagridItemsCounter
        currentPage={page}
        pageSize={PAGE_SIZE}
        totalItems={filteredTags.length}
      />
    </>
  );
}
