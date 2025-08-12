import React from 'react';

import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AppConfig } from '@/App.constants';
import * as breadcrumbHook from '@/hooks/breadcrumb/useBreadcrumb';

import Breadcrumb from './Breadcrumb.component';

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsBreadcrumb: ({ children }: { children: React.ReactNode }) => (
    <nav data-testid="ods-breadcrumb">{children}</nav>
  ),
  // eslint-disable-next-line react/no-multi-comp
  OdsBreadcrumbItem: ({ label, ...props }: { label: string; [k: string]: unknown }) => (
    <span data-testid="ods-breadcrumb-item" data-props={JSON.stringify(props)}>
      {label}
    </span>
  ),
}));

describe('Breadcrumb', () => {
  const useBreadcrumbMock = vi.spyOn(breadcrumbHook, 'useBreadcrumb');

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders breadcrumb items from hook', () => {
    useBreadcrumbMock.mockReturnValue([
      { id: '1', label: 'Home', href: '/' },
      { id: '2', label: 'Page', href: '/page' },
    ]);

    render(<Breadcrumb items={[]} />);

    const items = screen.getAllByTestId('ods-breadcrumb-item');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Home');
    expect(items[1]).toHaveTextContent('Page');

    // Check props forwarded
    expect(items?.[0]?.getAttribute('data-props')).toContain('/');
  });

  it('uses AppConfig.rootLabel when no customRootLabel', () => {
    useBreadcrumbMock.mockImplementation(({ rootLabel }) => [
      {
        id: 'root',
        label: rootLabel,
        href: '',
      },
    ]);

    render(<Breadcrumb items={[]} />);

    expect(useBreadcrumbMock).toHaveBeenCalledWith({
      rootLabel: AppConfig.rootLabel,
      items: [],
    });
    expect(screen.getByTestId('ods-breadcrumb-item')).toHaveTextContent(AppConfig.rootLabel);
  });

  it('overrides rootLabel with customRootLabel', () => {
    useBreadcrumbMock.mockImplementation(({ rootLabel }) => [
      {
        id: 'root',
        label: rootLabel,
        href: '',
      },
    ]);

    render(<Breadcrumb customRootLabel="CustomRoot" items={[]} />);

    expect(useBreadcrumbMock).toHaveBeenCalledWith({
      rootLabel: 'CustomRoot',
      items: [],
    });
    expect(screen.getByTestId('ods-breadcrumb-item')).toHaveTextContent('CustomRoot');
  });
});
