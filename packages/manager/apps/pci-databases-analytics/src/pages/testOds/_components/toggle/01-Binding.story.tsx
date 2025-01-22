/* eslint-disable import/no-extraneous-dependencies */
import { OdsToggle } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import { Switch } from '@/components/ui/switch';

export default {
  story: 'Binding',
  customComponentExemple: <Switch checked={true} />,
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <OdsToggle value={true} name="toggle2" />,
  ODSComponentResult: StoryResult.fail,
};
