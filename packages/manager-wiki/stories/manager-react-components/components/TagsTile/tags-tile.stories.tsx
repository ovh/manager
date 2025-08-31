import { StoryObj } from '@storybook/react';
import { TagsTile } from '@ovh-ux/manager-react-components';

const managerTagsTile = {
  title: 'Manager React Components/Components/TagsTile',
  component: TagsTile,
};

type Story = StoryObj<typeof managerTagsTile>;

export const DemoTagsTile: Story = {
  args: {
    tags: {
      Team: 'Support-team',
      check: 'QA',
      scope: 'gaming',
      tarte: 'pomme',
      ttyyy: 'eeee',
      coucou: 'hjola',
      heyhey: 'holahola',
      Project: 'Marketing-campaign',
      location: 'paris',
      Department: 'Finance',
      Environment: 'Production',
      environment: 'production',
      Confidential: 'Confidential',
      'test-coralie2': 'Coralie-valeur2',
      testestestset: '1-1-1',
    },
    displayInternalTags: false,
    lineNumber: 5,
    onEditTags: () => {},
  },
};

export default managerTagsTile;
