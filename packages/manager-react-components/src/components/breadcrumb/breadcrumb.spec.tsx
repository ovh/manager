import { vitest } from 'vitest';
import { waitFor } from '@testing-library/react';
import { render } from '../../utils/test.provider';
import { Breadcrumb } from './breadcrumb.component';

const setupSpecTest = async ({ hideRootLabel }) =>
  waitFor(() =>
    render(
      <Breadcrumb
        rootLabel="vRack services"
        appName="vrack-services"
        hideRootLabel={hideRootLabel}
      />,
    ),
  );

describe('breadcrumb component', () => {
  beforeEach(() => {
    vitest.mock('../../hooks/breadcrumb/useBreadcrumb', () => ({
      useBreadcrumb: vitest.fn(({ hideRootLabel }) => [
        { label: 'vRack services', href: '/', hideLabel: hideRootLabel },
        { label: 'vRack service', href: '/:id', hideLabel: false },
        {
          label: 'vRack service listing',
          href: '/:id/listing',
          hideLabel: false,
        },
      ]),
    }));
  });

  it('should render value 3 breadcrumb items', async () => {
    const { container } = await setupSpecTest({ hideRootLabel: false });
    const items = container.querySelectorAll('ods-breadcrumb-item');
    expect(items.length).toBe(3);
    expect(items[0]).toBeVisible();
    expect(items[1]).toBeVisible();
    expect(items[2]).toBeVisible();
  });

  it('should hide root label', async () => {
    const { container } = await setupSpecTest({ hideRootLabel: true });
    const items = container.querySelectorAll('ods-breadcrumb-item');
    expect(items.length).toBe(2);
  });
});
