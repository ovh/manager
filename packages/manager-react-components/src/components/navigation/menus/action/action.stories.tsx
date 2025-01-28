import React from 'react';
import { Meta } from '@storybook/react';
import {
  ActionMenu,
  ActionMenuItem,
  ActionMenuProps,
} from './action.component';

const actionItems: ActionMenuItem[] = [
  {
    id: 1,
    href: 'https://www.ovhcloud.com',
    target: '_blank',
    label: 'external link',
  },
  {
    id: 2,
    href: `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({ name: 'john' }),
    )}`,
    download: 'test.json',
    target: '_blank',
    label: 'download',
  },
  {
    id: 3,
    href: 'https://ovhcloud.com',
    target: '_blank',
    label: 'disabled link',
    isDisabled: true,
  },
  {
    id: 4,
    onClick: () => window.open('https://ovhcloud.com', '_blank', 'noopener'),
    label: 'action',
  },
  {
    id: 5,
    onClick: () => window.open('https://ovhcloud.com', '_blank', 'noopener'),
    label: 'action without iam permissions',
    urn: 'urn:v9:eu:resource:manager-react-components:vrz-a878-dsflkds-fdsfsd',
    iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
  },
];

export const actionMenuStandard = {
  args: {
    items: actionItems,
    isCompact: false,
  },
};

const meta: Meta<ActionMenuProps> = {
  decorators: [(story) => <div className="h-52">{story()}</div>],
  title: 'Navigation/Menus',
  component: ActionMenu,
};

export default meta;
