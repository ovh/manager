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
  argTypes: {
    // IAM-related props
    iamActions: {
      description:
        'IAM actions required to enable this button. Used for permission-based access control.',
      control: { type: 'object' },
      table: {
        category: 'IAM Authorization',
      },
    },
    urn: {
      description: 'Uniform Resource Name for IAM authorization check.',
      control: { type: 'text' },
      table: {
        category: 'IAM Authorization',
      },
    },
    displayTooltip: {
      description:
        'Whether to display a tooltip when the button is disabled due to IAM permissions.',
      control: { type: 'boolean' },
      table: {
        category: 'IAM Authorization',
        defaultValue: { summary: 'false' },
      },
    },
    isIamTrigger: {
      description: 'Whether this button triggers IAM authorization checks.',
      control: { type: 'boolean' },
      table: {
        category: 'IAM Authorization',
        defaultValue: { summary: 'false' },
      },
    },
    tooltipPosition: {
      description: 'Position of the tooltip relative to the button.',
      control: { type: 'select' },
      table: {
        category: 'IAM Authorization',
        defaultValue: { summary: 'TOOLTIP_POSITION.top' },
      },
    },
    children: {
      description:
        'The content to display inside the button (text or React elements).',
      control: { type: 'text' },
    },
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
