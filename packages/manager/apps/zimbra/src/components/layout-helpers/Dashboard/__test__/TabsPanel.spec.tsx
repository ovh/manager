import React from 'react';
import { describe, expect, vi } from 'vitest';
import { useLocation } from 'react-router-dom';
import { render, waitFor } from '@/utils/test.provider';
import TabsPanel from '../TabsPanel';

const tabs = [
  {
    name: '1',
    title: '1',
    to: '/1',
    pathMatchers: [/1/],
  },
  {
    name: '2',
    title: '2',
    to: '/2',
    pathMatchers: [/2/],
  },
];

describe('TabsPanel component', () => {
  it('should render correctly with first tab active', async () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/1',
      search: '',
      hash: '',
      key: '',
      state: '',
    });

    const { getByText, container } = render(<TabsPanel tabs={tabs} />);

    expect(container).toBeVisible();

    const link1 = getByText('1');
    const link2 = getByText('2');

    await waitFor(async () => {
      expect(link1).toHaveAttribute('active', '');
    });

    expect(link2).not.toHaveAttribute('active', '');
  });

  it('should render correctly with second tab active', async () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/2',
      search: '',
      hash: '',
      key: '',
      state: '',
    });

    const { getByText, container } = render(<TabsPanel tabs={tabs} />);

    expect(container).toBeVisible();

    const link1 = getByText('1');
    const link2 = getByText('2');

    await waitFor(async () => {
      expect(link2).toHaveAttribute('active', '');
    });

    expect(link1).not.toHaveAttribute('active', '');
  });
});
