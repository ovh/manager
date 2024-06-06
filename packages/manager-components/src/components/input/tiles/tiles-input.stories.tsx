import { Meta, Story } from '@storybook/react';

import { useArgs } from '@storybook/client-api';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { clsx } from 'clsx';
import TilesInputComponent from './TilesInput.component';

export default {
  title: 'Components/TilesInput',
  component: TilesInputComponent,
  parameters: {
    docs: {
      description: {
        component: 'This is an interactive tiles input component.',
      },
    },
  },
} as Meta;

enum LanguagesEnum {
  AR = 'ARABIC',
  FR = 'FRENCH',
  EN = 'ENGLISH',
  MN = 'MANDARIN',
}

enum ContinentsEnum {
  AFRICA = 'AFRICA',
  EUROPE = 'EUROPE',
  AMERICA = 'AMERICA',
  ASIA = 'ASIA',
}

type TCountry = {
  name: string;
  continent: ContinentsEnum;
  language: LanguagesEnum;
};

const allCountries = [
  {
    name: 'Morocco',
    continent: ContinentsEnum.AFRICA,
    language: LanguagesEnum.AR,
  },
  {
    name: 'Algeria',
    continent: ContinentsEnum.AFRICA,
    language: LanguagesEnum.AR,
  },
  {
    name: 'Tunisia',
    continent: ContinentsEnum.AFRICA,
    language: LanguagesEnum.AR,
  },
  {
    name: 'Cameron',
    continent: ContinentsEnum.AFRICA,
    language: LanguagesEnum.FR,
  },
  {
    name: 'South Africa',
    continent: ContinentsEnum.AFRICA,
    language: LanguagesEnum.EN,
  },
  {
    name: 'France',
    continent: ContinentsEnum.EUROPE,
    language: LanguagesEnum.FR,
  },
  {
    name: 'Luxembourg',
    continent: ContinentsEnum.EUROPE,
    language: LanguagesEnum.FR,
  },
  {
    name: 'England',
    continent: ContinentsEnum.EUROPE,
    language: LanguagesEnum.EN,
  },
  {
    name: 'Saoudi Arabia',
    continent: ContinentsEnum.ASIA,
    language: LanguagesEnum.AR,
  },
  {
    name: 'Palestine',
    continent: ContinentsEnum.ASIA,
    language: LanguagesEnum.AR,
  },
  {
    name: 'United states',
    continent: ContinentsEnum.AMERICA,
    language: LanguagesEnum.EN,
  },
  {
    name: 'China',
    continent: ContinentsEnum.ASIA,
    language: LanguagesEnum.MN,
  },
];

const Template: Story<any> = (args) => {
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
  label: (country: TCountry) => country?.name,
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
    by: (country: TCountry) => country.language,
    label: (language: string, countries: TCountry[]) => {
      return `${language} (${countries.length})`;
    },
    title: (language: string, countries: TCountry[]) =>
      `Countries of ${language}(${countries.length}):`,
  },
};

export const DemoGroup = Template.bind({});

DemoGroup.args = {
  ...commonArgs,
  group: {
    by: (country: TCountry) => country.continent,
    label: (group: string, countries: TCountry[], selected: boolean) => (
      <OsdsText
        breakSpaces={false}
        size={ODS_THEME_TYPOGRAPHY_SIZE._600}
        color={
          selected
            ? ODS_THEME_COLOR_INTENT.text
            : ODS_THEME_COLOR_INTENT.primary
        }
      >
        <div
          className={clsx(
            selected && 'font-bold',
            'whitespace-nowrap px-2 text-lg',
          )}
        >
          {group === undefined ? 'All countries' : countries[0].continent}
        </div>
      </OsdsText>
    ),
    showAllTab: true,
  },
};

export const DemoGroupStack = Template.bind({});

DemoGroupStack.args = {
  ...commonArgs,
  group: {
    by: (country: TCountry) => country.continent,
    label: (group: string, countries: TCountry[], selected: boolean) => (
      <OsdsText
        breakSpaces={false}
        size={ODS_THEME_TYPOGRAPHY_SIZE._600}
        color={
          selected
            ? ODS_THEME_COLOR_INTENT.text
            : ODS_THEME_COLOR_INTENT.primary
        }
      >
        <div
          className={clsx(
            selected && 'font-bold',
            'whitespace-nowrap px-2 text-lg',
          )}
        >
          {group === undefined ? 'All countries' : countries[0].continent}
        </div>
      </OsdsText>
    ),
    showAllTab: true,
  },
  stack: {
    by: (country: TCountry) => country?.language,
    label: (language: string, countries: TCountry[]) => {
      return `${language} (${countries?.length})`;
    },
    title: (language: string, countries: TCountry[]) =>
      `Countries of ${language}(${countries?.length}):`,
  },
};
