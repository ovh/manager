import { describe, expect, it } from 'vitest';

import { mockUseBreadcrumb } from '@/commons/tests-utils/Mock.utils';
import { renderBreadcrumb } from '@/commons/tests-utils/Render.utils';

mockUseBreadcrumb();

describe('Breadcrumb component - behavior', () => {
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
