/* eslint-disable import/no-extraneous-dependencies */
import { OdsMessage } from '@ovhcloud/ods-components/react';
import { Info } from 'lucide-react';
import { StoryResult } from '../Stories';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default {
  story: 'Tailwind',
  customComponentExemple: (
    <Alert variant="info" className="bg-pink-400 text-white">
      <Info color="white" className="h-4 w-4 text-white" />
      <AlertTitle className="font-semibold">Information</AlertTitle>
      <AlertDescription>This is a message</AlertDescription>
    </Alert>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <OdsMessage color="information" className="bg-pink-400 text-white">Information message</OdsMessage>
  ),
  ODSComponentResult: StoryResult.fail,
};
