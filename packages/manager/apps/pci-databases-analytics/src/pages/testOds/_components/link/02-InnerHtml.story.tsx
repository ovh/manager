import { OdsLink } from '@ovhcloud/ods-components/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from '@/components/links/Link.component';
import { StoryResult } from '../Stories';

export default {
  story: 'Inner Html',
  customComponentExemple: (
    <Link className="flex flex-row" to="./../new">
      <ArrowRight />
      Mytetext
      <ArrowLeft />
    </Link>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <OdsLink
      href="https://www.ovh.com/manager/#/public-cloud/pci/projects/20136306ffd44e35861f5697e025992a/databases-analytics/operational/services/new"
      label="Mytetext"
      icon="arrow-right"
    />
  ),
  ODSComponentResult: StoryResult.fail,
};
