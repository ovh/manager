import { BadgeProps } from '@/components/ui/badge';
import { database } from '@/models/database';

export const getTagVariant = (
  tag: database.capabilities.Tags,
): BadgeProps['variant'] => {
  switch (tag) {
    case 'new':
    case 'current':
      return 'success';
    case 'soonDeprecated':
      return 'warning';
    default:
      return 'info';
  }
};

export const updateTags = (
  items:
    | database.capabilities.Flavor[]
    | database.capabilities.Plan[]
    | {
        default: boolean;
        lifecycle: database.availability.Lifecycle;
        name: string;
        tags: database.capabilities.Tags[];
      }[]
    | database.RegionCapabilities[],
  serviceValue: string,
) =>
  items.map((item) =>
    item.name === serviceValue &&
    !item.tags.includes(database.capabilities.Tags.current)
      ? {
          ...item,
          tags: [...item.tags, database.capabilities.Tags.current],
        }
      : item,
  );
