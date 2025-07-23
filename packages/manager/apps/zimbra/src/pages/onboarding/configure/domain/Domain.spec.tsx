import React from 'react';

import { describe, expect } from 'vitest';

import { render } from '@/utils/test.provider';

import DomainPage from './Domain.page';

describe('Onboarding Configure Domain page', () => {
  it('should render correctly', () => {
    const { container } = render(<DomainPage />);
    expect(container).toBeVisible();
  });
});
