import React from 'react';
import { describe, expect } from 'vitest';
import DomainPage from '../Domain.page';
import { render } from '@/utils/test.provider';

describe('Onboarding Configure Domain page', () => {
  it('should render correctly', () => {
    const { container } = render(<DomainPage />);
    expect(container).toBeVisible();
  });
});
