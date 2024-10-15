import { Meta } from '@storybook/react';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ActionMenu, ActionMenuProps } from './action.component';

const actionItems = [
  {
    id: 1,
    href: 'https://ovhcloud.com',
    target: OdsHTMLAnchorElementTarget._blank,
    label: 'Action 1',
    urn: 'urn:v9:eu:resource:manager-react-components:vrz-a878-dsflkds-fdsfsd',
    iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
  },
  {
    id: 2,
    onClick: () => window.open('https://ovhcloud.com', '_blank', 'noopener'),
    label: 'Action 2',
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
  title: 'Navigation/Menus',
  component: ActionMenu,
};

export default meta;
