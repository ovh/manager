import { type Meta, type StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Tabs, TabList, Tab, TabContent, type TabsProp, type TabsValueChangeEvent } from '@ovhcloud/ods-react';
import { excludeFromDemoControls, orderControls } from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import docgenMap from '../../../base-documents/constants/ods-docgen-map.json';

type Story = StoryObj<TabsProp>;
// type DemoArg = Partial<TabListProp>;

(Tabs as any).__docgenInfo = docgenMap.table;

const meta: Meta<TabsProp> = {
  component: Tabs,
  title: 'Manager UI Kit/Components/Tabs/Base',
};

export default meta;

export const Demo: Story = {
  render: (arg) => (
    <Tabs
      defaultValue='tab1'
      withArrows={ arg.withArrows }>
      <TabList >
        <Tab value="tab1">Tab 1</Tab>
        <Tab value="tab2">Tab 2</Tab>
        <Tab value="tab3">Tab 3</Tab>
        <Tab value="tab4">Tab 4</Tab>
        <Tab value="tab5">Tab 5</Tab>
        <Tab value="tab6">Tab 6</Tab>
      </TabList>

      <TabContent value="tab1">
        <p>Tab 1 Content</p>
      </TabContent>

      <TabContent value="tab2">
        <p>Tab 2 Content</p>
      </TabContent>

      <TabContent value="tab3">
        <p>Tab 3 Content</p>
      </TabContent>

      <TabContent value="tab4">
        <p>Tab 4 Content</p>
      </TabContent>

      <TabContent value="tab5">
        <p>Tab 5 Content</p>
      </TabContent>

      <TabContent value="tab6">
        <p>Tab 6 Content</p>
      </TabContent>
    </Tabs>
  ),
  argTypes: orderControls({
    withArrows: {
      table: {
        category: CONTROL_CATEGORY.design,
      },
      control: { type: 'boolean' },
    },
  }),
}

export const Overview: Story = {
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
  },
  render: ({}) => (
    <Tabs defaultValue="tab1">
      <TabList>
        <Tab value="tab1">Tab 1</Tab>
        <Tab value="tab2">Tab 2</Tab>
        <Tab value="tab3">Tab 3</Tab>
      </TabList>
    </Tabs>
  ),
};

export const Controlled: Story = {
  globals: {
    imports: `import { Tabs, TabList, Tab } from '@ovhcloud/ods-react';
import { useState } from 'react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => {
    const [value, setValue] = useState('tab1');

    const handleValueChange = (event: TabsValueChangeEvent) => {
      setValue(event.value);
    };

    return (
      <Tabs
        onValueChange={ handleValueChange }
        value={ value }>
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
          <Tab value="tab3">Tab 3</Tab>
        </TabList>
      </Tabs>
    );
  },
};

export const Default: Story = {
  globals: {
    imports: `import { Tabs, TabList, Tab } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <Tabs defaultValue='tab1'>
      <TabList>
        <Tab value="tab1">Tab 1</Tab>
        <Tab value="tab2">Tab 2</Tab>
        <Tab value="tab3">Tab 3</Tab>
      </TabList>
    </Tabs>
  ),
};

export const Disabled: Story = {
  globals: {
    imports: `import { Tabs, TabList, Tab } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <Tabs defaultValue="tab1">
      <TabList>
        <Tab value="tab1">Tab 1</Tab>
        <Tab value="tab2" disabled>Tab 2</Tab>
        <Tab value="tab3">Tab 3</Tab>
      </TabList>
    </Tabs>
  ),
};

export const Overflow: Story = {
  globals: {
    imports: `import { Tabs, TabList, Tab } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <div style={{ width: '300px' }}>
      <Tabs defaultValue="tab1">
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
          <Tab value="tab3">Tab 3</Tab>
          <Tab value="tab4">Tab 4</Tab>
          <Tab value="tab5">Tab 5</Tab>
          <Tab value="tab6">Tab 6</Tab>
        </TabList>
      </Tabs>
    </div>
  ),
};

export const WithArrows: Story = {
  globals: {
    imports: `import { Tabs, TabList, Tab } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <Tabs
      defaultValue="tab1"
      withArrows>
      <TabList>
        <Tab value="tab1">Tab 1</Tab>
        <Tab value="tab2">Tab 2</Tab>
        <Tab value="tab3">Tab 3</Tab>
        <Tab value="tab4">Tab 4</Tab>
        <Tab value="tab5">Tab 5</Tab>
        <Tab value="tab6">Tab 6</Tab>
        <Tab value="tab7">Tab 7</Tab>
        <Tab value="tab8">Tab 8</Tab>
        <Tab value="tab9">Tab 9</Tab>
        <Tab value="tab10">Tab 10</Tab>
        <Tab value="tab11">Tab 11</Tab>
        <Tab value="tab12">Tab 12</Tab>
        <Tab value="tab13">Tab 13</Tab>
        <Tab value="tab14">Tab 14</Tab>
        <Tab value="tab15">Tab 15</Tab>
      </TabList>
    </Tabs>
  ),
};

export const WithContent: Story = {
  globals: {
    imports: `import { Tabs, TabContent, TabList, Tab } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <Tabs defaultValue="tab1">
      <TabList>
        <Tab value="tab1">Tab 1</Tab>
        <Tab value="tab2">Tab 2</Tab>
        <Tab value="tab3">Tab 3</Tab>
      </TabList>
      <TabContent value="tab1">
        <p>Content 1</p>
      </TabContent>
      <TabContent value="tab2">
        <p>Content 2</p>
      </TabContent>
      <TabContent value="tab3">
        <p>Content 3</p>
      </TabContent>
    </Tabs>
  ),
};
