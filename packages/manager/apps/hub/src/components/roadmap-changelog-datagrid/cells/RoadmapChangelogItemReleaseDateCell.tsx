import { useTranslation } from 'react-i18next';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { RoadmapChangelogItem } from '@/types/roadmapchangelog.type';

export const RoadmapChangelogItemReleaseDateCell = ({ item }: { item: RoadmapChangelogItem }) => {
  const { i18n } = useTranslation('changelog');
  const locale = i18n?.language?.replace('_', '-');
  return (
    <DataGridTextCell>
      {item.releaseDate
        ? new Date(item.releaseDate).toLocaleDateString(locale, {
            dateStyle: 'medium',
          })
        : ''}
    </DataGridTextCell>
  );
};
