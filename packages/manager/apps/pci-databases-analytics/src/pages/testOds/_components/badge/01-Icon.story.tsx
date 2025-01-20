import { Info } from 'lucide-react';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import { Badge } from '@/components/ui/badge';

export default {
  story: 'With icon',
  customComponentExemple: (
    <Badge>
      <Info className="w-4 mr-2" />
      <span>This is a badge with an icon</span>
    </Badge>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <OdsBadge label="this is an ODS badge" icon="circle-info" />
  ),
  ODSComponentResult: StoryResult.success,
};
