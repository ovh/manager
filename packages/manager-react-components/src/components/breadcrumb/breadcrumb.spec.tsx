import { vitest } from 'vitest';
import { waitFor } from '@testing-library/react';
import { render } from '../../utils/test.provider';
import { Breadcrumb } from './breadcrumb.component';

const setupSpecTest = async () =>
  waitFor(() =>
    render(<Breadcrumb rootLabel="vRack services" appName="vrack-services" />),
  );

describe('breadcrumb component', () => {
  beforeEach(() => {
    vitest.mock('../../hooks/breadcrumb/useBreadcrumb', () => ({
      useBreadcrumb: vitest.fn(() => [
        { label: 'vRack services', href: '/' },
        { label: 'vRack service', href: '/:id' },
        { label: 'vRack service listing', href: '/:id/listing' },
      ]),
    }));
  });
  it('should render value 3 breadcrumb items', async () => {
    const { container } = await setupSpecTest();
    const items = container.querySelectorAll('ods-breadcrumb-item');
    expect(items.length).toBe(3);
    expect(items[0]).toBeVisible();
    expect(items[1]).toBeVisible();
    expect(items[2]).toBeVisible();
  });
});
