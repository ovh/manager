import { Meta } from '@storybook/react';
import {
  ManagerButton,
  ManagerButtonProps,
} from '@ovh-ux/manager-react-components';
import { IAM_URNS, IAM_ACTIONS } from '../../../../utils/iam.constants';

export const Default = {
  args: {
    id: 'iam-button-urn-action-1',
    label: 'Remove button',
    urn: IAM_URNS.WITH_AUTH,
    iamActions: IAM_ACTIONS,
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

export const ButtonWithoutAuthorization: Meta<ManagerButtonProps> = {
  title: 'Manager React Components/Components/Manager Button',
  component: ManagerButton,
  args: {
    ...Default.args,
    urn: IAM_URNS.WITHOUT_AUTH,
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
