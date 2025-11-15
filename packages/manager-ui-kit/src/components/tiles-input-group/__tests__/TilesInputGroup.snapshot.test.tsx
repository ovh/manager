import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ContinentsEnum, LanguagesEnum, TCountry, countries } from '@/__mocks__/tiles-input';

import { TilesInputGroupComponent } from '../TilesInputGroup.component';

describe('TilesInputGroup - Snapshot Tests', () => {
  const mockOnInput = vi.fn();

  const defaultLabel = (country: TCountry) => country?.name || '';

  it('should match snapshot with basic props', () => {
    const { container } = render(
      <TilesInputGroupComponent<TCountry>
        items={countries}
        value={null}
        onInput={mockOnInput}
        label={defaultLabel}
      />,
    );
    expect(container).toMatchSnapshot('tiles-input-group-basic');
  });

  it('should match snapshot with selected value', () => {
    const { container } = render(
      <TilesInputGroupComponent<TCountry>
        items={countries}
        value={countries[0] || null}
        onInput={mockOnInput}
        label={defaultLabel}
      />,
    );
    expect(container).toMatchSnapshot('tiles-input-group-with-value');
  });

  it('should match snapshot with tileClass', () => {
    const { container } = render(
      <TilesInputGroupComponent<TCountry>
        items={countries}
        value={null}
        onInput={mockOnInput}
        label={defaultLabel}
        tileClass={{
          active: 'font-bold text-red-500 bg-orange-100',
          inactive: 'text-gray-500',
        }}
      />,
    );
    expect(container).toMatchSnapshot('tiles-input-group-with-tile-class');
  });

  it('should match snapshot with group', () => {
    const { container } = render(
      <TilesInputGroupComponent<TCountry, void, ContinentsEnum>
        items={countries}
        value={null}
        onInput={mockOnInput}
        label={defaultLabel}
        group={{
          by: (country: TCountry) => country.continent,
          label: (continent: ContinentsEnum) => continent,
          showAllTab: true,
        }}
      />,
    );
    expect(container).toMatchSnapshot('tiles-input-group-with-group');
  });

  it('should match snapshot with stack', () => {
    const { container } = render(
      <TilesInputGroupComponent<TCountry, LanguagesEnum>
        items={countries}
        value={null}
        onInput={mockOnInput}
        label={defaultLabel}
        stack={{
          by: (country: TCountry) => country.language,
          label: (language: LanguagesEnum, items: TCountry[]) => `${language} (${items.length})`,
          title: (language: LanguagesEnum, items: TCountry[]) =>
            `Countries of ${language} (${items.length}):`,
        }}
      />,
    );
    expect(container).toMatchSnapshot('tiles-input-group-with-stack');
  });

  it('should match snapshot with group and stack', () => {
    const { container } = render(
      <TilesInputGroupComponent<TCountry, LanguagesEnum, ContinentsEnum>
        items={countries}
        value={null}
        onInput={mockOnInput}
        label={defaultLabel}
        group={{
          by: (country: TCountry) => country.continent,
          label: (continent: ContinentsEnum) => continent,
          showAllTab: true,
        }}
        stack={{
          by: (country: TCountry) => country.language,
          label: (language: LanguagesEnum, items: TCountry[]) => `${language} (${items.length})`,
          title: (language: LanguagesEnum, items: TCountry[]) =>
            `Countries of ${language} (${items.length}):`,
        }}
      />,
    );
    expect(container).toMatchSnapshot('tiles-input-group-with-group-and-stack');
  });
});
