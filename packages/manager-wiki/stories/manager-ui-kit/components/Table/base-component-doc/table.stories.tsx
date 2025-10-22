import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import {
  Table,
  TABLE_SIZE,
  TABLE_SIZES,
  TABLE_VARIANT,
  TABLE_VARIANTS,
  type TableProp,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import { orderControls } from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';

type Story = StoryObj<TableProp>;

const meta: Meta<TableProp> = {
  component: Table,
  title: 'Manager UI Kit/Components/Table/Base',
};

export default meta;

export const Demo: Story = {
  render: (prop) => (
    <Table { ...prop }>
      <caption>
        Front-end web developer course 2021
      </caption>
      <thead>
      <tr>
        <th scope="col">Person</th>
        <th scope="col">Most interest in</th>
        <th scope="col">Age</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th scope="row">Chris</th>
        <td>HTML tables</td>
        <td>22</td>
      </tr>
      <tr>
        <th scope="row">Dennis</th>
        <td>Web accessibility</td>
        <td>45</td>
      </tr>
      <tr>
        <th scope="row">Sarah</th>
        <td>JavaScript frameworks</td>
        <td>29</td>
      </tr>
      <tr>
        <th scope="row">Karen</th>
        <td>Web performance</td>
        <td>36</td>
      </tr>
      </tbody>
    </Table>
  ),
  argTypes: orderControls({
    size: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: { summary: 'TABLE_SIZE' }
      },
      control: { type: 'select' },
      options: TABLE_SIZES,
    },
    variant: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: { summary: 'TABLE_VARIANT' }
      },
      control: { type: 'select' },
      options: TABLE_VARIANTS,
    },
  }),
};

export const CustomCaption: Story = {
  globals: {
    imports: `import { TEXT_PRESET, Table, Text } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Table>
      <caption>
        <Text preset={ TEXT_PRESET.caption }>
          Front-end web developer course 2021
        </Text>
      </caption>
      <thead>
      <tr>
        <th scope="col">Person</th>
        <th scope="col">Most interest in</th>
        <th scope="col">Age</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th scope="row">Chris</th>
        <td>HTML tables</td>
        <td>22</td>
      </tr>
      <tr>
        <th scope="row">Dennis</th>
        <td>Web accessibility</td>
        <td>45</td>
      </tr>
      <tr>
        <th scope="row">Sarah</th>
        <td>JavaScript frameworks</td>
        <td>29</td>
      </tr>
      <tr>
        <th scope="row">Karen</th>
        <td>Web performance</td>
        <td>36</td>
      </tr>
      </tbody>
    </Table>
  ),
};

export const Default: Story = {
  globals: {
    imports: `import { Table } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Table>
      <caption>
        Front-end web developer course 2021
      </caption>
      <thead>
      <tr>
        <th scope="col">Person</th>
        <th scope="col">Most interest in</th>
        <th scope="col">Age</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th scope="row">Chris</th>
        <td>HTML tables</td>
        <td>22</td>
      </tr>
      <tr>
        <th scope="row">Dennis</th>
        <td>Web accessibility</td>
        <td>45</td>
      </tr>
      <tr>
        <th scope="row">Sarah</th>
        <td>JavaScript frameworks</td>
        <td>29</td>
      </tr>
      <tr>
        <th scope="row">Karen</th>
        <td>Web performance</td>
        <td>36</td>
      </tr>
      </tbody>
    </Table>
  ),
};

export const Overview: Story = {
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Table>
      <caption>
        Front-end web developer course 2021
      </caption>
      <thead>
      <tr>
        <th scope="col">Person</th>
        <th scope="col">Most interest in</th>
        <th scope="col">Age</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th scope="row">Chris</th>
        <td>HTML tables</td>
        <td>22</td>
      </tr>
      <tr>
        <th scope="row">Dennis</th>
        <td>Web accessibility</td>
        <td>45</td>
      </tr>
      <tr>
        <th scope="row">Sarah</th>
        <td>JavaScript frameworks</td>
        <td>29</td>
      </tr>
      <tr>
        <th scope="row">Karen</th>
        <td>Web performance</td>
        <td>36</td>
      </tr>
      </tbody>
    </Table>
  ),
}

export const Size: Story = {
  decorators: [(story) => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      rowGap: '16px',
    }}>
      { story() }
    </div>
  )],
  globals: {
    imports: `import { TABLE_SIZE, Table } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <Table size={ TABLE_SIZE.sm }>
        <caption>
          Front-end web developer course 2021
        </caption>
        <thead>
        <tr>
          <th scope="col">Person</th>
          <th scope="col">Most interest in</th>
          <th scope="col">Age</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th scope="row">Chris</th>
          <td>HTML tables</td>
          <td>22</td>
        </tr>
        <tr>
          <th scope="row">Dennis</th>
          <td>Web accessibility</td>
          <td>45</td>
        </tr>
        <tr>
          <th scope="row">Sarah</th>
          <td>JavaScript frameworks</td>
          <td>29</td>
        </tr>
        <tr>
          <th scope="row">Karen</th>
          <td>Web performance</td>
          <td>36</td>
        </tr>
        </tbody>
      </Table>

      <Table size={ TABLE_SIZE.md }>
        <caption>
          Front-end web developer course 2021
        </caption>
        <thead>
        <tr>
          <th scope="col">Person</th>
          <th scope="col">Most interest in</th>
          <th scope="col">Age</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th scope="row">Chris</th>
          <td>HTML tables</td>
          <td>22</td>
        </tr>
        <tr>
          <th scope="row">Dennis</th>
          <td>Web accessibility</td>
          <td>45</td>
        </tr>
        <tr>
          <th scope="row">Sarah</th>
          <td>JavaScript frameworks</td>
          <td>29</td>
        </tr>
        <tr>
          <th scope="row">Karen</th>
          <td>Web performance</td>
          <td>36</td>
        </tr>
        </tbody>
      </Table>

      <Table size={ TABLE_SIZE.lg }>
        <caption>
          Front-end web developer course 2021
        </caption>
        <thead>
        <tr>
          <th scope="col">Person</th>
          <th scope="col">Most interest in</th>
          <th scope="col">Age</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th scope="row">Chris</th>
          <td>HTML tables</td>
          <td>22</td>
        </tr>
        <tr>
          <th scope="row">Dennis</th>
          <td>Web accessibility</td>
          <td>45</td>
        </tr>
        <tr>
          <th scope="row">Sarah</th>
          <td>JavaScript frameworks</td>
          <td>29</td>
        </tr>
        <tr>
          <th scope="row">Karen</th>
          <td>Web performance</td>
          <td>36</td>
        </tr>
        </tbody>
      </Table>
    </>
  ),
};

export const Variant: Story = {
  decorators: [(story) => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      rowGap: '16px',
    }}>
      { story() }
    </div>
  )],
  globals: {
    imports: `import { TABLE_VARIANT, Table } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <Table variant={ TABLE_VARIANT.default }>
        <caption>
          Front-end web developer course 2021
        </caption>
        <thead>
        <tr>
          <th scope="col">Person</th>
          <th scope="col">Most interest in</th>
          <th scope="col">Age</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th scope="row">Chris</th>
          <td>HTML tables</td>
          <td>22</td>
        </tr>
        <tr>
          <th scope="row">Dennis</th>
          <td>Web accessibility</td>
          <td>45</td>
        </tr>
        <tr>
          <th scope="row">Sarah</th>
          <td>JavaScript frameworks</td>
          <td>29</td>
        </tr>
        <tr>
          <th scope="row">Karen</th>
          <td>Web performance</td>
          <td>36</td>
        </tr>
        </tbody>
      </Table>

      <Table variant={ TABLE_VARIANT.striped }>
        <caption>
          Front-end web developer course 2021
        </caption>
        <thead>
        <tr>
          <th scope="col">Person</th>
          <th scope="col">Most interest in</th>
          <th scope="col">Age</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th scope="row">Chris</th>
          <td>HTML tables</td>
          <td>22</td>
        </tr>
        <tr>
          <th scope="row">Dennis</th>
          <td>Web accessibility</td>
          <td>45</td>
        </tr>
        <tr>
          <th scope="row">Sarah</th>
          <td>JavaScript frameworks</td>
          <td>29</td>
        </tr>
        <tr>
          <th scope="row">Karen</th>
          <td>Web performance</td>
          <td>36</td>
        </tr>
        </tbody>
      </Table>
    </>
  ),
};
