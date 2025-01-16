import React from 'react';
import { Meta } from '@storybook/react';
import {
  ChangelogButton,
  ChangelogButtonProps,
  ChangelogItem,
} from './changelog.component';

const changelogItems: Record<string, ChangelogItem> = {
  roadmap: {
    href: 'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
    chapters: ['baremetal', 'server', 'dedicated'],
  },
  changelog: {
    href: 'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
    chapters: ['baremetal', 'server', 'dedicated'],
  },
  'feature-request': {
    href: 'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
    chapters: ['baremetal', 'server', 'dedicated'],
  },
};

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
