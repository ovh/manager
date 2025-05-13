import { describe, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import BreadCrumbs from './BreadCrumbs';

vi.mock('react-router-dom', async () => ({
  useMatches: () => {
    return [
      {
        data: 'foo',
        handle: {
          crumb: (i: string) => `crumb-${i}`,
        },
      },
      {
        data: 'bar',
        handle: {
          crumb: (i: string) => `crumb-${i}`,
        },
      },
      {
        data: 'baz',
        handle: {},
      },
    ];
  },
}));

describe('BreadCrumbs component', () => {
  it('should list react router matches', async () => {
    render(<BreadCrumbs />);
    const crumbs = screen.getAllByText(/crumb/);
    expect(crumbs.length).toBe(2);
    expect(crumbs[0].innerHTML).toBe('crumb-foo');
    expect(crumbs[1].innerHTML).toBe('crumb-bar');
  });
});
