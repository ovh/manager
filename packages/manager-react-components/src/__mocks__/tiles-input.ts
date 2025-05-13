export enum LanguagesEnum {
  AR = 'ARABIC',
  FR = 'FRENCH',
  EN = 'ENGLISH',
  MN = 'MANDARIN',
}

export enum ContinentsEnum {
  AFRICA = 'AFRICA',
  EUROPE = 'EUROPE',
  AMERICA = 'AMERICA',
  ASIA = 'ASIA',
}

export type TCountry = {
  name: string;
  continent: ContinentsEnum;
  language: LanguagesEnum;
};

export const countries = [
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
