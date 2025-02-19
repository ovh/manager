import { OdsLink } from '@ovhcloud/ods-components/react';
import { ArrowRight } from 'lucide-react';
import Link from '@/components/links/Link.component';
import { StoryResult } from '../Stories';

export default {
  story: 'Tailwind',
  customComponentExemple: (
    <Link
      className="text-orange-100 bg-green-200 hover:bg-green-400 hover:text-red-100"
      to="./../new"
    >
      My text
    </Link>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <OdsLink
      href=""
      label="My text"
      className="text-orange-100 bg-green-200 hover:bg-green-400"
    />
  ),
  ODSComponentResult: StoryResult.fail,
};
