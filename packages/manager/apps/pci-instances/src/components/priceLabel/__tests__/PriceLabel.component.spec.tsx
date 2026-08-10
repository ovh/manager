import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PriceLabel from '../PriceLabel.component';
import { TPriceType } from '@/types/instance/common.type';

vi.mock('@ovh-ux/muk', () => ({
  useCatalogPrice: () => ({
    getFormattedHourlyCatalogPrice: (price: number) => `${price} per hour`,
    getFormattedMonthlyCatalogPrice: (price: number) => `${price} per month`,
  }),
}));

describe.each`
  given                  | type              | expectedPrice
  ${'hourly'}            | ${'hour'}         | ${'42 per hour'}
  ${'monthly'}           | ${'month'}        | ${'42 per month'}
  ${'a licence'}         | ${'licence'}      | ${'42 per hour'}
  ${'a monthly licence'} | ${'licenceMonth'} | ${'42 per month'}
  ${'a local disk'}      | ${'localDisk'}    | ${'42 per hour'}
  ${'a savings plan'}    | ${'savingplans'}  | ${'42 per hour'}
`(
  'given a price billed $given',
  ({ type, expectedPrice }: { type: TPriceType; expectedPrice: string }) => {
    describe('when rendering it', () => {
      beforeEach(() => {
        render(<PriceLabel type={type} value={42} />);
      });

      it('formats it over the period it is billed on', () => {
        expect(screen.getByText(expectedPrice)).toBeInTheDocument();
      });
    });
  },
);
