import { Meta } from '@storybook/react';
import {
  ManagerText,
  ManagerTextProps,
} from '@ovh-ux/manager-react-components';

export const Default = {
  args: {
    urn: 'urn:v9:eu:resource:manager-react-components:with-authorization',
    iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
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

const managerText: Meta<ManagerTextProps> = {
  title: 'Manager React Components/Components/Manager Text',
  render: renderComponent,
};

export const textWithoutAuthorization: Meta<ManagerTextProps> = {
  title: 'Manager React Components/Components/Manager Text',
  args: {
    ...Default.args,
    urn: 'urn:v9:eu:resource:manager-react-components:without-authorization',
  },
  render: renderComponent,
};

export default managerText;
