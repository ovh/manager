import React from 'react';
import { describe, expect } from 'vitest';
import EmailAccountsPage from '../EmailAccounts.page';
import { render } from '@/utils/test.provider';

describe('Onboarding Configure EmailAccounts page', () => {
  it('should render correctly', () => {
    const { container } = render(<EmailAccountsPage />);
    expect(container).toBeVisible();
  });
});
