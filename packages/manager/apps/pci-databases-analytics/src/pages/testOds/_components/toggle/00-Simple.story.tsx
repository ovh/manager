/* eslint-disable import/no-extraneous-dependencies */
import { OdsToggle } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import { Switch } from '@/components/ui/switch';

export default {
  story: 'Simple toggle',
  customComponentExemple: <Switch />,
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <OdsToggle name="toggle1" />,
  ODSComponentResult: StoryResult.success,
};
