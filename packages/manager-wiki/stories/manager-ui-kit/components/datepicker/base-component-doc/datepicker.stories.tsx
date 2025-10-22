import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import {
  Datepicker,
  DatepickerContent,
  DatepickerControl,
  type DatepickerControlProp,
  type DatepickerProp,
  FormField,
  FormFieldHelper,
  FormFieldLabel,
  INPUT_I18N,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import {
  excludeFromDemoControls,
  orderControls,
} from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';

type Story = StoryObj<DatepickerProp>;
type DemoArg = Partial<DatepickerProp> & Partial<DatepickerControlProp>;

const meta: Meta<DatepickerProp> = {
  argTypes: excludeFromDemoControls(['dateFormatter', 'defaultOpen', 'defaultValue', 'defaultView', 'disabledDates', 'disabledWeekDays', 'i18n', 'max', 'maxView', 'min', 'minView', 'name', 'onValueChange', 'open', 'required', 'value', 'view']),
  component: Datepicker,
  subcomponents: { DatepickerContent, DatepickerControl },
  title: 'Manager UI Kit/Components/Datepicker/Base',
};

export default meta;

export const Demo: StoryObj = {
  render: (arg: DemoArg) => (
    <Datepicker
      disabled={ arg.disabled }
      invalid={ arg.invalid }
      locale={ arg.locale }
      placeholder={ arg.placeholder }
      readOnly={ arg. readOnly }>
      <DatepickerControl
        clearable={ arg.clearable }
        loading={ arg.loading } />

      <DatepickerContent />
    </Datepicker>
  ),
  argTypes: orderControls({
    clearable: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'boolean' },
      },
      control: { type: 'boolean' },
    },
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
      control: { type: 'boolean' },
    },
    loading: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'boolean' },
      },
      control: { type: 'boolean' },
    },
    locale: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'iso code' },
      },
      control: { type: 'select' },
      options: ['de', 'en', 'es', 'fr', 'it', 'nl', 'pl', 'pt'],
    },
    placeholder: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'text',
    },
    readOnly: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: { type: 'boolean' },
    },
  }),
};

export const DateFormatter: Story = {
  globals: {
    imports: `import { Datepicker, DatepickerContent, DatepickerControl } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Datepicker
      dateFormatter={ ({ date }) => `${date.getFullYear()}` }
      placeholder="yyyy">
      <DatepickerControl />

      <DatepickerContent />
    </Datepicker>
  ),
};

export const Default: Story = {
  globals: {
    imports: `import { Datepicker, DatepickerContent, DatepickerControl } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Datepicker>
      <DatepickerControl />

      <DatepickerContent />
    </Datepicker>
  ),
};

export const Disabled: Story = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'column', gap: '8px' }}>{ story() }</div>],
  globals: {
    imports: `import { Datepicker, DatepickerContent, DatepickerControl } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <p>Disabled:</p>

      <Datepicker disabled>
        <DatepickerControl />

        <DatepickerContent />
      </Datepicker>

      <p>Disabled Dates:</p>

      <Datepicker disabledDates={ [new Date(Date.now() - 86400000), new Date(), new Date(Date.now() + 86400000)] }>
        <DatepickerControl />

        <DatepickerContent />
      </Datepicker>

      <p>Disabled Week Days:</p>

      <Datepicker disabledWeekDays={ [0, 3] }>
        <DatepickerControl />

        <DatepickerContent />
      </Datepicker>
    </>
  ),
};

export const InFormField: Story = {
  globals: {
    imports: `import { Datepicker, DatepickerContent, DatepickerControl, FormField, FormFieldLabel } from '@ovhcloud/ods-react';`,
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
        Label:
      </FormFieldLabel>

      <Datepicker>
        <DatepickerControl />

        <DatepickerContent />
      </Datepicker>
    </FormField>
  ),
};

export const MaxView: Story = {
  globals: {
    imports: `import { Datepicker, DatepickerContent, DatepickerControl } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Datepicker maxView="day">
      <DatepickerControl />

      <DatepickerContent />
    </Datepicker>
  ),
};

export const MinMax: Story = {
  globals: {
    imports: `import { Datepicker, DatepickerContent, DatepickerControl } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Datepicker
      max={ new Date(Date.now() + (86400000 * 10)) }
      min={ new Date(Date.now() - (86400000 * 10)) }>
      <DatepickerControl />

      <DatepickerContent />
    </Datepicker>
  ),
};

export const MinView: Story = {
  globals: {
    imports: `import { Datepicker, DatepickerContent, DatepickerControl } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Datepicker minView="month">
      <DatepickerControl />

      <DatepickerContent />
    </Datepicker>
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
    <Datepicker defaultValue={ new Date() }>
      <DatepickerControl />

      <DatepickerContent />
    </Datepicker>
  ),
};

export const Readonly: Story = {
  globals: {
    imports: `import { Datepicker, DatepickerContent, DatepickerControl } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Datepicker readOnly>
      <DatepickerControl />

      <DatepickerContent />
    </Datepicker>
  ),
};

export const AccessibilityFormField: Story = {
  globals: {
    imports: `import { Datepicker, DatepickerContent, DatepickerControl, FormField, FormFieldLabel } from '@ovhcloud/ods-react';`,
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
        Start date:
      </FormFieldLabel>

      <Datepicker>
        <DatepickerControl />

        <DatepickerContent />
      </Datepicker>
    </FormField>
  )
}

export const AccessibilityDateFormat: Story = {
  globals: {
    imports: `import { TEXT_PRESET, Datepicker, DatepickerContent, DatepickerControl, FormField, FormFieldHelper, FormFieldLabel, Text } from '@ovhcloud/ods-react';`,
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
        Start date:
      </FormFieldLabel>

      <Datepicker>
        <DatepickerControl placeholder="DD-MM-YYYY" />

        <DatepickerContent />
      </Datepicker>

      <FormFieldHelper>
        <Text preset={ TEXT_PRESET.caption }>
          Expected format: DD-MM-YYYY
        </Text>
      </FormFieldHelper>
    </FormField>
  )
}

export const AccessibilityI18n: Story = {
  globals: {
    imports: `import { INPUT_I18N, Datepicker, DatepickerContent, DatepickerControl, FormField, FormFieldLabel } from '@ovhcloud/ods-react';`,
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
        Start date:
      </FormFieldLabel>

      <Datepicker i18n={{
        [INPUT_I18N.clearButton]: 'Clear date'
      }}>
        <DatepickerControl clearable />

        <DatepickerContent />
      </Datepicker>
    </FormField>
  )
}
