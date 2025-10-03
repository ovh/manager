import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import {
  Price,
  OvhSubsidiary,
  IntervalUnitType,
} from '@ovh-ux/manager-react-components';

const meta = {
  title: 'Manager React Components/Components/Price',
  component: Price,
  parameters: {
    docs: {
      description: {
        component:
          'The Price component displays formatted prices with support for different currencies, tax information, and interval units.',
      },
    },
  },
  argTypes: {
    value: {
      description: 'The price value to display',
      control: 'number',
    },
    tax: {
      description: 'The tax value to display',
      control: 'number',
    },
    intervalUnit: {
      description: 'The interval unit for the price (day, month, year)',
      control: 'select',
      options: Object.values(IntervalUnitType),
    },
    ovhSubsidiary: {
      description: 'The OVH subsidiary to determine price format',
      control: 'select',
      options: Object.values(OvhSubsidiary),
    },
    locale: {
      description: 'The locale for price formatting',
      control: 'text',
    },
    isConvertIntervalUnit: {
      description: 'Whether to convert the price based on interval unit',
      control: 'boolean',
    },
  },
} as Meta<typeof Price>;

export default meta;
type Story = StoryObj<typeof Price>;

// Basic price display
export const Basic: Story = {
  args: {
    value: 3948000000,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR',
  },
};

// Price with tax
export const WithTax: Story = {
  args: {
    value: 3948000000,
    tax: 789600000,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR',
  },
};

// Price with interval
export const WithInterval: Story = {
  args: {
    value: 3948000000,
    intervalUnit: IntervalUnitType.month,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR',
  },
};

// Price with tax and interval
export const WithTaxAndInterval: Story = {
  args: {
    value: 3948000000,
    tax: 789600000,
    intervalUnit: IntervalUnitType.month,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR',
  },
};

// Different subsidiary (US)
export const USFormat: Story = {
  args: {
    value: 3948000000,
    ovhSubsidiary: OvhSubsidiary.US,
    locale: 'en-US',
  },
};

// Different subsidiary (Asia)
export const AsiaFormat: Story = {
  args: {
    value: 3948000000,
    ovhSubsidiary: OvhSubsidiary.ASIA,
    locale: 'en-SG',
  },
};

// Different interval units
export const Daily: Story = {
  args: {
    value: 3948000000,
    intervalUnit: IntervalUnitType.day,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR',
  },
};

export const Monthly: Story = {
  args: {
    value: 3948000000,
    intervalUnit: IntervalUnitType.month,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR',
  },
};

export const Yearly: Story = {
  args: {
    value: 3948000000,
    intervalUnit: IntervalUnitType.year,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR',
  },
};

// With interval conversion
export const WithIntervalConversion: Story = {
  args: {
    value: 3948000000,
    intervalUnit: IntervalUnitType.month,
    isConvertIntervalUnit: true,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR',
  },
};

// Large number example
export const LargeNumber: Story = {
  args: {
    value: 3948000000,
    tax: 789600000,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR',
  },
};

// Complete example with all props
export const Complete: Story = {
  args: {
    value: 3948000000,
    tax: 789600000,
    intervalUnit: IntervalUnitType.month,
    isConvertIntervalUnit: true,
    ovhSubsidiary: OvhSubsidiary.FR,
    locale: 'fr-FR',
  },
};
