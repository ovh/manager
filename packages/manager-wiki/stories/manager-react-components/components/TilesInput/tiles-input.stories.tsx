import React from 'react';
import { Meta } from '@storybook/react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useArgs } from '@storybook/preview-api';
import { clsx } from 'clsx';
import { TilesInputComponent } from '@ovh-ux/manager-react-components';
import {
  countries as allCountries,
  TCountry,
} from '@ovh-ux/manager-react-components/src/__mocks__/tiles-input';

export default {
  title: 'Manager React Components/Components/TilesInput',
  component: TilesInputComponent,
  parameters: {
    docs: {
      description: {
        component: 'This is an interactive tiles input component.',
      },
    },
  },
} as Meta;

const Template: any = (args) => {
  const [, updateArgs] = useArgs();

  return (
    <TilesInputComponent<TCountry, string, { continent: string; key: string }>
      {...args}
      onInput={(country) => updateArgs({ value: country })}
    />
  );
};

export const DemoSimple = Template.bind({});

const commonArgs = {
  items: allCountries,
  value: undefined,
  label: (country: TCountry) => (
    <OdsText preset="span" className="text-center w-full">
      {country?.name}
    </OdsText>
  ),
  tileClass: {
    active: 'font-bold text-red-500 bg-orange-100',
  },
};

DemoSimple.args = {
  ...commonArgs,
};

export const DemoStack = Template.bind({});

DemoStack.args = {
  ...commonArgs,
  stack: {
    by: (country: TCountry) => country?.language,
    label: (language: string, countries: TCountry[]) => {
      return (
        <OdsText
          preset="span"
          className="text-center w-full"
        >{`${language} (${countries.length})`}</OdsText>
      );
    },
    title: (language: string, countries: TCountry[]) =>
      `Countries of ${language}(${countries.length}):`,
  },
};

export const DemoGroup = Template.bind({});

DemoGroup.args = {
  ...commonArgs,
  group: {
    by: (country: TCountry) => country?.continent,
    label: (group: string) => (
      <div className={clsx('font-bold', 'whitespace-nowrap px-2 text-lg')}>
        <OdsText>{group}</OdsText>
      </div>
    ),
    showAllTab: true,
  },
};

export const DemoGroupStack = Template.bind({});

DemoGroupStack.args = {
  ...commonArgs,
  group: {
    by: (country: TCountry) => country.continent,
    label: (group: string) => (
      <div className={clsx('font-bold', 'whitespace-nowrap px-2 text-lg')}>
        <OdsText>{group}</OdsText>
      </div>
    ),
    showAllTab: true,
  },

  stack: {
    by: (country: TCountry) => country?.language,
    label: (language: string, countries: TCountry[]) => {
      return (
        <OdsText
          preset="span"
          className="text-center w-full"
        >{`${language} (${countries.length})`}</OdsText>
      );
    },
    title: (language: string, countries: TCountry[]) =>
      `Countries of ${language}(${countries.length}):`,
  },
};
