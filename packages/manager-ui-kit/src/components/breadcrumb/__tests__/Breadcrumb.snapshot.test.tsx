import { describe, expect, it } from 'vitest';

import { renderBreadcrumb } from '@/commons/tests-utils/Render.utils';

vi.mock('@/hooks/breadcrumb/useBreadcrumb', () => ({
  useBreadcrumb: vi.fn(({ hideRootLabel }: { hideRootLabel?: boolean }) => [
    { label: 'vRack services', href: '/', hideLabel: hideRootLabel },
    { label: 'vRack service', href: '/:id', hideLabel: false },
    { label: 'vRack service listing', href: '/:id/listing', hideLabel: false },
  ]),
}));

describe('Breadcrumb component - snapshot', () => {
  it('matches snapshot when hideRootLabel is false', () => {
    const { asFragment } = renderBreadcrumb({ hideRootLabel: false });
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot when hideRootLabel is true', () => {
    const { asFragment } = renderBreadcrumb({ hideRootLabel: true });
    expect(asFragment()).toMatchSnapshot();
  });
});
