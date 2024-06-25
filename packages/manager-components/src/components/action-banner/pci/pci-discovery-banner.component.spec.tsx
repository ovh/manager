import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { fireEvent, screen } from '@testing-library/react';
import {
  isDiscoveryProject,
  PciDiscoveryBanner,
  PciDiscoveryBannerProps,
} from './pci-discovery-banner.component';
import { render } from '../../../utils/test.provider';

jest.mock('@ovh-ux/manager-react-shell-client', () => {
  const navigateTo = jest.fn();
  return {
    useNavigation: () => {
      return {
        navigateTo,
      };
    },
  };
});

const renderComponent = (props: PciDiscoveryBannerProps) => {
  return render(<PciDiscoveryBanner {...props} />);
};

describe('PciDiscoveryBanner tests', () => {
  it('should navigate to project activation when clicking on cta', () => {
    const { navigateTo } = useNavigation();
    renderComponent({
      projectId: '123',
    });
    const cta = screen.queryByTestId('actionBanner-button');
    expect(navigateTo).not.toHaveBeenCalled();
    fireEvent.click(cta);
    expect(navigateTo).toHaveBeenCalledWith(
      'public-cloud',
      '#/pci/projects/123/activate',
      {},
    );
  });
  it('should identify discovery projects', () => {
    expect(isDiscoveryProject({ planCode: 'foo' })).toBeFalsy();
    expect(isDiscoveryProject({ planCode: undefined })).toBeFalsy();
    expect(isDiscoveryProject({ planCode: 'project.discovery' })).toBeTruthy();
  });
});
