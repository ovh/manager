import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import punycode from 'punycode/punycode';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { BaseLayout, ChangelogMenu, Datagrid, DatagridColumn, Link, useDataApi } from '@ovh-ux/muk';

import { PublicService } from '@/data/types/product/videoManagerCenter/publicService';
import { useDebouncedValue } from '@/hooks/debouncedValue/useDebouncedValue';
import { subRoutes, urls } from '@/routes/routes.constants';
import { buildURLSearchParams } from '@/utils';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';

import VideoManagerOnboardingPage from './onBoarding/videoCenterOnboarding.page';

export default function VideoCenterPage() {
  const { t } = useTranslation(['videoManagerCenter', NAMESPACES.DASHBOARD]);
  const navigate = useNavigate();
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

  useEffect(() => {
    if (flattenData?.length === 1 && !isLoading) {
      const { id } = flattenData[0] as unknown as PublicService;
      navigate(urls.videoCenterDashboard.replace(subRoutes.serviceId, id));
    }
  }, [flattenData, isLoading, navigate]);

  const columns: DatagridColumn<PublicService>[] = [
    {
      id: 'id',
      accessorFn: (row) => row.id,
      isSortable: true,
      isSearchable: true,
      cell: (props: { row: { original: PublicService } }) => (
        <Link href={`#/video-center/${props?.row?.original?.id}`}>{props?.row?.original?.id}</Link>
      ),
      header: t(`${NAMESPACES.DASHBOARD}:service_name`),
    },
    {
      id: 'offerName',
      isSortable: true,
      isFilterable: true,
      type: FilterTypeCategories.String,
      accessorFn: (row) => row?.currentState?.offerName,
      cell: (props: { row: { original: PublicService } }) => (
        <>{props?.row?.original?.currentState?.offerName}</>
      ),
      header: t('video_manager_service_offer'),
    },
    {
      id: 'vodCount',
      isSortable: true,
      accessorFn: (row) => row?.currentState?.vodCount,
      cell: (props: { row: { original: PublicService } }) => (
        <>{props?.row?.original?.currentState?.vodCount?.allocated}</>
      ),
      header: t('video_manager_service_video_count'),
    },
    {
      id: 'vodDurationMinutes',
      isSortable: true,
      accessorFn: (row) => row?.currentState?.vodDurationMinutes,
      cell: (props: { row: { original: PublicService } }) => (
        <>{props?.row?.original?.currentState?.vodDurationMinutes?.allocated}</>
      ),
      header: t('video_manager_service_video_duration'),
    },
  ];

  if ((flattenData?.length === 0 || !flattenData) && !isLoading) {
    return <VideoManagerOnboardingPage />;
  }

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
