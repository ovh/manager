import { render, wrapper } from '@/common/utils/test.provider';
import { describe, expect, Mock, vi } from 'vitest';
import { useGetDomainResource } from '@/domain/hooks/data/query';
import ZoneActivatePage from './zoneActivate';
import { serviceInfoDetail } from '@/domain/__mocks__/serviceInfoDetail';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainResource: vi.fn(),
}));

vi.mock('@/domain/components/ZoneOrder/zoneOrderComponent', () => ({
  default: () => <div>Zone Order Component</div>,
}));

describe('ZoneActivatePage', () => {
  it('Render ZoneActivatePage', () => {
    (useGetDomainResource as Mock).mockReturnValue({
      domainResource: serviceInfoDetail,
      isFetchingDomainResource: false,
    });
    const { getByTestId } = render(<ZoneActivatePage />, {
      wrapper,
    });
    expect(getByTestId('order-component')).toBeInTheDocument();
  });
});
