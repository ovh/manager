import { OdsClipboard } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import Clipboard from './Clipboard';

export default {
  story: 'Simple clipboard',
  customComponentExemple: (
    <Clipboard text="lorem ipsum" buttonTooltip="Copier" />
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <OdsClipboard value="lorem ipsum" />,
  ODSComponentResult: StoryResult.success,
};
