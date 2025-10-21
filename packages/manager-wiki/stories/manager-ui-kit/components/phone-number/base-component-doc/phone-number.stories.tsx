import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import {
  FormField,
  FormFieldLabel,
  INPUT_I18N,
  PHONE_NUMBER_COUNTRY_ISO_CODES,
  PhoneNumber,
  PhoneNumberControl,
  type PhoneNumberControlProp,
  PhoneNumberCountryList,
  type PhoneNumberProp,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import {
  excludeFromDemoControls,
  orderControls,
} from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';

type Story = StoryObj<PhoneNumberProp>;
type DemoArg = Partial<PhoneNumberProp> & Partial<PhoneNumberControlProp> & {
  withCountries?: boolean,
};

const meta: Meta<PhoneNumberProp> = {
  argTypes: excludeFromDemoControls(['countries', 'defaultValue', 'i18n', 'id', 'name', 'onCountryChange', 'onValueChange', 'pattern', 'required', 'value']),
  component: PhoneNumber,
  subcomponents: { PhoneNumberControl, PhoneNumberCountryList },
  title: 'Manager UI Kit/Components/Phone Number/Base',
};

export default meta;

export const Demo: StoryObj = {
  render: (arg: DemoArg) => (
    <PhoneNumber
      country={ arg.country }
      disabled={ arg.disabled }
      invalid={ arg.invalid }
      locale={ arg.locale }
      readOnly={ arg.readOnly }>
      {
        arg.withCountries &&
        <PhoneNumberCountryList />
      }

      <PhoneNumberControl clearable={ arg.clearable } />
    </PhoneNumber>
  ),
  argTypes: orderControls({
    clearable: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'boolean' },
      },
      control: 'boolean',
    },
    country: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'PHONE_NUMBER_COUNTRY_ISO_CODE' },
      },
      control: { type: 'select' },
      options: PHONE_NUMBER_COUNTRY_ISO_CODES,
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
      control: 'boolean',
    },
    locale: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: { type: 'select' },
      options: PHONE_NUMBER_COUNTRY_ISO_CODES,
    },
    readOnly: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'boolean',
    },
    withCountries: {
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
    imports: `import { FormField, FormFieldLabel, PhoneNumber, PhoneNumberControl, PhoneNumberCountryList } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <FormField>
      <FormFieldLabel>
        Phone number:
      </FormFieldLabel>

      <PhoneNumber>
        <PhoneNumberCountryList />

        <PhoneNumberControl />
      </PhoneNumber>
    </FormField>
  ),
};

export const Clearable: Story = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'column', gap: '8px' }}>{ story() }</div>],
  globals: {
    imports: `import { PhoneNumber, PhoneNumberControl, PhoneNumberCountryList } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <>
      <PhoneNumber>
        <PhoneNumberControl clearable />
      </PhoneNumber>

      <PhoneNumber>
        <PhoneNumberCountryList />

        <PhoneNumberControl clearable />
      </PhoneNumber>
    </>
  ),
};

export const CountryList: Story = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'column', gap: '8px' }}>{ story() }</div>],
  globals: {
    imports: `import { PhoneNumber, PhoneNumberControl, PhoneNumberCountryList } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <>
      <span>All countries</span>

      <PhoneNumber>
        <PhoneNumberCountryList />

        <PhoneNumberControl />
      </PhoneNumber>

      <span>Subset of countries</span>

      <PhoneNumber countries={ ['de', 'fr', 'gb', 'it'] }>
        <PhoneNumberCountryList />

        <PhoneNumberControl clearable />
      </PhoneNumber>
    </>
  ),
};

export const Default: Story = {
  globals: {
    imports: `import { PhoneNumber, PhoneNumberControl } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <PhoneNumber>
      <PhoneNumberControl />
    </PhoneNumber>
  ),
};

export const Disabled: Story = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'column', gap: '8px' }}>{ story() }</div>],
  globals: {
    imports: `import { PhoneNumber, PhoneNumberControl, PhoneNumberCountryList } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <>
      <PhoneNumber disabled>
        <PhoneNumberControl />
      </PhoneNumber>

      <PhoneNumber disabled>
        <PhoneNumberCountryList />

        <PhoneNumberControl />
      </PhoneNumber>
    </>
  ),
};

export const InFormField: Story = {
  globals: {
    imports: `import { FormField, FormFieldLabel, PhoneNumber, PhoneNumberControl } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <FormField>
      <FormFieldLabel>
        Phone number:
      </FormFieldLabel>

      <PhoneNumber>
        <PhoneNumberControl />
      </PhoneNumber>
    </FormField>
  ),
};

export const Loading: Story = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'column', gap: '8px' }}>{ story() }</div>],
  globals: {
    imports: `import { PhoneNumber, PhoneNumberControl, PhoneNumberCountryList } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <>
      <PhoneNumber>
        <PhoneNumberControl loading />
      </PhoneNumber>

      <PhoneNumber>
        <PhoneNumberCountryList />

        <PhoneNumberControl loading />
      </PhoneNumber>
    </>
  ),
};

export const Locale: Story = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'column', gap: '8px' }}>{ story() }</div>],
  globals: {
    imports: `import { PhoneNumber, PhoneNumberControl, PhoneNumberCountryList } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <>
      <span>Locale "fr"</span>
      <PhoneNumber locale="fr">
        <PhoneNumberCountryList />

        <PhoneNumberControl />
      </PhoneNumber>

      <span>Locale "de"</span>
      <PhoneNumber locale="de">
        <PhoneNumberCountryList />

        <PhoneNumberControl />
      </PhoneNumber>
    </>
  ),
};

export const Overview: Story = {
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
  },
  render: ({}) => (
    <PhoneNumber>
      <PhoneNumberCountryList />

      <PhoneNumberControl />
    </PhoneNumber>
  ),
};

export const Readonly: Story = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'column', gap: '8px' }}>{ story() }</div>],
  globals: {
    imports: `import { PhoneNumber, PhoneNumberControl, PhoneNumberCountryList } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <>
      <PhoneNumber readOnly>
        <PhoneNumberControl />
      </PhoneNumber>

      <PhoneNumber readOnly>
        <PhoneNumberCountryList />

        <PhoneNumberControl />
      </PhoneNumber>
    </>
  ),
};

export const AccessibilityFormField: Story = {
  globals: {
    imports: `import { FormField, FormFieldLabel, PhoneNumber, PhoneNumberControl, PhoneNumberCountryList } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <FormField>
      <FormFieldLabel>
        Phone number:
      </FormFieldLabel>

      <PhoneNumber>
        <PhoneNumberCountryList />

        <PhoneNumberControl />
      </PhoneNumber>
    </FormField>
  ),
};

export const AccessibilityI18n: Story = {
  globals: {
    imports: `import { INPUT_I18N, FormField, FormFieldLabel, PhoneNumber, PhoneNumberControl, PhoneNumberCountryList } from '@ovhcloud/ods-react';`,
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
        Phone number:
      </FormFieldLabel>

      <PhoneNumber
        country="fr"
        defaultValue="06 01 02 03 04"
        i18n={{
          [INPUT_I18N.clearButton]: 'Clear phone number',
        }}>
        <PhoneNumberCountryList />

        <PhoneNumberControl clearable />
      </PhoneNumber>
    </FormField>
  ),
};

