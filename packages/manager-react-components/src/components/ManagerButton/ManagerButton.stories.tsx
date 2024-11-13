import { Meta } from '@storybook/react';
import { ManagerButton, ManagerButtonProps } from './ManagerButton';

export const Default = {
  args: {
    id: 'iam-button-urn-action-1',
    label: 'Remove button',
    urn: 'urn:v9:eu:resource:manager-react-components:vrz-a878-dsflkds-fdsfsd',
    iamActions: ['vrackServices:apiovh:iam/resource/tag/remove'],
  },
};

const managerSimpleButton: Meta<ManagerButtonProps> = {
  title: 'Components/Manager Button',
  component: ManagerButton,
};

export default managerSimpleButton;
