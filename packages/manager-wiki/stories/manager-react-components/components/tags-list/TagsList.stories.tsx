import React from 'react';
import { StoryObj } from '@storybook/react';
import {
  Message,
  MessageBody,
  MessageIcon,
  MESSAGE_COLOR,
  Text,
} from '@ovhcloud/ods-react';
import { TagsList } from '../../../../../manager-react-components/src/components';

const managerTagsList = {
  title: 'Manager React Components/Components/TagsList',
  component: TagsList,
};

type Story = StoryObj<typeof managerTagsList>;

export const DisplayAllTags: Story = {
  args: {
    tags: {
      key1: 'Lorem ipsum dolor',
      key2: 'Lorem ipsum dolor sit amet',
      key3: 'Lorem ipsum',
      key4: 'Lorem ipsum dolor',
      key5: 'Lorem ipsum dolor sit consectetur',
      key6: 'Lorem ipsum',
      key7: 'Lorem ipsum',
      key8: 'Lorem ipsum',
      key9: 'Lorem ipsum',
      'ovh:key1': 'Lorem ipsum',
      'ovh:key2': 'Lorem ipsum dolor',
    },
    displayInternalTags: true,
    onClick: () => {},
  },
  render: (args) => (
    <div className="max-w-[500px]">
      <TagsList {...args} />
    </div>
  ),
};

export const TagsInSingleLine: Story = {
  args: {
    tags: {
      key1: 'Lorem ',
      key2: 'Lorem ipsum ',
      key3: 'Lor',
      'ovh:key1': 'Lorem ipsum',
      'ovh:key2': 'Lorem ipsum dolor',
    },
    displayInternalTags: false,
    maxLines: 1,
    onClick: () => {},
  },
  render: (args) => (
    <div>
      <div className="max-w-[300px]">
        <TagsList {...args} />
      </div>
      <Message
        className="mt-3"
        color={MESSAGE_COLOR.information}
        dismissible={false}
      >
        <MessageIcon name="circle-info" />
        <MessageBody>
          Use <Text preset="code">maxLines: 1</Text>to display the Tags in
          Single Line. <br /> This mode is often used to display the Tags in
          Datagrid Column.
        </MessageBody>
      </Message>
    </div>
  ),
};

export const TagsInMultipleLines: Story = {
  args: {
    tags: {
      key1: 'Lorem ipsum dolor',
      key2: 'Lorem ipsum dolor sit amet',
      key3: 'Lorem ipsum',
      key4: 'Lorem ipsum dolor',
      key5: 'Lorem ipsum dolor sit consectetur',
      key6: 'Lorem ipsum',
      key7: 'Lorem ipsum',
      key8: 'Lorem ipsum',
      key9: 'Lorem ipsum',
      'ovh:key1': 'Lorem ipsum',
      'ovh:key2': 'Lorem ipsum dolor',
    },
    displayInternalTags: false,
    maxLines: 5,
    onClick: () => {},
  },
  render: (args) => (
    <div>
      <div className="w-[300px]">
        <TagsList {...args} />
      </div>
      <Message
        className="mt-3"
        color={MESSAGE_COLOR.information}
        dismissible={false}
      >
        <MessageIcon name="circle-info" />
        <MessageBody>
          Use <Text preset="code">maxLines: 5</Text>to display the Tags in
          Multiple Lines. <br /> This mode is often used to display the Tags on
          Dashboard Tile.
        </MessageBody>
      </Message>
    </div>
  ),
};

export const OverflowingTags: Story = {
  args: {
    tags: {
      key1: 'Lorem ipsum dolor',
      key2: 'Lorem ipsum consectetur sit amet consectetur',
      key3: 'Lorem ipsum',
      key4: 'Lorem ipsum dolor',
      key5: 'Lorem ipsum dolor sit consectetur',
      key6: 'Lorem ipsumsit amet consectetur adipiscing elit quisque',
      key7: 'Lorem ipsum',
      key8: 'Lorem ipsum',
      key9: 'Lorem ipsum',
      'ovh:key1': 'Lorem ipsum',
      'ovh:key2': 'Lorem ipsum dolor',
    },
    displayInternalTags: false,
    maxLines: 1,
    onClick: () => {},
  },
  render: (args) => (
    <>
      <Text className="font-semibold my-2">Single Tag:</Text>
      <div className="max-w-[200px]">
        <TagsList
          {...args}
          tags={{
            key1:
              'Lorem ipsum dolor sit amet consectetur adipiscing elit quisque',
          }}
        />
      </div>
      <br />
      <Text className="font-semibold my-2">Multiple Tags in Single Line:</Text>
      <div className="max-w-[200px]">
        <TagsList {...args} maxLines={1} />
      </div>
      <br />
      <Text className="font-semibold my-2">Tags in Multiple Lines:</Text>
      <div className="max-w-[300px]">
        <TagsList {...args} maxLines={5} />
      </div>
    </>
  ),
};

export default managerTagsList;
