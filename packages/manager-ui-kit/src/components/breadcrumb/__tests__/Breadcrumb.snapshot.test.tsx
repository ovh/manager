import { describe, expect, it } from 'vitest';

import { mockUseBreadcrumb } from '@/commons/tests-utils/Mock.utils';
import { renderBreadcrumb } from '@/commons/tests-utils/Render.utils';

mockUseBreadcrumb();

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
