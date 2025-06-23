import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { RoadmapChangelogItem } from '@/types/roadmapchangelog.type';

export const RoadmapChangelogItemTitleCell = ({
  item,
}: {
  item: RoadmapChangelogItem;
}) => {
  return (
    <DataGridTextCell>
      <div className="max-w-[24rem]">{item.changelog}</div>
    </DataGridTextCell>
  );
};
