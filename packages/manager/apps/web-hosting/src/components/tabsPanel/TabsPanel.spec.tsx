import React from 'react';

import { useLocation } from 'react-router-dom';

import { describe, expect, vi } from 'vitest';

import { render, waitFor } from '@/utils/test.provider';

import TabsPanel from './TabsPanel.component';

const tabs = [
  {
    name: '1',
    title: '1',
    to: '/1',
    pathMatchers: [/1/],
    trackingName: 'tab-1',
  },
  {
    name: '2',
    title: '2',
    to: '/2',
    pathMatchers: [/2/],
    trackingName: 'tab-2',
  },
];

describe('TabsPanel component', () => {
  it('should render correctly with first tab active', async () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/1',
      search: '',
      hash: '',
      key: '',
      state: null,
    } as ReturnType<typeof useLocation>);

    const { getByText, container } = render(<TabsPanel tabs={tabs} />);

    expect(container).toBeVisible();

    const link1 = getByText('1');
    const link2 = getByText('2');

    await waitFor(() => {
      expect(link1).toHaveAttribute('aria-selected', 'true');
    });
    expect(link2).toHaveAttribute('aria-selected', 'false');
  });

  it('should render correctly with second tab active', async () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/2',
      search: '',
      hash: '',
      key: '',
      state: null,
    } as ReturnType<typeof useLocation>);

    const { getByText, container } = render(<TabsPanel tabs={tabs} />);

    expect(container).toBeVisible();

    const link1 = getByText('1');
    const link2 = getByText('2');

    await waitFor(() => {
      expect(link2).toHaveAttribute('aria-selected', 'true');
    });
    expect(link1).toHaveAttribute('aria-selected', 'false');
  });
});
