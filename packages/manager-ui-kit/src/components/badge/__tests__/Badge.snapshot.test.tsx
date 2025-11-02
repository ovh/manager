import { describe, expect, it } from 'vitest';

import { renderBadge } from '@/commons/tests-utils/Render.utils';

describe('Badge Snapshot Tests', () => {
  it('matches snapshot for default badge', () => {
    const { container } = renderBadge();
    expect(container).toMatchSnapshot('default-badge');
  });

  it('matches snapshot for loading badge', () => {
    const { container } = renderBadge({ isLoading: true });
    expect(container).toMatchSnapshot('loading-badge');
  });

  it('matches snapshot for success color and large size', () => {
    const { container } = renderBadge({
      color: 'success',
      size: 'lg',
      children: 'Success',
    });
    expect(container).toMatchSnapshot('success-lg-badge');
  });
});
