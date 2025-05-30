import { Meta } from '@storybook/react';
import {
  ManagerButton,
  ManagerButtonProps,
} from '@ovh-ux/manager-react-components';

export const Default = {
  args: {
    id: 'iam-button-urn-action-1',
    label: 'Remove button',
    urn: 'urn:v9:eu:resource:manager-react-components:with-authorization',
    iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
  },
};

const ButtonWithAuthorization: Meta<ManagerButtonProps> = {
  title: 'Manager React Components/Components/Manager Button',
  component: ManagerButton,
  parameters: {
    docs: {
      description: {
        component:
          'The `ManagerButton` component is used to trigger an action or event.',
      },
    },
  },
};

export const ButtonWithUnauthorization: Meta<ManagerButtonProps> = {
  title: 'Manager React Components/Components/Manager Button',
  component: ManagerButton,
  args: {
    ...Default.args,
    urn: 'urn:v9:eu:resource:manager-react-components:without-authorization',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `ManagerButton` component is used to trigger an action or event.',
      },
    },
  },
};

export default ButtonWithAuthorization;
