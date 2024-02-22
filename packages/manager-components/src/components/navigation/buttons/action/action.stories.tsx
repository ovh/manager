import React from 'react';
import { Meta } from '@storybook/react';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ActionButton, ActionButtonProps } from './action.component';

const actionItems = [
  {
    id: 1,
    href: 'https://www.ovh.com',
    target: OdsHTMLAnchorElementTarget._blank,
    label: 'Action 1',
  },
  {
    id: 2,
    href: 'https://help.ovhcloud.com/csm/fr-documentation?id=kb_home',
    target: OdsHTMLAnchorElementTarget._blank,
    label: 'Action 2',
  },
];

export const actionButton: ActionButtonProps = {
  items: actionItems,
};

const meta: Meta<ActionButtonProps> = {
  title: 'Navigation/Buttons',
  decorators: [(story) => <div>{story()}</div>],
  component: ActionButton,
  argTypes: {},
  args: actionButton,
};

export default meta;
