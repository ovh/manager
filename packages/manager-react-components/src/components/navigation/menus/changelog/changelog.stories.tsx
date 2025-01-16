import React from 'react';
import { Meta } from '@storybook/react';
import { ChangelogButton, ChangelogButtonProps } from './changelog.component';

const changelogItems = [
  {
    id: 1,
    href: 'https://ovh.com',
    target: '_blank',
    labelKey: 'roadmap',
  },
  {
    id: 2,
    href: 'https://ovh.com',
    target: '_blank',
    labelKey: 'changelog',
  },
  {
    id: 3,
    href: 'https://ovh.com',
    target: '_blank',
    labelKey: 'feature-request',
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
