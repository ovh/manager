import { Meta } from '@storybook/react';
import { ManagerLink, ManagerLinkProps } from './ManagerLink.component';

export const Default = {
  args: {
    id: 'iam-button-urn-action-1',
    label: 'Resiliate Link',
    urn: 'urn:v9:eu:resource:manager-react-components:vrz-a878-dsflkds-fdsfsd',
    iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
    isDisplayTooltip: true,
  },
};

const managerSimpleLink: Meta<ManagerLinkProps> = {
  title: 'Components/Manager Link',
  component: ManagerLink,
  parameters: {
    docs: {
      description: {
        component:
          'The `ManagerLink` component is useful when we link depends iam actions.',
      },
    },
  },
};

export default managerSimpleLink;
