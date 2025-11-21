import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import NetworkHelper from '../network/NetworkHelper.component';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { GUIDE_LINKS } from '@/hooks/url/useGuideLink.constant';

const trackClick = vi.hoisted(() => vi.fn());

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();

  return {
    ...original,
    useOvhTracking: vi.fn().mockReturnValue(({
      trackClick,
    } as unknown) as {
      trackCurrentPage: () => void;
      trackPage: () => void;
      trackClick: () => void;
    }),
  };
});

describe('Considering NetworkHelper component', () => {
  it('should track the open click', async () => {
    renderWithMockedWrappers(<NetworkHelper />);

    const helpButton = screen.getByText('common:pci_instances_common_help');

    fireEvent.click(helpButton);

    await waitFor(() =>
      expect(trackClick).toHaveBeenCalledWith({
        location: PageLocation.popup,
        actionType: 'action',
        actions: ['add_instance', 'see-helper_network'],
      }),
    );
  });

  it('should track the guide link', async () => {
    renderWithMockedWrappers(<NetworkHelper />);

    const guideLink = screen.getByText(
      `${NAMESPACES.ONBOARDING}:find_out_more`,
    );

    fireEvent.click(guideLink);

    expect(guideLink).toHaveAttribute(
      'href',
      (GUIDE_LINKS['NETWORK'] as { FR: string }).FR,
    );

    await waitFor(() => {
      expect(trackClick).toHaveBeenCalledWith({
        location: PageLocation.funnel,
        buttonType: ButtonType.externalLink,
        actionType: 'action',
        actions: ['add_instance', 'go-to-see-documentation_network'],
      });
    });
  });
});
