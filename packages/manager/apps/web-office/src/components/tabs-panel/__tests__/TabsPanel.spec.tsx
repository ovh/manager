import { useLocation } from 'react-router-dom';

import { waitFor } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';

import { renderWithRouter } from '@/utils/Test.provider';

import TabsPanel from '../TabsPanel.component';

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
  it.skip('should render correctly with first tab active', async () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/1',
      search: '',
      hash: '',
      key: '',
      state: '',
    });

    const { getByText, container } = renderWithRouter(<TabsPanel tabs={tabs} />);

    expect(container).toBeVisible();

    const link1 = getByText('1');
    const link2 = getByText('2');

    await waitFor(() => {
      expect(link1).toHaveAttribute('is-selected', 'true');
    });

    expect(link2).toHaveAttribute('is-selected', 'false');
  });

  it.skip('should render correctly with second tab active', async () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/2',
      search: '',
      hash: '',
      key: '',
      state: '',
    });

    const { getByText, container } = renderWithRouter(<TabsPanel tabs={tabs} />);

    expect(container).toBeVisible();

    const link1 = getByText('1');
    const link2 = getByText('2');

    await waitFor(() => {
      expect(link2).toHaveAttribute('is-selected', 'true');
    });

    expect(link1).toHaveAttribute('is-selected', 'false');
  });
});

describe('TabsPanel W3C Validation', () => {
  it.skip('should have a valid html', async () => {
    const { container } = renderWithRouter(<TabsPanel tabs={tabs} />);
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});
