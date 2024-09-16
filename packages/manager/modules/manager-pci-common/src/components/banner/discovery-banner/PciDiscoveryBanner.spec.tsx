import { describe, vi } from 'vitest';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { fireEvent, screen, render } from '@testing-library/react';
import {
  isDiscoveryProject,
  PciDiscoveryBanner,
  PciDiscoveryBannerProps,
} from './PciDiscoveryBanner';
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
    renderComponent({
      project: { project_id: '123', planCode: 'project.discovery' } as TProject,
    });

    const actionBtn = screen.queryByTestId('actionBanner-button');

    fireEvent.click(actionBtn);

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
