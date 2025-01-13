import React from 'react';
import { Meta } from '@storybook/react';
import { ChangelogButton, ChangelogButtonProps } from './changelog.component';

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

export const changelogButton: ChangelogButtonProps = {
  items: changelogItems,
};

const meta: Meta<ChangelogButtonProps> = {
  title: 'Navigation/Menus',
  decorators: [(story) => <div>{story()}</div>],
  component: ChangelogButton,
  argTypes: {},
  args: changelogButton,
};

export default meta;
