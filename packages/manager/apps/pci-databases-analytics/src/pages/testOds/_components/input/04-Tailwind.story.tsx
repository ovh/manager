import { OdsInput } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import { Input } from '@/components/ui/input';

export default {
  story: 'Tailwind',
  customComponentExemple: (
    <Input
      placeholder="Enter something here"
      className="bg-green-100 text-primary-600"
    />
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <OdsInput
      name="i"
      placeholder="Enter something here"
      className="bg-green-100 text-primary-600"
    />
  ),
  ODSComponentResult: StoryResult.fail,
};
