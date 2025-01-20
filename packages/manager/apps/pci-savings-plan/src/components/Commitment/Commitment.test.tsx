import React from 'react';
import { vi, describe, it, expect } from 'vitest';
import * as reactShellClientModule from '@ovh-ux/manager-react-shell-client';
import { screen } from '@testing-library/react';
import Commitment from './Commitment';
import '@testing-library/jest-dom';

import { render } from '@/utils/testProvider';

vi.mock('@ovh-ux/manager-react-components', () => ({
  useCatalogPrice: vi.fn().mockReturnValue({
    getTextPrice: vi.fn().mockReturnValue('€10.00'),
  }),
}));

const defaultProps = {
  duration: 1,
  price: '1',
  hourlyPriceWithoutCommitment: 0.01,
  isActive: false,
  onClick: vi.fn(),
  quantity: 1,
};

const trackingSpy = vi.fn();

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof reactShellClientModule = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({
      trackClick: trackingSpy,
    }),
  };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const mod = await importOriginal<
    typeof import('@ovh-ux/manager-react-components')
  >();

  return {
    ...mod,
    useCatalogPrice: vi
      .fn()
      .mockReturnValue({ getTextPrice: vi.fn().mockReturnValue('€10.00') }),
  };
});

const setupSpecTest = async (props = defaultProps) =>
  render(<Commitment {...props} />);

describe('Commitment', () => {
  it('should render the commitment duration', async () => {
    await setupSpecTest();
    expect(screen.getByText('1 mois')).toBeInTheDocument();
  });

  it('should render the commitment price', async () => {
    await setupSpecTest();
    expect(screen.getByText('- 86 %')).toBeInTheDocument();
  });

  it('should render the hourly price without commitment', () => {
    setupSpecTest();
    expect(screen.getByText('~ €10.00')).toBeInTheDocument();
  });
});
