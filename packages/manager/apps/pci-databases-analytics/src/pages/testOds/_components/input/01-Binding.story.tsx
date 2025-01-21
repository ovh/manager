import { OdsInput } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import { Input } from '@/components/ui/input';

export default {
  story: 'Simple binding ipnut',
  customComponentExemple: (
    <Input placeholder="Enter something here" value={'hello world'} />
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <OdsInput
      name="i"
      placeholder="Enter something here"
      value={'hello world'}
    />
  ),
  ODSComponentResult: StoryResult.success,
};
