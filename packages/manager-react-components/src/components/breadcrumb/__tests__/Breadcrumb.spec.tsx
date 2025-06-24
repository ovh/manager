import { vitest } from 'vitest';
import { waitFor } from '@testing-library/react';
import { render } from '../../../utils/test.provider';
import { Breadcrumb } from '../Breadcrumb.component';

const setupSpecTest = async ({ hideRootLabel }: { hideRootLabel?: boolean }) =>
  render(
    <Breadcrumb
      rootLabel="vRack services"
      appName="vrack-services"
      hideRootLabel={hideRootLabel}
    />,
  );

describe('breadcrumb component', () => {
  beforeEach(() => {
    vitest.mock('../../../hooks/breadcrumb/useBreadcrumb', () => ({
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

  it('should test valid', () => {
    expect(true).toBe(true);
  });
  it('should render 3 breadcrumb items when hideRootLabel is false', async () => {
    expect(true).toBe(true);
    const { container, asFragment } = await setupSpecTest({
      hideRootLabel: false,
    });
    const items = container.querySelectorAll('li');
    expect(items.length).toBe(3);
    expect(items[0]).toBeVisible();
    expect(items[1]).toBeVisible();
    expect(items[2]).toBeVisible();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should hide root label when hideRootLabel is true', async () => {
    const { container, asFragment } = await setupSpecTest({
      hideRootLabel: true,
    });
    const items = container.querySelectorAll('li');
    expect(items.length).toBe(2);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render 3 breadcrumb items when hideRootLabel is not provided', async () => {
    const { container, asFragment } = await setupSpecTest({});
    const items = container.querySelectorAll('li');
    expect(items.length).toBe(3);
    expect(asFragment()).toMatchSnapshot();
  });
});
