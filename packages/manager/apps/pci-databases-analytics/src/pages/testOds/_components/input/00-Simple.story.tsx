import { OdsInput } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import { Input } from '@/components/ui/input';

export default {
  story: 'Simple ipnut',
  customComponentExemple: <Input placeholder="Enter something here" />,
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <OdsInput name="i" placeholder="Enter something here" />,
  ODSComponentResult: StoryResult.success,
};
