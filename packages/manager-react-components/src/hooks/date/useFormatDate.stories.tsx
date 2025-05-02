import { Meta } from '@storybook/react/*';
import React from 'react';
import {
  DEFAULT_UNKNOWN_DATE_LABEL,
  FormatDateOptions,
  useFormatDate,
} from './useFormatDate';

const FormatDateComponent = ({
  date,
  format,
  unknownDateLabel,
  defaultUnknownLabel,
}: Partial<FormatDateOptions & { defaultUnknownLabel: string }>) => {
  const formatDate = useFormatDate({ defaultUnknownLabel });

  return (
    <>
      <strong>Date :</strong> {formatDate({ date, format, unknownDateLabel })}
    </>
  );
};

export const Default = {
  args: {
    date: new Date(),
  },
};

const useFormatDateStories: Meta<
  React.ComponentProps<typeof FormatDateComponent>
> = {
  title: 'Hooks/useFormatDate',
  component: FormatDateComponent,
  argTypes: {
    defaultUnknownLabel: {
      control: 'text',
      value: 'N/A',
      description: 'Label used when the date is invalid or missing.',
      table: {
        defaultValue: { summary: 'N/A' },
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
    unknownDateLabel: {
      control: 'text',
      description:
        'Label used when the date is invalid or missing. (Overwrite `unknownDateLabelDefault`)',
      table: {
        defaultValue: { summary: 'undefined' },
        type: { summary: 'string' },
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
