import { Meta } from '@storybook/react';
import { ActionMenu, ActionMenuProps } from './action.component';

const actionItems = [
  {
    id: 1,
    href: 'https://ovhcloud.com',
    target: '_blank',
    label: 'external link',
    urn: 'urn:v9:eu:resource:manager-react-components:vrz-a878-dsflkds-fdsfsd',
    iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
  },
  {
    id: 2,
    href: `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({ name: 'john' }),
    )}`,
    download: 'test.json',
    target: '_blank',
    label: 'download',
    urn: 'urn:v9:eu:resource:manager-react-components:vrz-a878-dsflkds-fdsfsd',
    iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
  },
  {
    id: 3,
    onClick: () => window.open('https://ovhcloud.com', '_blank', 'noopener'),
    label: 'action disabled',
    urn: 'urn:v9:eu:resource:manager-react-components:vrz-a878-dsflkds-fdsfsd',
    iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
  },
  {
    id: 4,
    onClick: () => window.open('https://ovhcloud.com', '_blank', 'noopener'),
    label: 'action',
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
