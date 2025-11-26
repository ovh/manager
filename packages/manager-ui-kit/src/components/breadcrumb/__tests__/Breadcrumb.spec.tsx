import { describe, expect, it, vi } from 'vitest';

import { renderBreadcrumb } from '@/commons/tests-utils/Render.utils';

vi.mock('@/hooks/breadcrumb/useBreadcrumb', () => ({
  useBreadcrumb: vi.fn(({ hideRootLabel }: { hideRootLabel?: boolean }) => [
    { label: 'vRack services', href: '/', hideLabel: hideRootLabel },
    { label: 'vRack service', href: '/:id', hideLabel: false },
    { label: 'vRack service listing', href: '/:id/listing', hideLabel: false },
  ]),
}));

describe('Breadcrumb component - behavior', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = renderBreadcrumb({ hideRootLabel: false });
    await expect(container).toBeAccessible();
  });

  it('renders 3 breadcrumb items when hideRootLabel is false', () => {
    const { container } = renderBreadcrumb({ hideRootLabel: false });
    const items = container.querySelectorAll('li');

    expect(items.length).toBe(3);
    items.forEach((item) => expect(item).toBeVisible());
  });

  it('hides root label when hideRootLabel is true', () => {
    const { container } = renderBreadcrumb({ hideRootLabel: true });
    const items = container.querySelectorAll('li');
    expect(items.length).toBe(2);
  });
});
