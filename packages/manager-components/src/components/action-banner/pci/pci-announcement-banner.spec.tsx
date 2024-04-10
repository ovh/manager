import { act, fireEvent, render } from '@testing-library/react';
import { PciAnnouncementBanner } from './pci-announcement-banner.component';
import '@testing-library/jest-dom';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (str: string) => str }),
}));

const mockNavigateTo = jest.fn();
jest.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: () => ({ navigateTo: mockNavigateTo }),
}));

describe('PciAnnouncementBanner component Tests', () => {
  it('should display the banner when component is rendered', () => {
    const { getByTestId } = render(
      <PciAnnouncementBanner projectId="projectId" />,
    );

    expect(getByTestId('actionBanner-message_container')).toBeInTheDocument();
    expect(getByTestId('actionBanner-message_container')).toBeVisible();
  });

  it('should navigate to region on btn click', () => {
    const { getByTestId } = render(
      <PciAnnouncementBanner projectId="projectId" />,
    );

    const actionButton = getByTestId('actionBanner-button');

    act(() => {
      fireEvent.click(actionButton);
    });

    expect(mockNavigateTo).toHaveBeenNthCalledWith(
      1,
      'public-cloud',
      '#/pci/projects/projectId/regions',
      {},
    );
  });
});
