import React from 'react';
import { render, waitFor } from '@/utils/test/test.provider';
import { rancherMocked } from '@/_mock_/rancher';
import { versionsMocked } from '@/_mock_/version';
import { ResourceStatus } from '@/api/api.type';
import UpdateVersionBanner from './UpdateVersionBanner';
import updateSoftwareTranslation from '@/public/translations/pci-rancher/updateSoftware/Messages_fr_FR.json';

const defaultProps = {
  rancher: rancherMocked,
  isPendingUpdateOperation: false,
  versions: versionsMocked,
};

const setupSpecTest = async (props = defaultProps) =>
  waitFor(() => render(<UpdateVersionBanner {...props} />));

describe('UpdateVersionBanner', () => {
  it('should display the update software banner when a new version is available and the rancher status is READY', async () => {
    const screen = await setupSpecTest({
      ...defaultProps,
      rancher: {
        ...rancherMocked,
        resourceStatus: ResourceStatus.READY,
      },
    });

    const updateSoftwareLabel = screen.getByText(
      updateSoftwareTranslation.updateSoftwareBannerAvailableUpdate,
    );
    const updateSoftwareButton = screen.getByText(
      updateSoftwareTranslation.updateSoftwareAvailableUpdate,
    );

    expect(updateSoftwareLabel).not.toBeNull();
    expect(updateSoftwareButton).not.toBeNull();
  });

  it('should not display the update software banner when the rancher status is not READY', async () => {
    const screen = await setupSpecTest({
      ...defaultProps,
      rancher: {
        ...rancherMocked,
        resourceStatus: ResourceStatus.UPDATING,
      },
    });

    const updateSoftwareLabel = screen.queryByText(
      updateSoftwareTranslation.updateSoftwareBannerAvailableUpdate,
    );
    const updateSoftwareButton = screen.queryByText(
      updateSoftwareTranslation.updateSoftwareAvailableUpdate,
    );

    expect(updateSoftwareLabel).toBeNull();
    expect(updateSoftwareButton).toBeNull();
  });

  it('should display a warning banner when the update software response type is pending', async () => {
    const { getByText } = await setupSpecTest({
      ...defaultProps,
      isPendingUpdateOperation: true,
    });

    const updateBanner = getByText((content) =>
      content.includes(
        'La version de votre Managed Rancher Service est en cours de mise à jour',
      ),
    );

    expect(updateBanner).not.toBeNull();
  });

  it('should display a warning banner when the current version is deprecated', async () => {
    const screen = await setupSpecTest({
      ...defaultProps,
      versions: [
        {
          name: rancherMocked.currentState.version,
          status: 'UNAVAILABLE',
          cause: 'DEPRECATED',
          changelogUrl: 'https://changelog.com',
        },
      ],
    });

    const warningBanner = screen.getByText(
      updateSoftwareTranslation.updateSoftwareBannerDeprecated,
    );

    expect(warningBanner).not.toBeNull();
  });
});
