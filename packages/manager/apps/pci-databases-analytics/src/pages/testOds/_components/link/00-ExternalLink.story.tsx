import { OdsLink } from '@ovhcloud/ods-components/react';
import Link from '@/components/links/Link.component';
import { StoryResult } from '../Stories';

export default {
  story: 'Simple link',
  customComponentExemple: (
    <Link to="https://google.com" target="_blank">
      Go to google in blank
    </Link>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <OdsLink
      href="https://google.com"
      target="_blank"
      label="Go to google in blank"
    />
  ),
  ODSComponentResult: StoryResult.success,
};
