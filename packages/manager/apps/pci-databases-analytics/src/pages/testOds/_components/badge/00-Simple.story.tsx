import { OdsBadge } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import { Badge } from '@/components/ui/badge';

export default {
  story: 'Simple badge',
  customComponentExemple: <Badge>This is a badge</Badge>,
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <OdsBadge label="this is an ODS badge" />,
  ODSComponentResult: StoryResult.success,
};
