import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import {
  FormField,
  FormFieldLabel,
  Quantity,
  QuantityControl,
  QuantityInput,
  type QuantityInputProp,
  type QuantityProp,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import {
  excludeFromDemoControls,
  orderControls,
} from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';

type Story = StoryObj<QuantityProp>;
type DemoArg = Partial<QuantityProp> & Partial<QuantityInputProp> & {};

const meta: Meta<QuantityProp> = {
  argTypes: excludeFromDemoControls(['defaultValue', 'name', 'onValueChange', 'required', 'value']),
  component: Quantity,
  subcomponents: { QuantityControl, QuantityInput },
  title: 'Manager UI Kit/Components/Quantity/Base',
};

export default meta;

export const Demo: StoryObj = {
  render: (arg: DemoArg) => (
    <Quantity
      disabled={ arg.disabled }
      invalid={ arg.invalid }
      max={ arg.max }
      min={ arg.min }
      readOnly={ arg.readOnly }
      step={ arg.step }>
      <QuantityControl>
        <QuantityInput placeholder={ arg.placeholder } />
      </QuantityControl>
    </Quantity>
  ),
  argTypes: orderControls({
    disabled: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: { type: 'boolean' },
    },
    invalid: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'boolean',
    },
    max: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: { type: 'number' },
    },
    min: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: { type: 'number' },
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
      },
      control: 'boolean',
    },
    step: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: { type: 'number' },
    },
  }),
};

export const AccessibilityLabel: Story = {
  globals: {
    imports: `import { FormField, FormFieldLabel, Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';`,
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
        Number of CPUs:
      </FormFieldLabel>

      <Quantity
        max={ 10 }
        min={ 0 }>
        <QuantityControl>
          <QuantityInput />
        </QuantityControl>
      </Quantity>
    </FormField>
  ),
};

export const Default: Story = {
  globals: {
    imports: `import { Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Quantity>
      <QuantityControl>
        <QuantityInput />
      </QuantityControl>
    </Quantity>
  ),
};

export const Disabled: Story = {
  globals: {
    imports: `import { Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Quantity disabled>
      <QuantityControl>
        <QuantityInput />
      </QuantityControl>
    </Quantity>
  ),
};

export const InFormField: Story = {
  globals: {
    imports: `import { FormField, FormFieldLabel, Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';`,
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
        Set a quantity:
      </FormFieldLabel>

      <Quantity>
        <QuantityControl>
          <QuantityInput />
        </QuantityControl>
      </Quantity>
    </FormField>
  ),
};

export const Max: Story = {
  globals: {
    imports: `import { Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Quantity max={ 10 }>
      <QuantityControl>
        <QuantityInput />
      </QuantityControl>
    </Quantity>
  ),
};

export const Min: Story = {
  globals: {
    imports: `import { Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Quantity min={ 0 }>
      <QuantityControl>
        <QuantityInput />
      </QuantityControl>
    </Quantity>
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
    <Quantity
      defaultValue="0"
      min={ 0 }>
      <QuantityControl>
        <QuantityInput />
      </QuantityControl>
    </Quantity>
  ),
};

export const Readonly: Story = {
  globals: {
    imports: `import { Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Quantity readOnly>
      <QuantityControl>
        <QuantityInput />
      </QuantityControl>
    </Quantity>
  ),
};

export const Step: Story = {
  globals: {
    imports: `import { Quantity, QuantityControl, QuantityInput } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Quantity step={ 10 }>
      <QuantityControl>
        <QuantityInput />
      </QuantityControl>
    </Quantity>
  ),
};
