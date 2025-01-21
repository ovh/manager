/* eslint-disable import/no-extraneous-dependencies */
import { OdsTag } from '@ovhcloud/ods-components/react';
import { XCircle } from 'lucide-react';
import { StoryResult } from '../Stories';
import { Badge } from '@/components/ui/badge';

export default {
  story: 'Tailwind',
  customComponentExemple: (
    <Badge className="bg-green-100 text-primary-500">
      <span>tag</span>
      <XCircle className="ml-2 h-4 w-4 cursor-pointer" />
    </Badge>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <div className="grid">
      <OdsTag label="tag" className="bg-green-100 text-primary-500" />
    </div>
  ),
  ODSComponentResult: StoryResult.fail,
};
