import { vitest } from 'vitest';

import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { render } from '@/setupTest';

vitest.mock('@/hooks/breadcrumb/useBreadcrumb', () => ({
  useBreadcrumb: vitest.fn(({ hideRootLabel }) => [
    { label: 'vRack services', href: '/', hideLabel: hideRootLabel },
  ]),
}));

describe('breadcrumb component snapshot', () => {
  it('should render 3 breadcrumb items when hideRootLabel is false', () => {
    const { asFragment } = render(
      <Breadcrumb rootLabel="vRack services" appName="vrack-services" hideRootLabel={false} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should hide root label when hideRootLabel is true', () => {
    const { asFragment } = render(
      <Breadcrumb rootLabel="vRack services" appName="vrack-services" hideRootLabel={true} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
