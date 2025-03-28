import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import BillingSupport from './BillingSupport.component';

describe('BillingSupport component', () => {
  it('renders billing support page', async () => {
    render(<BillingSupport />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('billing-support-container')).toBeTruthy();
  });
});
