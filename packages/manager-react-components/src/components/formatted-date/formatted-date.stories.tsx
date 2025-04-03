import React, { useId } from 'react';
import { Meta } from '@storybook/react';
import { FormattedDate } from './FormattedDate';
import { DateFormat } from '../../hooks/date/useFormattedDate';

const date = new Date().toISOString();

export const SimpleExample = () => {
  return <FormattedDate dateString={date} />;
};

export const SimpleExampleWithCompactMode = () => (
  <FormattedDate dateString={date} format={DateFormat.compact} />
);

export const SimpleExampleWithFullDisplayMode = () => (
  <FormattedDate dateString={date} format={DateFormat.fullDisplay} />
);

export const NoDate = () => (
  <FormattedDate dateString={undefined as unknown as string} />
);

export const NoDateWithCustomLabel = () => (
  <FormattedDate
    dateString={undefined as unknown as string}
    unknownDateLabel="-"
  />
);

export const NoDateWithCustomDefaultLocale = () => (
  <FormattedDate dateString={date} defaultLocale="en-GB" />
);

const meta: Meta = {
  title: 'Content/FormattedDate',
  component: FormattedDate,
  argTypes: {
    dateString: {
      description: 'Date to format',
      defaultValue: new Date().toISOString(),
      control: {
        type: 'text',
      },
    },
    unknownDateLabel: {
      description: 'The label used if date or locale is not valid',
      defaultValue: 'N/A',
      control: {
        type: 'text',
      },
    },
    defaultLocale: {
      description: 'Locale in format : IETF BCP 47 language tag',
      defaultValue: 'FR-fr',
      control: {
        type: 'text',
      },
    },
    format: {
      description: 'Format of date predefined',
      defaultValue: 'display',
      control: {
        options: ['compact', 'display', 'fullDisplay'],
      },
    },
  },
  args: {},
};

export default meta;
