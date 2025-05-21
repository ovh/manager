import React from 'react';
import { StoryObj } from '@storybook/react';
import { TagsModal } from '../../../../../manager-react-components/src/components/tags-modal/tags-modal.component';

const managerTagsModal = {
  title: 'Manager React Components/Components/TagsModal',
  component: TagsModal,
};

type Story = StoryObj<typeof managerTagsModal>;

export const DemoTagsModal: Story = {
  args: {
    isOpen: true,
    displayName: 'tags-stories',
    tags: {},
    displayInternalTags: false,
    onCancel: () => {},
    onEditTags: () => {},
  },
};

export default managerTagsModal;
