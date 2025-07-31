/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { setupAllMocks } from '@/data/__mocks__';
import VoucherLink from './VoucherLink.component';

setupAllMocks();

describe('VoucherLink', () => {
  it('renders voucher link with project id', async () => {
    render(<VoucherLink projectId="123" />);
    const link = screen.getByTestId('ods-link');
    expect(link).toHaveAttribute(
      'href',
      '/public-cloud/pci/projects/123/billing/credits',
    );
  });

  it('renders voucher link with different project id', async () => {
    render(<VoucherLink projectId="456" />);
    const link = screen.getByTestId('ods-link');
    expect(link).toHaveAttribute(
      'href',
      '/public-cloud/pci/projects/456/billing/credits',
    );
  });
});
