import { describe, vi } from 'vitest';
import { act, render } from '@testing-library/react';
import { TileInputComponent } from './TileInput.component';

type TProps<T, S = void, G = void> = {
  value: T;
  items: T[];
  label: (item: T) => string;
  stack?: {
    by: (item: T) => S;
    label: (items: T) => string;
    title: string;
  };
  group?: {
    by: (item: T) => G;
    label: (items: T[]) => string;
    showAllTab: boolean;
  };
  onInput: (value: T) => void;
};

enum LanguagesEnum {
  AR = 'AR',
  FR = 'FR',
  EN = 'EN',
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

const countries: TCountry[] = [
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
];

const renderInput = (props: TProps<TCountry>) =>
  render(<TileInputComponent {...props} />);

const props: TProps<TCountry> = {
  value: undefined,
  items: countries,
  label: (country: TCountry) => `${country.name}`,
  onInput: () => vi.fn(),
};

describe('TileInputComponent', () => {
  it('should select an item on tile click', () => {
    const onInput = vi.fn();

    const { getByTestId } = renderInput({ ...props, onInput });

    act(() => getByTestId(`cta-Morocco`).click());

    expect(onInput).toHaveBeenCalledWith(
      countries.find((country) => country.name === 'Morocco'),
    );
  });

  it('selected tile must have the right style', () => {
    const { getByTestId } = renderInput({
      ...props,
      value: countries.find((country) => country.name === 'Morocco'),
    });

    expect(
      getByTestId(`cta-Morocco`).className.includes(
        'font-bold bg-[--ods-color-blue-100] border-[--ods-color-blue-600]',
      ),
    ).toBeTruthy();
  });
});
