import { BadgeProps } from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';

export const getTagVariant = (
  tag: database.capabilities.TagEnum,
): BadgeProps['variant'] => {
  switch (tag) {
    case 'new':
    case 'BETA':
    case 'current':
      return 'success';
    case 'soonDeprecated':
    case 'endOfSale':
      return 'warning';
    default:
      return 'neutral';
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
