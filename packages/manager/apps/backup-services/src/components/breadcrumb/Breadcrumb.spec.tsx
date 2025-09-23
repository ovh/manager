import React from 'react';

import { render } from '@testing-library/react';
import type { Mock } from 'vitest';

import { AppConfig } from '@/App.constants';
import { useBreadcrumb } from '@/hooks/layout/useBreadcrumb';

import Breadcrumb from './Breadcrumb.component';

// Mock the useBreadcrumb hook
vi.mock('@/hooks/layout/useBreadcrumb', () => ({
  useBreadcrumb: vi.fn(),
}));

describe('Breadcrumb', () => {
  it('renders breadcrumb items from hook', () => {
    (useBreadcrumb as Mock).mockReturnValue([
      { label: 'Home', href: '/' },
      { label: 'Dashboard', href: '/dashboard' },
    ]);

    render(<Breadcrumb items={[]} />);

    expect(document.querySelector('ods-breadcrumb-item[label="Home"]')).toBeTruthy();
    expect(document.querySelector('ods-breadcrumb-item[label="Dashboard"]')).toBeTruthy();
  });

  it('uses customRootLabel if provided', () => {
    (useBreadcrumb as Mock).mockReturnValue([{ label: 'CustomRoot', href: '/' }]);

    render(<Breadcrumb items={[]} customRootLabel="CustomRoot" />);

    expect(document.querySelector('ods-breadcrumb-item[label="CustomRoot"]')).toBeTruthy();
  });

  it('falls back to AppConfig.rootLabel if no customRootLabel', () => {
    (useBreadcrumb as Mock).mockReturnValue([{ label: AppConfig.rootLabel, href: '/' }]);

    render(<Breadcrumb items={[]} />);

    expect(
      document.querySelector(`ods-breadcrumb-item[label="${AppConfig.rootLabel}"]`),
    ).toBeTruthy();
  });
});
