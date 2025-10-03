import React from 'react';
import {
  DEFAULT_UNKNOWN_DATE_LABEL,
  FormatDateOptions,
  useFormatDate,
} from '@ovh-ux/manager-react-components';

const FormatDateComponent = ({
  date,
  format,
  invalidDateDisplayLabel,
}: Partial<FormatDateOptions>) => {
  const formatDate = useFormatDate({ invalidDateDisplayLabel });

  return (
    <>
      <strong>Date :</strong> {formatDate({ date, format })}
    </>
  );
};

export const Default = {
  args: {
    date: new Date(),
  },
};

export const CustomFormat = {
  args: {
    date: new Date(),
    format: 'dd/MM/yyyy',
  },
};

export const WithTime = {
  args: {
    date: new Date(),
    format: 'dd/MM/yyyy HH:mm',
  },
};

export const FullDateTime = {
  args: {
    date: new Date(),
    format: 'PPpp',
  },
};

export const UnknownDate = {
  args: {
    date: 'invalid-date',
    invalidDateDisplayLabel: 'Date inconnue',
  },
};

const useFormatDateStories = {
  title: 'Manager React Components/Hooks/useFormatDate',
  component: FormatDateComponent,
  argTypes: {
    invalidDateDisplayLabel: {
      control: 'text',
      value: DEFAULT_UNKNOWN_DATE_LABEL,
      description: 'Label used when the date is invalid or missing.',
      table: {
        defaultValue: { summary: DEFAULT_UNKNOWN_DATE_LABEL },
        type: { summary: 'string' },
      },
    },
    date: {
      control: 'date',
      description: 'Date to format',
      table: {
        defaultValue: { summary: 'undefined' },
        type: { summary: 'date | string' },
      },
    },
    format: {
      control: 'text',
      description:
        'Format of date expected see : https://date-fns.org/docs/format',
      table: {
        defaultValue: { summary: 'PP' },
      },
    },
  },
};

export default useFormatDateStories;
