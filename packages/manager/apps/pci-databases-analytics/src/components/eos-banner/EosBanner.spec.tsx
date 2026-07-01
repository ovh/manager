import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as database from '@/types/cloud/project/database';
import { mockedAvailabilities } from '@/__tests__/helpers/mocks/availabilities';
import { isEndOfLifecycle } from '@/lib/availabilitiesHelper';
import EosBanner from './EosBanner.component';

const availabilityWithStatus = (
  status: database.availability.StatusEnum,
): database.Availability => ({
  ...mockedAvailabilities,
  lifecycle: { ...mockedAvailabilities.lifecycle, status },
});

describe('EosBanner', () => {
  it('renders nothing when no availability is provided', () => {
    render(<EosBanner availability={undefined} />);
    expect(screen.queryByTestId('eos-banner')).not.toBeInTheDocument();
  });

  it('renders nothing for a STABLE availability', () => {
    render(
      <EosBanner
        availability={availabilityWithStatus(
          database.availability.StatusEnum.STABLE,
        )}
      />,
    );
    expect(screen.queryByTestId('eos-banner')).not.toBeInTheDocument();
  });

  it('warns for an END_OF_SALE availability', () => {
    render(
      <EosBanner
        availability={availabilityWithStatus(
          database.availability.StatusEnum.END_OF_SALE,
        )}
      />,
    );
    expect(screen.getByTestId('eos-banner')).toBeInTheDocument();
    expect(screen.getByText('endOfSale')).toBeInTheDocument();
  });

  it('warns for an END_OF_LIFE availability', () => {
    render(
      <EosBanner
        availability={availabilityWithStatus(
          database.availability.StatusEnum.END_OF_LIFE,
        )}
      />,
    );
    expect(screen.getByTestId('eos-banner')).toBeInTheDocument();
    expect(screen.getByText('endOfLife')).toBeInTheDocument();
  });

  it('warns for a DEPRECATED availability', () => {
    render(
      <EosBanner
        availability={availabilityWithStatus(
          database.availability.StatusEnum.DEPRECATED,
        )}
      />,
    );
    expect(screen.getByTestId('eos-banner')).toBeInTheDocument();
  });

  it('uses fork-specific wording in the fork context', () => {
    render(
      <EosBanner
        availability={availabilityWithStatus(
          database.availability.StatusEnum.END_OF_LIFE,
        )}
        context="fork"
      />,
    );
    expect(screen.getByText('endOfLifeFork')).toBeInTheDocument();
  });

  it('uses fork end-of-sale wording for a deprecated availability in the fork context', () => {
    render(
      <EosBanner
        availability={availabilityWithStatus(
          database.availability.StatusEnum.END_OF_SALE,
        )}
        context="fork"
      />,
    );
    expect(screen.getByText('endOfSaleFork')).toBeInTheDocument();
  });
});

describe('isEndOfLifecycle', () => {
  it('is false for undefined and STABLE/BETA', () => {
    expect(isEndOfLifecycle(undefined)).toBe(false);
    expect(
      isEndOfLifecycle(
        availabilityWithStatus(database.availability.StatusEnum.STABLE),
      ),
    ).toBe(false);
    expect(
      isEndOfLifecycle(
        availabilityWithStatus(database.availability.StatusEnum.BETA),
      ),
    ).toBe(false);
  });

  it('is true for deprecated / end of sale / end of life', () => {
    expect(
      isEndOfLifecycle(
        availabilityWithStatus(database.availability.StatusEnum.DEPRECATED),
      ),
    ).toBe(true);
    expect(
      isEndOfLifecycle(
        availabilityWithStatus(database.availability.StatusEnum.END_OF_SALE),
      ),
    ).toBe(true);
    expect(
      isEndOfLifecycle(
        availabilityWithStatus(database.availability.StatusEnum.END_OF_LIFE),
      ),
    ).toBe(true);
  });
});
