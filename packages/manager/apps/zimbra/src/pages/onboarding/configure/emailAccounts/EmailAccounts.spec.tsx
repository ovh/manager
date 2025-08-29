import React from 'react';

import { describe, expect } from 'vitest';

import { render } from '@/utils/test.provider';

import EmailAccountsPage from './EmailAccounts.page';

describe('Onboarding Configure EmailAccounts page', () => {
  it('should render correctly', () => {
    const { container } = render(<EmailAccountsPage />);
    expect(container).toBeVisible();
  });
});
