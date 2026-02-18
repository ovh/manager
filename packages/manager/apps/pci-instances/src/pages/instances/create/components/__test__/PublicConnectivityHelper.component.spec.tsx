import { describe, expect, it } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import PublicConnectivityHelper from '../network/PublicConnectivityHelper.component';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { GUIDE_LINKS } from '@/hooks/url/useGuideLink.constant';

describe('Considering PublicConnectivityHelper component', () => {
  it('should track the open click', async () => {
    renderWithMockedWrappers(<PublicConnectivityHelper />);

    const helpButton = screen.getByText('common:pci_instances_common_help');

    fireEvent.click(helpButton);

    await waitFor(() =>
      expect(useOvhTracking().trackClick).toHaveBeenCalledWith({
        location: PageLocation.popup,
        actionType: 'action',
        actions: ['add_instance', 'see-helper_public_connectivity'],
      }),
    );
  });

  it('should track the guide link', async () => {
    renderWithMockedWrappers(<PublicConnectivityHelper />);

    const guideLink = screen.getByText(
      `${NAMESPACES.ONBOARDING}:find_out_more`,
    );

    fireEvent.click(guideLink);

    expect(guideLink).toHaveAttribute(
      'href',
      (GUIDE_LINKS['NETWORK_PUBLIC_CONNECTIVITY'] as { FR: string }).FR,
    );

    await waitFor(() => {
      expect(useOvhTracking().trackClick).toHaveBeenCalledWith({
        location: PageLocation.funnel,
        buttonType: ButtonType.externalLink,
        actionType: 'action',
        actions: ['add_instance', 'go-to-see-documentation_network'],
      });
    });
  });
});
