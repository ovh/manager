import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import {
  FormField,
  FormFieldLabel,
  Input,
  INPUT_I18N,
  INPUT_TYPE,
  INPUT_TYPES,
  type InputProp,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import {
  excludeFromDemoControls,
  orderControls,
} from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';
import docgenMap from '../../../base-documents/constants/ods-docgen-map.json';

type Story = StoryObj<InputProp>;

(Input as any).__docgenInfo = docgenMap.input;

type DemoArg = Partial<InputProp> & {
  masked?: boolean,
};

const meta: Meta<InputProp> = {
  argTypes: excludeFromDemoControls(['i18n', 'locale', 'maskOption', 'onClear']),
  component: Input,
  title: 'Manager UI Kit/Components/Input/Base',
};

export default meta;

export const Demo: StoryObj = {
  render: (arg: DemoArg) => {
    const { masked, ...inputArg } = arg;

    return (
      <Input
        maskOption={{ enable: !!masked }}
        { ...inputArg } />
    )
  },
  argTypes: orderControls({
    clearable: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'boolean',
    },
    disabled: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'boolean' },
      },
      control: 'boolean',
    },
    invalid: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'boolean',
    },
    loading: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'boolean',
    },
    masked: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'boolean' },
      },
      control: 'boolean',
    },
    placeholder: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'string' },
      },
      control: 'text',
    },
    readOnly: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'boolean' },
      },
      control: 'boolean',
    },
    type: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'INPUT_TYPE' }
      },
      control: { type: 'select' },
      options: INPUT_TYPES,
    },
  }),
};

export const Clearable: Story = {
  globals: {
    imports: `import { Input } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Input
      clearable
      defaultValue="Clearable" />
  ),
};

export const Datalist: Story = {
  globals: {
    imports: `import { Input } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <Input list="ice-cream-flavors" />

      <datalist id="ice-cream-flavors">
        <option value="Chocolate"></option>
        <option value="Coconut"></option>
        <option value="Mint"></option>
        <option value="Strawberry"></option>
        <option value="Vanilla"></option>
      </datalist>
    </>
  ),
};

export const Default: Story = {
  globals: {
    imports: `import { Input } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Input />
  ),
};

export const Disabled: Story = {
  globals: {
    imports: `import { Input } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Input disabled />
  ),
};

export const FloatingNumber: Story = {
  globals: {
    imports: `import { INPUT_TYPE, Input } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Input
      defaultValue="9.99"
      step="any"
      type={ INPUT_TYPE.number } />
  ),
};

export const InFormField: Story = {
  globals: {
    imports: `import { FormField, FormFieldLabel, Input } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <FormField>
      <FormFieldLabel>
        Name:
      </FormFieldLabel>

      <Input />
    </FormField>
  ),
};

export const Loading: Story = {
  globals: {
    imports: `import { Input } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Input loading />
  ),
};

export const Masked: Story = {
  globals: {
    imports: `import { Input } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Input maskOption={{ enable: true }} />
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
    <Input placeholder="Input" />
  ),
};

export const ReadOnly: Story = {
  globals: {
    imports: `import { Input } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Input
      defaultValue="Readonly"
      readOnly />
  ),
};

export const Types: Story = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'column', gap: '8px', alignItems: 'start' }}>{ story() }</div>],
  globals: {
    imports: `import { INPUT_TYPE, Input } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <Input type={ INPUT_TYPE.email } placeholder="email" /><br />
      <Input type={ INPUT_TYPE.number } placeholder="number" /><br />
      <Input type={ INPUT_TYPE.password } placeholder="password" /><br />
      <Input type={ INPUT_TYPE.search } placeholder="search" /><br />
      <Input type={ INPUT_TYPE.text } placeholder="text" /><br />
      <Input type={ INPUT_TYPE.time } placeholder="time" /><br />
      <Input type={ INPUT_TYPE.url } placeholder="url" /><br />
    </>
  ),
};

export const AccessibilityFormField: Story = {
  globals: {
    imports: `import { FormField, FormFieldLabel, Input } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <FormField>
      <FormFieldLabel>
        Name:
      </FormFieldLabel>

      <Input />
    </FormField>
  ),
};

export const AccessibilityI18n: Story = {
  globals: {
    imports: `import { INPUT_I18N, FormField, FormFieldLabel, Input } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <FormField>
      <FormFieldLabel>
        Search:
      </FormFieldLabel>

      <Input
        clearable
        defaultValue="my search"
        i18n={{
          [INPUT_I18N.clearButton]: 'Clear current search',
          [INPUT_I18N.searchButton]: 'Search in database',
        }}
        type='search' />
    </FormField>
  ),
};
