import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import {
  FormField,
  FormFieldLabel,
  Timepicker,
  TimepickerControl,
  type TimepickerProp,
  TimepickerTimezoneList,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import {
  excludeFromDemoControls,
  orderControls,
} from '../../../base-documents/helpers/controls';

type Story = StoryObj<TimepickerProp>;
type DemoArg = Partial<TimepickerProp> & {
  withTimezones?: boolean,
}

const meta: Meta<TimepickerProp> = {
  argTypes: excludeFromDemoControls(['defaultValue', 'i18n', 'id', 'locale', 'name', 'onTimezoneChange', 'onValueChange', 'required', 'timezone', 'timezones', 'value']),
  component: Timepicker,
  subcomponents: { TimepickerControl, TimepickerTimezoneList },
  title: 'Manager UI Kit/Components/Timepicker/Base',
};

export default meta;

export const Demo: StoryObj = {
  render: (arg: DemoArg) => (
    <Timepicker
      disabled={ arg.disabled }
      invalid={ arg.invalid }
      readOnly={ arg.readOnly }
      withSeconds={ arg.withSeconds }>
      <TimepickerControl />

      {
        arg.withTimezones &&
        <TimepickerTimezoneList />
      }
    </Timepicker>
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
    readOnly: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'boolean',
    },
    withSeconds: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'boolean' },
      },
      control: 'boolean',
    },
    withTimezones: {
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
    imports: `import { FormField, FormFieldLabel, Timepicker, TimepickerControl, TimepickerTimezoneList } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <FormField>
      <FormFieldLabel>
        Starting time:
      </FormFieldLabel>

      <Timepicker withSeconds>
        <TimepickerControl />

        <TimepickerTimezoneList />
      </Timepicker>
    </FormField>
  ),
};

export const Default: Story = {
  globals: {
    imports: `import { Timepicker, TimepickerControl } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <Timepicker>
      <TimepickerControl />
    </Timepicker>
  ),
};

export const Disabled: Story = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'column', gap: '8px' }}>{ story() }</div>],
  globals: {
    imports: `import { Timepicker, TimepickerControl, TimepickerTimezoneList } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <>
      <Timepicker disabled>
        <TimepickerControl />
      </Timepicker>

      <Timepicker disabled>
        <TimepickerControl />

        <TimepickerTimezoneList />
      </Timepicker>
    </>
  ),
};

export const InFormField: Story = {
  globals: {
    imports: `import { FormField, FormFieldLabel, Timepicker, TimepickerControl, TimepickerTimezoneList } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <FormField>
      <FormFieldLabel>
        Timepicker:
      </FormFieldLabel>

      <Timepicker>
        <TimepickerControl />
      </Timepicker>
    </FormField>
  ),
};

export const Overview: Story = {
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
  },
  render: ({}) => (
    <Timepicker defaultValue="12:00">
      <TimepickerControl />

      <TimepickerTimezoneList />
    </Timepicker>
  ),
};

export const Readonly: Story = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'column', gap: '8px' }}>{ story() }</div>],
  globals: {
    imports: `import { Timepicker, TimepickerControl, TimepickerTimezoneList } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <>
      <Timepicker readOnly>
        <TimepickerControl />
      </Timepicker>

      <Timepicker readOnly>
        <TimepickerControl />

        <TimepickerTimezoneList />
      </Timepicker>
    </>
  ),
};

export const TimezoneList: Story = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'column', gap: '8px' }}>{ story() }</div>],
  globals: {
    imports: `import { Timepicker, TimepickerControl, TimepickerTimezoneList } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <>
      <span>All timezones</span>

      <Timepicker>
        <TimepickerControl />

        <TimepickerTimezoneList />
      </Timepicker>

      <span>Subset of timezone</span>

      <Timepicker timezones={ ['UTC-10', 'UTC+0', 'UTC+10'] }>
        <TimepickerControl />

        <TimepickerTimezoneList />
      </Timepicker>
    </>
  ),
};

export const WithSeconds: Story = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'column', gap: '8px' }}>{ story() }</div>],
  globals: {
    imports: `import { Timepicker, TimepickerControl, TimepickerTimezoneList } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <>
      <Timepicker withSeconds>
        <TimepickerControl />
      </Timepicker>

      <Timepicker withSeconds>
        <TimepickerControl />

        <TimepickerTimezoneList />
      </Timepicker>
    </>
  ),
};
