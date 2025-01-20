import { OdsLink } from '@ovhcloud/ods-components/react';
import Link from '@/components/links/Link.component';
import { StoryResult } from '../Stories';

export default {
  story: 'Internal link',
  customComponentExemple: <Link to="./../new">Go to create database</Link>,
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <OdsLink
      href="https://www.ovh.com/manager/#/public-cloud/pci/projects/20136306ffd44e35861f5697e025992a/databases-analytics/operational/services/new"
      label="Go to create database"
    />
  ),
  ODSComponentResult: StoryResult.warning,
};
