import React from 'react';
import { describe, it, vi } from 'vitest';
import { waitFor, screen } from '@testing-library/react';
import updateSoftwareTranslation from '../../../public/translations/updateSoftware/Messages_fr_FR.json';
import { render } from '../../utils/test/test.provider';
import { rancherMocked } from '../../_mock_/rancher';
import { versionsMocked } from '../../_mock_/version';
import { ResourceStatus } from '../../types/api.type';
import UpdateVersionBanner from './UpdateVersionBanner.component';

const defaultProps = {
  rancher: rancherMocked,
  isPendingUpdateOperation: false,
  versions: versionsMocked,
};

vi.mock('react-router-dom', () => ({
  useHref: () => vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useTracking: vi.fn(() => ({
    trackPage: vi.fn(),
    trackClick: vi.fn(),
  })),
}));

const setupSpecTest = async (props = defaultProps) => () =>
  render(<UpdateVersionBanner {...props} />);

describe('UpdateVersionBanner', () => {
  it('should display the update software banner when a new version is available and the rancher status is READY', async () => {
    setupSpecTest({
      ...defaultProps,
      rancher: {
        ...rancherMocked,
        resourceStatus: ResourceStatus.READY,
      },
    });

    waitFor(() => {
      const updateSoftwareLabel = screen.getByText(
        updateSoftwareTranslation.updateSoftwareBannerAvailableUpdate,
      );
      const updateSoftwareButton = screen.getByText(
        updateSoftwareTranslation.updateSoftwareAvailableUpdate,
      );

      expect(updateSoftwareLabel).not.toBeNull();
      expect(updateSoftwareButton).not.toBeNull();
    });
  });

  it('should not display the update software banner when the rancher status is not READY', async () => {
    setupSpecTest({
      ...defaultProps,
      rancher: {
        ...rancherMocked,
        resourceStatus: ResourceStatus.UPDATING,
      },
    });

    waitFor(() => {
      const updateSoftwareLabel = screen.queryByText(
        updateSoftwareTranslation.updateSoftwareBannerAvailableUpdate,
      );
      const updateSoftwareButton = screen.queryByText(
        updateSoftwareTranslation.updateSoftwareAvailableUpdate,
      );
      expect(updateSoftwareLabel).toBeNull();
      expect(updateSoftwareButton).toBeNull();
    });
  });

  it('should display a warning banner when the update software response type is pending', async () => {
    setupSpecTest({
      ...defaultProps,
      isPendingUpdateOperation: true,
    });

    waitFor(() => {
      const updateBanner = screen.getByText((content) =>
        content.includes(
          'La version de votre Managed Rancher Service est en cours de mise à jour',
        ),
      );
      expect(updateBanner).not.toBeNull();
    });
  });

  it('should display a warning banner when the current version is deprecated', async () => {
    setupSpecTest({
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

    waitFor(() => {
      const warningBanner = screen.getByText(
        updateSoftwareTranslation.updateSoftwareBannerDeprecated,
      );
      expect(warningBanner).not.toBeNull();
    });
  });
});
