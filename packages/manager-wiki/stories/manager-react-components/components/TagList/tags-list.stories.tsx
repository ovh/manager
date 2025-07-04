import React from 'react';
import { StoryObj } from '@storybook/react';
import { TagsList } from '@ovh-ux/manager-react-components';

const managerTagsList = {
  title: 'Manager React Components/Components/TagsList',
  component: TagsList,
};

type Story = StoryObj<typeof managerTagsList>;

export const DemoTagsList: Story = {
  args: {
    tags: {},
    displayInternalTags: false,
    lineNumber: 1,
    onClick: () => {},
  },
};

export default managerTagsList;
