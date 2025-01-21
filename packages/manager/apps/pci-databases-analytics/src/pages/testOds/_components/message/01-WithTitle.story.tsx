/* eslint-disable import/no-extraneous-dependencies */
import { OdsMessage } from '@ovhcloud/ods-components/react';
import { Info } from 'lucide-react';
import { StoryResult } from '../Stories';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default {
  story: 'With title',
  customComponentExemple: (
    <Alert variant="info">
      <Info className="h-4 w-4" />
      <AlertTitle className="font-semibold">Information</AlertTitle>
      <AlertDescription>This is a message</AlertDescription>
    </Alert>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <OdsMessage color="information">Information message</OdsMessage>
  ),
  ODSComponentResult: StoryResult.fail,
};
