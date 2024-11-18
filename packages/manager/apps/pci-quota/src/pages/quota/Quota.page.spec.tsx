import { describe, vi } from 'vitest';
import { render } from '@testing-library/react';
import QuotaPage from './Quota.page';
import { wrapper } from '@/wrapperRenders';
import { useQuotas } from '@/api/hooks/useQuotas';

vi.mock('react-use', () => ({
  useMedia: vi.fn(),
}));
vi.mock('@/api/hooks/useQuotas', async () => {
  const mod = await vi.importActual('@/api/hooks/useQuotas');
  return {
    ...mod,
    useQuotas: vi.fn(),
  };
});
vi.mock('@/api/hooks/useRegions', async () => {
  const mod = await vi.importActual('@/api/hooks/useRegions');
  return {
    ...mod,
    useLocations: vi.fn(() => ({ data: [] })),
  };
});

describe('QuotaPage', () => {
  it('should render with spinner', () => {
    vi.mocked(useQuotas).mockReturnValue({
      quotas: [],
      isPending: true,
    } as never);
    const { container } = render(<QuotaPage />, { wrapper });
    expect(container).toMatchSnapshot();
  });
  it('should render', () => {
    vi.mocked(useQuotas).mockReturnValue({
      quotas: [],
      isPending: false,
    } as never);
    const { container } = render(<QuotaPage />, { wrapper });
    expect(container).toMatchSnapshot();
  });
});
