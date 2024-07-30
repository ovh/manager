import React from 'react';
import { versionsMocked } from '@/_mock_/version';
import { rancherMocked } from '@/_mock_/rancher';
import { ResourceStatus } from '@/api/api.type';
import updateTranslation from '@/public/translations/pci-rancher/updateSoftware/Messages_fr_FR.json';
import { render, waitFor } from '@/utils/test/test.provider';
import DashboardMessages, { DashboardMessagesProps } from './DashboardMessages';

const mockedUsedNavigate = jest.fn();

jest.mock('@ovh-ux/manager-react-shell-client', () => ({
  useTracking: jest.fn(() => ({
    trackPage: jest.fn(),
    trackClick: jest.fn(),
  })),
  useNavigation: jest.fn(() => ({
    getURL: jest.fn(() => Promise.resolve('123')),
    data: [],
  })),
  PageType: {
    popup: 'pop-up',
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
  useParams: () => ({ projectId: '123' }),
}));

const defaultProps: DashboardMessagesProps = {
  editNameBannerType: null,
  versions: versionsMocked,
  isPendingUpdate: false,
  mutationGenerateAccessState: [],
  rancher: rancherMocked,
};

const setupSpecTest = async (props: DashboardMessagesProps = defaultProps) =>
  waitFor(() => render(<DashboardMessages {...props} />));

describe('RancherDetail', () => {
  it('Given that the update software is displayed, it should contain the version of the software and the button to update', async () => {
    const screen = await setupSpecTest({
      ...defaultProps,
    });

    const updateSoftwareLabel = screen.getByText(
      updateTranslation.updateSoftwareBannerAvailableUpdate,
    );

    const updateSoftwareButton = screen.getAllByText(
      updateTranslation.updateSoftwareAvailableUpdate,
    );

    expect(updateSoftwareLabel).not.toBeNull();
    expect(updateSoftwareButton).not.toBeNull();
  });

  it('Given there is higher version but rancher status is not status ready, i should not see update  software banner', async () => {
    const screen = await setupSpecTest({
      ...defaultProps,
      rancher: {
        ...rancherMocked,
        resourceStatus: ResourceStatus.UPDATING,
      },
    });

    const updateSoftwareLabel = screen.queryByText(
      updateTranslation.updateSoftwareBannerAvailableUpdate.replaceAll(
        '{{version}}',
        versionsMocked[1].name,
      ),
    );
    const updateSoftwareButton = screen.queryByText(
      updateTranslation.updateSoftwareAvailableUpdate,
    );

    expect(updateSoftwareLabel).toBeNull();
    expect(updateSoftwareButton).toBeNull();
  });
});
