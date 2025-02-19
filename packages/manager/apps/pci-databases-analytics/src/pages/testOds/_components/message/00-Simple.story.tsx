/* eslint-disable import/no-extraneous-dependencies */
import { OdsMessage } from '@ovhcloud/ods-components/react';
import { Info } from 'lucide-react';
import { StoryResult } from '../Stories';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default {
  story: 'Simple message',
  customComponentExemple: (
    <Alert variant="info">
      <div className="flex items-center gap-2">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-base">
          Information message
        </AlertDescription>
      </div>
    </Alert>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <OdsMessage color="information">Information message</OdsMessage>
  ),
  ODSComponentResult: StoryResult.success,
};
