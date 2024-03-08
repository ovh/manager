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
