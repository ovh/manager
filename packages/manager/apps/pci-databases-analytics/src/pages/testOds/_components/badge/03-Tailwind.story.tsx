import { OdsBadge } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import { Badge } from '@/components/ui/badge';

export default {
  story: 'Custom tailwind',
  customComponentExemple: (
    <Badge className="text-orange-100 bg-green-200 hover:bg-green-400">
      This is a badge
    </Badge>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <div className="grid">
      <OdsBadge
        className="text-orange-100 bg-green-200 hover:bg-green-400"
        label="this is an ODS badge"
        icon="circle-info"
      />
    </div>
  ),
  ODSComponentResult: StoryResult.fail,
};
