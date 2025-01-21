/* eslint-disable import/no-extraneous-dependencies */
import { OdsDivider } from '@ovhcloud/ods-components/react';
import { Separator } from '@datatr-ux/uxlib';
import { StoryResult } from '../Stories';

export default {
  story: 'Tailwind',
  customComponentExemple: (
    <>
      <p>Before</p>
      <Separator className="bg-red-500" />
      <p>After</p>
    </>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <>
      <p>Before</p>
      <OdsDivider className="bg-red-500" />
      <p>After</p>
    </>
  ),
  ODSComponentResult: StoryResult.fail,
};
