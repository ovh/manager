/* eslint-disable import/no-extraneous-dependencies */
import { OdsText } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';

export default {
  story: 'Simple texts',
  customComponentExemple: (
    <div>
      <h1>h1</h1>
      <h2>h2</h2>
      <h3>h3</h3>
      <h4>h4</h4>
      <h5>h4</h5>
      <h6>h6</h6>
      <p>paragraph</p>
      <span>span</span>
    </div>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <div>
      <OdsText preset="heading-1">h1</OdsText>
      <OdsText preset="heading-2">h2</OdsText>
      <OdsText preset="heading-3">h3</OdsText>
      <OdsText preset="heading-4">h4</OdsText>
      <OdsText preset="heading-5">h4</OdsText>
      <OdsText preset="heading-6">h6</OdsText>
      <OdsText preset="span">span</OdsText>
      <OdsText preset="paragraph">paragraph</OdsText>
    </div>
  ),
  ODSComponentResult: StoryResult.warning,
};
