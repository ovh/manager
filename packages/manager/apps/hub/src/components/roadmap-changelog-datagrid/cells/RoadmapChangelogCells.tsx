import { DataGridTextCell } from '@ovh-ux/manager-react-components';

export const RoadmapChangelogItemProductCell = ({ item }: { item: any }) => {
  return <DataGridTextCell>{item.product}</DataGridTextCell>;
};

export const RoadmapChangelogItemTitleCell = ({ item }: { item: any }) => {
  return <DataGridTextCell>{item.title}</DataGridTextCell>;
};

export const RoadmapChangelogItemDescriptionCell = ({
  item,
}: {
  item: any;
}) => {
  return <DataGridTextCell>{item.description}</DataGridTextCell>;
};

export const RoadmapChangelogItemReleaseDateCell = ({
  item,
}: {
  item: any;
}) => {
  return <DataGridTextCell>{item.releaseDate}</DataGridTextCell>;
};

export const RoadmapChangelogItemStatusCell = ({ item }: { item: any }) => {
  return <DataGridTextCell>{item.status}</DataGridTextCell>;
};
