import { Info } from 'lucide-react';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import { Button } from '@/components/ui/button';

export default {
  story: 'With icon',
  customComponentExemple: (
    <Button>
      <Info className="w-4 mr-2" />
      <span>This is a button with an icon</span>
    </Button>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <OdsButton label="this is an ODS button" icon="circle-info" />
  ),
  ODSComponentResult: StoryResult.success,
};
