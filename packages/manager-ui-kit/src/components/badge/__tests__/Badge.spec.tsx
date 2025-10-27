import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderBadge } from '@/commons/tests-utils/Render.utils';

describe('Badge', () => {
  it('renders badge with default props', () => {
    renderBadge();
    const badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Active');
  });

  it('renders custom badge with success color', () => {
    renderBadge({ color: 'success', children: 'OK' });
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('OK');
  });

  it('renders loading state', () => {
    renderBadge({ isLoading: true, 'data-testid': 'skeleton' });
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toBeEmptyDOMElement();
  });
});
