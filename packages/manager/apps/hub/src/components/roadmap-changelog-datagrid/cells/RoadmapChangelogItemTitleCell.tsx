import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { RoadmapChangelogItem } from '@/types/roadmapchangelog.type';

import styles from '../style.module.scss';

export const RoadmapChangelogItemTitleCell = ({ item }: { item: RoadmapChangelogItem }) => {
  return (
    <DataGridTextCell>
      <div className={styles['roadmap-changelog-datagrid-cell']}>{item.changelog}</div>
    </DataGridTextCell>
  );
};
