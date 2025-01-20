import { OdsButton } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import { Button } from '@/components/ui/button';

export default {
  story: 'Tailwind',
  customComponentExemple: (
    <Button className="text-orange-100 bg-green-200 hover:bg-green-400">
      This is a button
    </Button>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <div className="grid">
      <OdsButton
        label="this is an ODS button"
        className="text-orange-100 bg-green-200 hover:bg-green-400"
      />
    </div>
  ),
  ODSComponentResult: StoryResult.fail,
};
