import { BadgeProps } from '@/components/ui/badge';
import * as database from '@/types/cloud/project/database';

export const getTagVariant = (
  tag: database.capabilities.TagEnum,
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
        tags: database.capabilities.TagEnum[];
      }[]
    | database.capabilities.RegionCapabilities[],
  serviceValue: string,
) =>
  items.map((item) =>
    item.name === serviceValue &&
    !item.tags.includes(database.capabilities.TagEnum.current)
      ? {
          ...item,
          tags: [...item.tags, database.capabilities.TagEnum.current],
        }
      : item,
  );
