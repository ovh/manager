import React from 'react';
import { describe, expect } from 'vitest';
import OrganizationPage from '../Organization.page';
import { render } from '@/utils/test.provider';

describe('Onboarding Configure Organization page', () => {
  it('should render correctly', () => {
    const { container } = render(<OrganizationPage />);
    expect(container).toBeVisible();
  });
});
