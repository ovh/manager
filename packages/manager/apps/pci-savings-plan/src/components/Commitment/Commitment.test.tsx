import React from 'react';
import { vi, describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Commitment from './Commitment';
import { render } from '@/utils/testProvider';

const defaultProps = {
  duration: 1,
  price: '1',
  hourlyPriceWithoutCommitment: 0.01,
  isActive: false,
  onClick: vi.fn(),
  quantity: 1,
};

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
    expect(screen.getByText('~ 7.20 €')).toBeInTheDocument();
  });

  describe('With a greater quantity', () => {
    it('should return quantity multiply by 10', () => {
      setupSpecTest({ ...defaultProps, quantity: 10 });
      expect(screen.getByText('~ 72.00 €')).toBeInTheDocument();
    });
  });
});
