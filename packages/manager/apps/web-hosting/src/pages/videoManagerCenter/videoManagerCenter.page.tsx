import React from 'react';

import punycode from 'punycode/punycode';
import { useTranslation } from 'react-i18next';

import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { BaseLayout, ChangelogMenu, Datagrid, DatagridColumn, Link, useDataApi } from '@ovh-ux/muk';

import { PublicService } from '@/data/types/product/videoManagerCenter/publicService';
import { useDebouncedValue } from '@/hooks/debouncedValue/useDebouncedValue';
import { buildURLSearchParams } from '@/utils';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';

export default function VideoManagerCenterPage() {
  const { t } = useTranslation('videoManagerCenter');
  const [searchInput, setSearchInput, debouncedSearchInput, setDebouncedSearchInput] =
    useDebouncedValue('');
  const searchParams = buildURLSearchParams({
    naidme: punycode.toASCII(debouncedSearchInput),
  });
  const { flattenData, hasNextPage, fetchNextPage, isLoading, filters, sorting } = useDataApi({
    version: 'v2',
    route: `/videocenter/resource${searchParams}`,
    cacheKey: ['videocenter', 'resource'],
    iceberg: true,
    enabled: true,
  });

  const columns: DatagridColumn<PublicService>[] = [
    {
      id: 'id',
      accessorFn: (row) => row.id,
      isSortable: true,
      isSearchable: true,
      cell: (props: { row: { original: PublicService } }) => (
        <Link href={`#/video-manager-center/${props.row.original.id}`}>
          {props.row.original.id}
        </Link>
      ),
      header: t('video_manager_service_name'),
    },
    {
      id: 'agoraPlanCode',
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.String,
      accessorFn: (row) => row.currentState.agoraPlanCode,
      cell: (props: { row: { original: PublicService } }) => (
        <>{props.row.original.currentState.agoraPlanCode}</>
      ),
      header: t('video_manager_service_offer'),
    },
    {
      id: 'videoCount',
      isSortable: true,
      accessorFn: (row) => row.currentState.videoCount,
      cell: (props: { row: { original: PublicService } }) => (
        <>{props.row.original.currentState.videoCount.allocated}</>
      ),
      header: t('video_manager_service_video_count'),
    },
    {
      id: 'videoDurationMinutes',
      isSortable: true,
      accessorFn: (row) => row.currentState.videoDurationMinutes,
      cell: (props: { row: { original: PublicService } }) => (
        <>{props.row.original.currentState.videoDurationMinutes.allocated}</>
      ),
      header: t('video_manager_service_video_duration'),
    },
  ];

  return (
    <BaseLayout
      header={{
        title: t('video_manager_page_title'),
        changelogButton: <ChangelogMenu links={CHANGELOG_LINKS} />,
      }}
    >
      <Datagrid
        columns={columns as unknown as DatagridColumn<Record<string, unknown>>[]}
        data={flattenData ?? []}
        containerHeight={500}
        sorting={sorting}
        filters={filters}
        search={{
          searchInput,
          setSearchInput,
          onSearch: (search) => setDebouncedSearchInput(search),
        }}
        hasNextPage={hasNextPage && !isLoading}
        onFetchNextPage={(): void => {
          void fetchNextPage();
        }}
        isLoading={isLoading}
      />
    </BaseLayout>
  );
}
