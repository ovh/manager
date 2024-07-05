import { describe, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import {
  isDiscoveryProject,
  PciDiscoveryBanner,
  PciDiscoveryBannerProps,
} from './pci-discovery-banner';
import { TProject } from '@/api/data';

const mockNavigateTo = vi.fn();

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: () => ({
    navigateTo: mockNavigateTo,
  }),
}));

const renderComponent = (props: PciDiscoveryBannerProps) =>
  render(<PciDiscoveryBanner {...props} />);

describe('PciDiscoveryBanner tests', () => {
  it('should navigate to project activation when clicking on cta', () => {
    const { container } = renderComponent({
      project: { project_id: '123', planCode: 'project.discovery' } as TProject,
    });

    const actionLink = container.querySelector('osds-link');

    fireEvent.click(actionLink);

    expect(mockNavigateTo).toHaveBeenCalledWith(
      'public-cloud',
      '#/pci/projects/123/activate',
      {},
    );
  });

  it('should identify discovery projects', () => {
    expect(isDiscoveryProject({ planCode: 'foo' } as TProject)).toBeFalsy();
    expect(isDiscoveryProject({ planCode: undefined } as TProject)).toBeFalsy();
    expect(
      isDiscoveryProject({ planCode: 'project.discovery' } as TProject),
    ).toBeTruthy();
  });
});
