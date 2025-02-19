/* eslint-disable import/no-extraneous-dependencies */
import { OdsTag } from '@ovhcloud/ods-components/react';
import { XCircle } from 'lucide-react';
import { StoryResult } from '../Stories';
import { Badge } from '@/components/ui/badge';

export default {
  story: 'Simple tag',
  customComponentExemple: (
    <Badge>
      <span>tag</span>
      <XCircle className="ml-2 h-4 w-4 cursor-pointer" />
    </Badge>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <OdsTag label="tag" />,
  ODSComponentResult: StoryResult.success,
};
