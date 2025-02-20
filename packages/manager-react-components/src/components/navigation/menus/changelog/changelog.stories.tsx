import React from 'react';
import { Meta } from '@storybook/react';
import {
  ChangelogButton,
  ChangelogLinks,
  ChangelogButtonProps,
} from './changelog.component';

const changelogChapters: string[] = ['baremetal', 'server', 'dedicated'];
const changelogLinks: ChangelogLinks = {
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
  'feature-request':
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
};

export const changelogButton: ChangelogButtonProps = {
  links: changelogLinks,
  chapters: changelogChapters,
};

const meta: Meta<ChangelogButtonProps> = {
  title: 'Navigation/Menus',
  decorators: [(story) => <div>{story()}</div>],
  component: ChangelogButton,
  argTypes: {},
  args: changelogButton,
};

export default meta;
