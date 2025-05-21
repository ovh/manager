import { Meta } from '@storybook/react';
import {
  ManagerText,
  ManagerTextProps,
} from '@ovh-ux/manager-react-components';

export const Default = {
  args: {
    urn: 'urn:v9:eu:resource:manager-react-components:vrz-a878-dsflkds-fdsfsd',
    iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
  },
};

const managerText: Meta<ManagerTextProps> = {
  title: 'Manager React Components/Components/Manager Text',
  component: ManagerText,
};

export default managerText;
