import React from 'react';
import { vi } from 'vitest';
import updateTranslation from '../../../../public/translations/updateSoftware/Messages_fr_FR.json';
import { fireEvent, render, waitFor } from '@/utils/test/test.provider';

import { versionsMocked } from '@/__mocks__/version';
import { rancherMocked } from '@/__mocks__/rancher';

import UpdateSoftware, {
  UpdateSoftwareProps,
} from './UpdateSoftware.component';

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: vi.fn(() => ({
    getURL: vi.fn(() => Promise.resolve('123')),
    data: [],
  })),
  useTracking: vi.fn(() => ({
    trackPage: vi.fn(),
    trackClick: vi.fn(),
  })),
}));

const defaultProps: UpdateSoftwareProps = {
  rancher: rancherMocked,
  versions: versionsMocked,
  isUpdatePending: false,
  onClickUpdate: vi.fn(),
  currentVersionDetails: versionsMocked[0],
};

afterEach(() => {
  vi.clearAllMocks();
});

const setupSpecTest = async (props: UpdateSoftwareProps = defaultProps) =>
  waitFor(() => render(<UpdateSoftware {...props} />));

describe('UpdateSoftware', () => {
  it('should render the component', async () => {
    const { getByText } = await setupSpecTest();
    expect(
      getByText(updateTranslation.updateSoftwareRancherDurationInfo),
    ).toBeInTheDocument();
  });

  describe('Version display', () => {
    it('should see the unavailable version as disabled and not clickable', async () => {
      const { getByText } = await setupSpecTest();

      const notAvailableVersion = getByText(
        `Version ${versionsMocked[2].name}`,
      );

      const radio = notAvailableVersion.closest('osds-radio-button');
      expect(radio).toHaveAttribute('disabled');

      fireEvent.click(radio);

      expect(radio).not.toHaveAttribute('checked');
    });

    describe('Changelog url', () => {
      it('should open the changelog url', async () => {
        const { getAllByText } = await setupSpecTest();

        const newVersion1 = getAllByText(
          updateTranslation.updateSoftwareRancherChangelog,
        );

        const changeLogLink = newVersion1[0].closest('osds-link');
        expect(changeLogLink).toBeInTheDocument();
      });

      it('should not display changelog if there is no url', async () => {
        const { queryByText } = await setupSpecTest({
          ...defaultProps,
          versions: [
            ...versionsMocked.slice(0, 1),
            { ...versionsMocked[1], changelogUrl: undefined },
          ],
        });

        const newVersion1 = queryByText(
          updateTranslation.updateSoftwareRancherChangelog,
        );

        expect(newVersion1).not.toBeInTheDocument();
      });
    });
  });
});
