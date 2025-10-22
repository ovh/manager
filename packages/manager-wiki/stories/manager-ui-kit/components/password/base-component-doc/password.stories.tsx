import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import {
  FormField,
  FormFieldLabel,
  INPUT_I18N,
  Password,
  type PasswordProp,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import {
  excludeFromDemoControls,
  orderControls,
} from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';

type Story = StoryObj<PasswordProp>;

const meta: Meta<PasswordProp> = {
  argTypes: excludeFromDemoControls(['i18n', 'locale', 'maskInitialState', 'onClear']),
  component: Password,
  title: 'Manager UI Kit/Components/Password/Base',
};

export default meta;

export const Demo: Story = {
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
  }),
};

export const AccessibilityLabel: Story = {
  globals: {
    imports: `import { FormField, FormFieldLabel, Password } from '@ovhcloud/ods-react';`,
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
        Password:
      </FormFieldLabel>

      <Password />
    </FormField>
  ),
};

export const Clearable: Story = {
  globals: {
    imports: `import { Password } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Password
      clearable
      defaultValue="Clearable" />
  ),
};

export const Default: Story = {
  globals: {
    imports: `import { Password } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Password />
  ),
};

export const Disabled: Story = {
  globals: {
    imports: `import { Password } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Password disabled />
  ),
};

export const InFormField: Story = {
  globals: {
    imports: `import { FormField, FormFieldLabel, Password } from '@ovhcloud/ods-react';`,
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
        Password:
      </FormFieldLabel>

      <Password />
    </FormField>
  ),
};

export const Loading: Story = {
  globals: {
    imports: `import { Password } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Password loading />
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
    <Password />
  ),
};

export const ReadOnly: Story = {
  globals: {
    imports: `import { Password } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Password
      defaultValue="Readonly"
      readOnly />
  ),
};

export const AccessibilityFormField: Story = {
  globals: {
    imports: `import { FormField, FormFieldLabel, Password } from '@ovhcloud/ods-react';`,
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
        Password:
      </FormFieldLabel>

      <Password />
    </FormField>
  ),
};

export const AccessibilityI18n: Story = {
  globals: {
    imports: `import { INPUT_I18N, FormField, FormFieldLabel, Password } from '@ovhcloud/ods-react';`,
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
        Password:
      </FormFieldLabel>

      <Password i18n={{
        [INPUT_I18N.maskButtonHide]: 'Hide the password',
        [INPUT_I18N.maskButtonShow]: 'Show the password',
      }} />
    </FormField>
  ),
};
