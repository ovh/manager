import React from 'react';
import { Meta } from '@storybook/react';
import Headers, { HeadersProps } from './headers.component';
import ActionMenu from '../../navigation/menus/action/action.component';
import GuideButton from '../../navigation/menus/guide/guide.component';
import ChangelogButton from '../../navigation/menus/changelog/changelog.component';

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

const changelogItems = [
  {
    id: 1,
    href: 'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
    target: '_blank',
    label: 'Roadmap',
  },
  {
    id: 2,
    href: 'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Baremetal',
    target: '_blank',
    label: 'Changelog',
  },
  {
    id: 3,
    href: 'https://github.com/ovh/infrastructure-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
    target: '_blank',
    label: 'Feature Request',
  },
];

const HeadingWithActionButton: HeadersProps = {
  title: 'Example for header with actions ',
  description: 'description for header',
  headerButton: <ActionMenu id="1" items={actionItems} />,
};
const HeadingWithHeaderButtons: HeadersProps = {
  title: 'Example for header with guides and changelogs',
  description: 'description for subheader',
  headerButton: (
    <>
      <ChangelogButton items={changelogItems} />
      <GuideButton items={guideItems} />
    </>
  ),
};

export const header = () => <Headers {...Heading} />;
export const subHeader = () => <Headers {...SubHeading} />;
export const headerWithHeaderButtons = () => (
  <Headers {...HeadingWithHeaderButtons} />
);
export const headerWithActions = () => <Headers {...HeadingWithActionButton} />;

const meta: Meta = {
  title: 'Content/Headers',
  component: Headers,
  argTypes: {},
  args: Heading,
};

export default meta;
