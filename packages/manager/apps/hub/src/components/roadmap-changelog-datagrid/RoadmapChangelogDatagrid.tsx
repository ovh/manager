import { useEffect, useState } from 'react';
import { Datagrid, DatagridColumn } from '@ovh-ux/manager-react-components';
import { useRoadmapChangelog } from '@/data/hooks/roadmapChangelog/useRoadmapChangelog';
import {
  RoadmapChangelogItemProductCell,
  RoadmapChangelogItemTitleCell,
  RoadmapChangelogItemDescriptionCell,
  RoadmapChangelogItemReleaseDateCell,
  RoadmapChangelogItemStatusCell,
} from './cells/RoadmapChangelogCells';

const RoadmapChangelogDatagrid = () => {
  const {
    data: roadmapChangelogItems,
    isLoading: isLoadingItems,
  } = useRoadmapChangelog();

  useEffect(() => {
    console.log(roadmapChangelogItems);
  }, [isLoadingItems]);

  const columns: DatagridColumn<string>[] = [
    {
      id: 'product',
      label: 'Product',
      cell: (item: any) => <RoadmapChangelogItemProductCell item={item} />,
    },
    {
      id: 'changelog',
      label: 'Changelog',
      cell: (item: any) => <RoadmapChangelogItemTitleCell item={item} />,
    },
    {
      id: 'description',
      label: 'Description',
      cell: (item: any) => <RoadmapChangelogItemDescriptionCell item={item} />,
    },
    {
      id: 'realease_date',
      label: 'Realease Date',
      cell: (item: any) => <RoadmapChangelogItemReleaseDateCell item={item} />,
    },
    {
      id: 'status',
      label: 'Status',
      cell: (item: any) => <RoadmapChangelogItemStatusCell item={item} />,
    },
  ];

  return (
    !isLoadingItems &&
    roadmapChangelogItems && (
      <>
        <Datagrid
          items={roadmapChangelogItems.hostingCollab}
          columns={columns}
          hasNextPage={false}
          totalItems={20}
        />
        <Datagrid
          items={roadmapChangelogItems.cloud}
          columns={columns}
          hasNextPage={false}
          totalItems={20}
        />
      </>
    )
  );
};

export default RoadmapChangelogDatagrid;
