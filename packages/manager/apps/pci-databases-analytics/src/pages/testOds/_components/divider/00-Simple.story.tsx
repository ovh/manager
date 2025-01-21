/* eslint-disable import/no-extraneous-dependencies */
import { OdsDivider } from '@ovhcloud/ods-components/react';
import { Separator } from '@datatr-ux/uxlib';
import { StoryResult } from '../Stories';

export default {
  story: 'Simple divider',
  customComponentExemple: (
    <>
      <p>before</p>
      <Separator />
      <p>After</p>
    </>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <>
      <p>before</p>
      <OdsDivider />
      <p>After</p>
    </>
  ),
  ODSComponentResult: StoryResult.fail,
};
