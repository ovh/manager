import { Meta } from '@storybook/react';
import { Button, ButtonProps } from '@ovh-ux/muk';
import { IAM_URNS, IAM_ACTIONS } from '../../../../utils/iam.constants';

export const Default: Meta<ButtonProps> = {
  args: {
    children: 'Remove Button',
  },
};

export const IsLoading: Meta<ButtonProps> = {
  args: {
    children: 'Remove Button',
    loading: true,
  },
};

export const ButtonWithIamAuthorization: Meta<ButtonProps> = {
  args: {
    children: 'Remove button',
    urn: IAM_URNS.WITH_AUTH,
    iamActions: IAM_ACTIONS,
  },
};

export const ButtonWithoutIamAuthorization: Meta<ButtonProps> = {
  args: {
    children: 'Remove button',
    urn: IAM_URNS.WITHOUT_AUTH,
    iamActions: IAM_ACTIONS,
  },
};

const meta = {
  title: 'Manager UI Kit/Components/Button',
  component: Button,
  args: {
    children: 'Remove button',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Button` component is used to trigger an action or event.',
      },
    },
  },
};

export default meta;
