import { vitest } from 'vitest';
import { render } from '../../../utils/test.provider';
import { Breadcrumb } from '../Breadcrumb.component';

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

describe('breadcrumb component', () => {
  it('should render 3 breadcrumb items when hideRootLabel is false', () => {
    const { container } = render(
      <Breadcrumb
        rootLabel="vRack services"
        appName="vrack-services"
        hideRootLabel={false}
      />,
    );
    const items = container.querySelectorAll('li');
    expect(items.length).toBe(3);
    expect(items[0]).toBeVisible();
    expect(items[1]).toBeVisible();
    expect(items[2]).toBeVisible();
  });

  it('should hide root label when hideRootLabel is true', () => {
    const { container } = render(
      <Breadcrumb
        rootLabel="vRack services"
        appName="vrack-services"
        hideRootLabel={true}
      />,
    );
    const items = container.querySelectorAll('li');
    expect(items.length).toBe(2);
  });
});
