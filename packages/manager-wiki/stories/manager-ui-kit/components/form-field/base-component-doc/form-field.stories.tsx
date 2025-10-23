import {
  FormField,
  FormFieldError,
  FormFieldHelper,
  FormFieldLabel,
  type FormFieldProp,
  Input,
  Text,
  TEXT_PRESET,
  Textarea,
} from '@ovhcloud/ods-react';
import { type Meta, type StoryObj } from '@storybook/react';
import React, { type FormEvent, useState } from 'react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import {
  excludeFromDemoControls,
  orderControls,
} from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';
import docgenMap from '../../../base-documents/constants/ods-docgen-map.json';

type Story = StoryObj<FormFieldProp>;

(FormField as any).__docgenInfo = docgenMap.formField;
(FormFieldError as any).__docgenInfo = docgenMap.formFieldError;
(FormFieldHelper as any).__docgenInfo = docgenMap.formFieldHelper;
(FormFieldLabel as any).__docgenInfo = docgenMap.formFieldLabel;

type DemoArg = Partial<FormFieldProp> & {
  errorText?: string,
  helperText?: string,
  label?: string,
};

const meta: Meta<FormFieldProp> = {
  argTypes: excludeFromDemoControls(['id', 'required']),
  component: FormField,
  subcomponents: { FormFieldError, FormFieldHelper, FormFieldLabel },
  title: 'Manager UI Kit/Components/Form Field/Base',
};

export default meta;

export const Demo: StoryObj = {
  render: (args: DemoArg) => (
    <FormField invalid={ args.invalid }>
      <FormFieldLabel>
        { args.label }
      </FormFieldLabel>

      <Textarea name="demo" />

      <FormFieldHelper>
        { args.helperText }
      </FormFieldHelper>

      <FormFieldError>
        { args.errorText }
      </FormFieldError>
    </FormField>
  ),
  argTypes: orderControls({
    errorText: {
      table: {
        category: CONTROL_CATEGORY.slot,
        type: { summary: 'string' },
      },
      control: 'text',
    },
    helperText: {
      table: {
        category: CONTROL_CATEGORY.slot,
        type: { summary: 'string' },
      },
      control: 'text',
    },
    invalid: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'boolean',
    },
    label: {
      table: {
        category: CONTROL_CATEGORY.slot,
        type: { summary: 'string' },
      },
      control: 'text',
    },
  }),
};

export const Default: Story = {
  globals: {
    imports: `import { FormField, Textarea } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <FormField>
      <Textarea name="textarea" />
    </FormField>
  ),
};

export const Error: Story = {
  globals: {
    imports: `import { FormField, FormFieldError, Textarea } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <FormField invalid>
      <Textarea name="textarea" />

      <FormFieldError>
        Error message
      </FormFieldError>
    </FormField>
  ),
};

export const Helper: Story = {
  globals: {
    imports: `import { TEXT_PRESET, FormField, FormFieldHelper, Text, Textarea } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <FormField>
      <Textarea name="textarea" />

      <FormFieldHelper>
        <Text preset={ TEXT_PRESET.caption }>
          Helper text
        </Text>
      </FormFieldHelper>
    </FormField>
  ),
};

export const Label: Story = {
  globals: {
    imports: `import { FormField, FormFieldLabel, Textarea } from '@ovhcloud/ods-react';`,
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
        Description:
      </FormFieldLabel>

      <Textarea name="textarea" />
    </FormField>
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
  render: ({}) => {
    const MAX_COUNT = 200;
    const [count, setCount] = useState(0);

    function onInput(e: FormEvent): void {
      setCount((e.target as HTMLTextAreaElement).value.length);
    }

    return (
      <FormField invalid={ count > MAX_COUNT }>
        <FormFieldLabel>
          Description:
        </FormFieldLabel>

        <Textarea
          name="description"
          onInput={ onInput } />

        <FormFieldHelper style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text preset={ TEXT_PRESET.caption }>
            Helper text
          </Text>

          <Text preset={ TEXT_PRESET.caption }>
            { count }/{ MAX_COUNT }
          </Text>
        </FormFieldHelper>

        <FormFieldError>
          Error message
        </FormFieldError>
      </FormField>
    );
  },
};

export const AccessibilityLabel: Story = {
  globals: {
    imports: `import { FormField, FormFieldHelper, FormFieldLabel, Input } from '@ovhcloud/ods-react';`,
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
        Login:
      </FormFieldLabel>

      <Input name="input" />

      <FormFieldHelper>
        Username or email address
      </FormFieldHelper>
    </FormField>
  ),
};
