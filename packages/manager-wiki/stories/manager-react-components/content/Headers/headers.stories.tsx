import React from 'react';
import { Meta } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';
import {
  Headers,
  HeadersProps,
  ActionMenu,
  GuideButton,
  ChangelogLinks,
  ChangelogButton,
} from '@ovh-ux/manager-react-components';

const Heading: HeadersProps = {
  title: 'Example for header',
  description: 'description for header',
};
const SubHeading: HeadersProps = {
  subtitle: 'Example for subHeader',
  description: 'description for subheader',
};

const actionItems = [
  {
    id: 1,
    href: 'https://www.ovh.com',
    target: '_blank',
    label: 'Action 1',
  },
  {
    id: 2,
    href: 'https://help.ovhcloud.com/csm/fr-documentation?id=kb_home',
    target: '_blank',
    label: 'Action 2',
  },
];

const guideItems = [
  {
    id: 1,
    href: 'https://www.ovh.com',
    target: '_blank',
    label: 'ovh.com',
  },
  {
    id: 2,
    href: 'https://help.ovhcloud.com/csm/fr-documentation?id=kb_home',
    target: '_blank',
    label: 'Guides OVH',
  },
];

const changelogChapters: string[] = ['baremetal', 'server', 'dedicated'];
const changelogLinks: ChangelogLinks = {
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
  'feature-request':
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
};

const HeadingWithActionButton: HeadersProps = {
  title: 'Example for header with actions ',
  description: 'description for header',
  headerButton: <ActionMenu id="1" items={actionItems} />,
};
const HeadingWithHeaderButtons: HeadersProps = {
  title: 'Example for header with header buttons',
  description: 'description for subheader',
  headerButton: <GuideButton items={guideItems} />,
  changelogButton: (
    <ChangelogButton links={changelogLinks} chapters={changelogChapters} />
  ),
};

export const header = () => <Headers {...Heading} />;
export const subHeader = () => <Headers {...SubHeading} />;
export const headerWithHeaderButtons = () => (
  <Headers {...HeadingWithHeaderButtons} />
);
export const headerWithActions = () => <Headers {...HeadingWithActionButton} />;

const meta: Meta = {
  decorators: [withRouter],
  title: 'Core/manager-react-components/Content/Headers',
  component: Headers,
  argTypes: {},
  args: Heading,
};

export default meta;
