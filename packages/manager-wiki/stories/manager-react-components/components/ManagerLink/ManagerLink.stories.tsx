import { Meta } from '@storybook/react';
import {
  ManagerLink,
  ManagerLinkProps,
} from '@ovh-ux/manager-react-components';
import { IAM_ACTIONS, IAM_URNS } from '../../../../utils/iam.constants';

export const Default = {
  args: {
    id: 'iam-button-urn-action-1',
    label: 'Resiliate Link',
    urn: IAM_URNS.WITH_AUTH,
    iamActions: IAM_ACTIONS,
    isDisplayTooltip: true,
  },
};

const LinkWithAuthorization: Meta<ManagerLinkProps> = {
  title: 'Manager React Components/Components/Manager Link',
  component: ManagerLink,
  parameters: {
    docs: {
      description: {
        component:
          'The `ManagerLink` component is useful when the link depends iam actions. Translation not work in storybook Wait rework storybook and MRC translations.',
      },
    },
  },
};

export const LinkWithoutAuthorization: Meta<ManagerLinkProps> = {
  title: 'Manager React Components/Components/Manager Link',
  component: ManagerLink,
  args: {
    ...Default.args,
    urn: IAM_URNS.WITHOUT_AUTH,
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `ManagerLink` component is used to trigger an action or event.',
      },
    },
  },
};

export default LinkWithAuthorization;
