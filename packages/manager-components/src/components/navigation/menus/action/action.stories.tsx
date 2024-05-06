import { Meta } from '@storybook/react';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ActionMenu, ActionMenuProps } from './action.component';

const actionItems = [
  {
    id: 1,
    href: 'https://ovhcloud.com',
    target: OdsHTMLAnchorElementTarget._blank,
    label: 'Action 1',
  },
  {
    id: 2,
    onClick: () => window.open('https://ovhcloud.com', '_blank', 'noopener'),
    label: 'Action 2',
  },
];

export const actionMenu: ActionMenuProps = {
  items: actionItems,
  isCompact: false,
};

const meta: Meta<ActionMenuProps> = {
  title: 'Navigation/Menus',
  component: ActionMenu,
  args: actionMenu,
};

export default meta;
