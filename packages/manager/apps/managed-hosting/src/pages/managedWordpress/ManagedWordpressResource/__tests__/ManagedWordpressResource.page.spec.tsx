import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/tests/test.provider';

import ManagedWordpressResourcePage from '../ManagedWordpressResource.page';

vi.mock('@/hooks/generateUrl/useGenerateUrl', () => ({
  useGenerateUrl: vi.fn((path: string) => path),
}));

vi.mock('@/hooks/overridePage/useOverridePage', () => ({
  useOverridePage: vi.fn().mockReturnValue(false),
}));

describe.skip('ManagedWordpressResourcePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    const { container } = render(<ManagedWordpressResourcePage />, { wrapper });

    expect(container).toBeInTheDocument();
  });

  it('should display breadcrumb', () => {
    render(<ManagedWordpressResourcePage />, { wrapper });
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should hide header when page is overridden', () => {
    vi.doMock('@/hooks/overridePage/useOverridePage', () => ({
      useOverridePage: vi.fn().mockReturnValue(true),
    }));

    render(<ManagedWordpressResourcePage />, { wrapper });

    expect(screen.queryByText('test-service')).not.toBeInTheDocument();
  });
});
