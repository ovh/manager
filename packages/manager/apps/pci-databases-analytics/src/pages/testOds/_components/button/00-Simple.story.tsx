import { OdsButton } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import { Button } from '@/components/ui/button';

export default {
  story: 'Simple button',
  customComponentExemple: <Button>This is a button</Button>,
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <OdsButton label="this is an ODS button" />,
  ODSComponentResult: StoryResult.success,
};
