import { Meta } from '@storybook/react';
import {
  ManagerText,
  ManagerTextProps,
} from '@ovh-ux/manager-react-components';
import { IAM_ACTIONS, IAM_URNS } from '../../../../utils/iam.constants';

export const Default = {
  args: {
    urn: IAM_URNS.WITH_AUTH,
    iamActions: IAM_ACTIONS,
  },
};

function renderComponent(args) {
  return (
    <ManagerText {...args}>
      Confidential information will be displayed only for users with
      authorization. <br />
      For users without authorization, 'HIDDEN' text will be displayed with
      warning message in the tooltip.
    </ManagerText>
  );
}

const TextWithAuthorization: Meta<ManagerTextProps> = {
  title: 'Manager React Components/Components/Manager Text',
  render: renderComponent,
};

export const TextWithoutAuthorization: Meta<ManagerTextProps> = {
  title: 'Manager React Components/Components/Manager Text',
  args: {
    ...Default.args,
    urn: IAM_URNS.WITHOUT_AUTH,
  },
  render: renderComponent,
};

export default TextWithAuthorization;
