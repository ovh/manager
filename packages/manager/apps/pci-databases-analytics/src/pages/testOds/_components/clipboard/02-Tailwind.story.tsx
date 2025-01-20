import { OdsClipboard } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import Clipboard from './Clipboard';

export default {
  story: 'Tailwind',
  customComponentExemple: (
    <Clipboard
      text="lorem ipsum"
      buttonTooltip="Copier"
      className="bg-orange-200"
    />
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <OdsClipboard value="lorem ipsum" className="bg-orange-200" />
  ),
  ODSComponentResult: StoryResult.fail,
};
