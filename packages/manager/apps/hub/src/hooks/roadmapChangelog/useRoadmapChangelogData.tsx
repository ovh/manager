import { useTranslation } from 'react-i18next';

import { OsdsSkeleton } from '@ovhcloud/ods-components/react';

import { DatagridColumn } from '@ovh-ux/manager-react-components';

import {
  RoadmapChangelogItemDescriptionCell,
  RoadmapChangelogItemProductCell,
  RoadmapChangelogItemReleaseDateCell,
  RoadmapChangelogItemStatusCell,
  RoadmapChangelogItemTitleCell,
} from '@/components/roadmap-changelog-datagrid/cells';
import { RoadmapChangelogItem } from '@/types/roadmapchangelog.type';

export const useRoadmapChangelogData = (isLoadingItems: boolean) => {
  const { t } = useTranslation('changelog');

  const emptyRoadmapChangelogItem: RoadmapChangelogItem = {
    title: '',
    url: '',
    product: '',
    releaseDate: '',
    status: '',
    changelog: '',
  };

  const emptyRoadmapChangelogItems: RoadmapChangelogItem[] = [
    emptyRoadmapChangelogItem,
    emptyRoadmapChangelogItem,
    emptyRoadmapChangelogItem,
  ];

  const columns: DatagridColumn<RoadmapChangelogItem>[] = [
    {
      id: 'product',
      label: t('datagrid_table_head_product'),
      cell: (item: RoadmapChangelogItem) =>
        isLoadingItems ? <OsdsSkeleton /> : <RoadmapChangelogItemProductCell item={item} />,
    },
    {
      id: 'changelog',
      label: t('datagrid_table_head_changelog'),
      cell: (item: RoadmapChangelogItem) =>
        isLoadingItems ? <OsdsSkeleton /> : <RoadmapChangelogItemTitleCell item={item} />,
    },
    {
      id: 'description',
      label: t('datagrid_table_head_link'),
      cell: (item: RoadmapChangelogItem) =>
        isLoadingItems ? <OsdsSkeleton /> : <RoadmapChangelogItemDescriptionCell item={item} />,
    },
    {
      id: 'realease_date',
      label: t('datagrid_table_head_release_date'),
      cell: (item: RoadmapChangelogItem) =>
        isLoadingItems ? <OsdsSkeleton /> : <RoadmapChangelogItemReleaseDateCell item={item} />,
    },
    {
      id: 'status',
      label: t('datagrid_table_head_status'),
      cell: (item: RoadmapChangelogItem) =>
        isLoadingItems ? <OsdsSkeleton /> : <RoadmapChangelogItemStatusCell item={item} />,
    },
  ];

  return { emptyRoadmapChangelogItems, columns };
};

export default useRoadmapChangelogData;
