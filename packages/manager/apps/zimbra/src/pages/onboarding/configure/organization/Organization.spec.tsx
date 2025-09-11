import React from 'react';

import { describe, expect } from 'vitest';

import { render } from '@/utils/test.provider';

import OrganizationPage from './Organization.page';

describe('Onboarding Configure Organization page', () => {
  it('should render correctly', () => {
    const { container } = render(<OrganizationPage />);
    expect(container).toBeVisible();
  });
});
