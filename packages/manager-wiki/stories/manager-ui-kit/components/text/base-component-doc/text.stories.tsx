import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import {
  Text,
  TEXT_PRESET,
  TEXT_PRESETS,
  type TextProp,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import { orderControls } from '../../../base-documents/helpers/controls';

type Story = StoryObj<TextProp>;

const meta: Meta<TextProp> = {
  component: Text,
  title: 'Manager UI Kit/Components/Text/Base',
};

export default meta;

export const Demo: Story = {
  argTypes: orderControls({
    children: {
      table: {
        category: CONTROL_CATEGORY.slot,
      },
      control: 'text',
    },
    preset: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'TEXT_PRESET' }
      },
      control: { type: 'select' },
      options: TEXT_PRESETS,
    }
  }),
  args: {
    children: 'Lorem ipsum dolor sit amet',
  },
};

export const Default: Story = {
  globals: {
    imports: `import { Text } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <Text>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </Text>
  ),
};

export const FigCaption: Story = {
  globals: {
    imports: `import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <figure>
      <img alt="OVHcloud logo"
           src="https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/ayzwkdawmlyzvuummuf4"
           style={{ height: '100px' }} />

      <figcaption>
        <Text preset={ TEXT_PRESET.caption }>
          My picture title
        </Text>
      </figcaption>
    </figure>
  ),
};

export const Overview: Story = {
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
  },
  render: ({}) => (
    <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
  ),
};

export const Preset: Story = {
  globals: {
    imports: `import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <>
      <Text preset={ TEXT_PRESET.caption }>Caption</Text><br />
      <Text preset={ TEXT_PRESET.code }>Code</Text><br />
      <Text preset={ TEXT_PRESET.label }>Label</Text>
      <Text preset={ TEXT_PRESET.paragraph }>Paragraph</Text>
      <Text preset={ TEXT_PRESET.span }>Span</Text><br />
      <Text preset={ TEXT_PRESET.heading1 }>Heading-1</Text>
      <Text preset={ TEXT_PRESET.heading2 }>Heading-2</Text>
      <Text preset={ TEXT_PRESET.heading3 }>Heading-3</Text>
      <Text preset={ TEXT_PRESET.heading4 }>Heading-4</Text>
      <Text preset={ TEXT_PRESET.heading5 }>Heading-5</Text>
      <Text preset={ TEXT_PRESET.heading6 }>Heading-6</Text>
    </>
  ),
};

export const TableCaption: Story = {
  globals: {
    imports: `import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <table style={{
      border: '2px solid rgb(140 140 140)',
      borderCollapse: 'collapse',
    }}>
      <caption style={{ captionSide: 'bottom' }}>
        <Text preset="caption">
          My table title
        </Text>
      </caption>

      <thead>
      <tr>
        <th scope="col">Person</th>
        <th scope="col">Age</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th scope="row">Chris</th>
        <td>22</td>
      </tr>
      </tbody>
    </table>
  ),
};
