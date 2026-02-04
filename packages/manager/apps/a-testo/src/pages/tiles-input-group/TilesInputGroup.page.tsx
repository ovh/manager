import { useState } from 'react';
import { TEXT_PRESET } from '@ovhcloud/ods-react';
import { TilesInputGroupComponent, Text } from '@ovh-ux/muk';
import clsx from 'clsx';

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

const TilesInputGroupPage = () => {
  const [value, setValue] = useState<TCountry | null>(null);
  console.log('TilesInputGroupPage value', value);
  return (
    <div>
      <Text preset={TEXT_PRESET.heading1}>TilesInputGroup</Text>
      {/* <div className="pt-4">
        <Text preset={TEXT_PRESET.heading2}>Simple</Text>
        <TilesInputGroupComponent
          items={allCountries}
          value={value}
          tileClass={{
            active: 'font-bold text-red-500 bg-orange-100',
          }}
          onInput={(country) => setValue(country)}
          label={(country: TCountry) => (
            <Text preset="span" className="text-center w-full">
              {country?.name}
            </Text>
          )}
        />
      </div>*/}
      <div className="pt-4">
        <Text preset={TEXT_PRESET.heading2}>Demo stack</Text>
        <TilesInputGroupComponent
          items={allCountries}
          value={value}
          tileClass={{
            active: 'font-bold text-red-500 bg-orange-100',
          }}
          onInput={(country) => setValue(country)}
          label={(country: TCountry) => (
            <Text preset="span" className="text-center w-full">
              {country?.name}
            </Text>
          )}
          stack={{
            by: (country: TCountry) => country?.language,
            label: (language: string, countries: TCountry[]) => {
              return (
                <Text
                  preset="span"
                  className="text-center w-full"
                >{`${language} (${countries.length})`}</Text>
              );
            },
            title: (language: string, countries: TCountry[]) =>
              `Countries of ${language}(${countries.length}):`,
          }}
        />
      </div>
      {/* <div className="pt-4">
        <Text preset={TEXT_PRESET.heading2}>Demo Group</Text>
        <TilesInputGroupComponent
          items={allCountries}
          value={value}
          tileClass={{
            active: 'font-bold text-red-500 bg-orange-100',
          }}
          onInput={(country) => setValue(country)}
          label={(country: TCountry) => (
            <Text preset="span" className="text-center w-full">
              {country?.name}
            </Text>
          )}
          // stack={{
          //   by: (country: TCountry) => country?.language,
          //   label: (language: string, countries: TCountry[]) => {
          //     return (
          //       <Text
          //         preset="span"
          //         className="text-center w-full"
          //       >{`${language} (${countries.length})`}</Text>
          //     );
          //   },
          //   title: (language: string, countries: TCountry[]) =>
          //     `Countries of ${language}(${countries.length}):`,
          // }}
          group={{
            by: (country: TCountry) => country.continent,
            label: (group: string) => (
              <div
                className={clsx('font-bold', 'whitespace-nowrap px-2 text-lg')}
              >
                <Text>{group}</Text>
              </div>
            ),
            showAllTab: true,
          }}
          stack={{
            by: (country: TCountry) => country?.language,
            label: (language: string, countries: TCountry[]) => {
              return (
                <Text
                  preset="span"
                  className="text-center w-full"
                >{`${language} (${countries.length})`}</Text>
              );
            },
            title: (language: string, countries: TCountry[]) =>
              `Countries of ${language}(${countries.length}):`,
          }}
        />
      </div> */}
    </div>
  );
};

export default TilesInputGroupPage;
